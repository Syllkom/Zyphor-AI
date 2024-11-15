import node_cache from 'node-cache';
import axios from 'axios';
import chalk from 'chalk';
import pino from 'pino';
import util from 'util';
import got from 'got';
import fs from 'fs';

import {
    imageWebp,
    videoWebp
} from './converter.js';

import {
    Browsers,
    downloadContentFromMessage,
    generateWAMessageContent,
    generateWAMessageFromContent,
    makeCacheableSignalKeyStore,
    useMultiFileAuthState
} from '@whiskeysockets/baileys';

import Jimp from 'jimp';

const { default: makeWASocket, proto } = (await import('@whiskeysockets/baileys')).default;

export const logger = {
    log: (...args) => {
        console.log('\x1b[1;31m~\x1b[1;37m>',
            chalk.white('['),
            chalk.blue(global.botName),
            chalk.white(']'),
            chalk.blue(':'),
            chalk.green('{'),
            chalk.rgb(255, 131, 0).underline(util.format(...args)),
            chalk.green('}'));
    },
    info: (...args) => {
        console.log('\x1b[1;31m~\x1b[1;37m>',
            chalk.white('['),
            chalk.yellow('Info:Bot'),
            chalk.white(']'),
            chalk.blue(':'),
            chalk.green('{'),
            chalk.rgb(255, 131, 0).underline(util.format(...args)),
            chalk.green('}'),
            chalk.magenta('!'));
    },
    error: (...args) => {
        console.log('\x1b[1;31m~\x1b[1;37m>',
            chalk.white('['),
            chalk.redBright('Error:Bot'),
            chalk.white(']'),
            chalk.blue(':'),
            chalk.green('{'),
            chalk.redBright(util.format(...args)),
            chalk.green('}'),
            chalk.redBright('!?'));
    }
};

export async function makeWABot(conn = { connectType: 'qr-code', phoneNumber: '' }, store) {
    const { state, saveCreds } = await useMultiFileAuthState(`${global['@config'].directorySetup.system}/creds`);

    const connection = { logger: pino({ level: 'silent' }), auth: { creds: state.creds, keys: await makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })) }, browser: Browsers.ubuntu("Chrome"), mobile: false, syncFullHistory: true, printQRInTerminal: conn.connectType == 'qr-code' ? true : false, connectTimeoutMs: 60000, defaultQueryTimeoutMs: 0, keepAliveIntervalMs: 10000, emitOwnEvents: true, fireInitQueries: true, markOnlineOnConnect: true, generateHighQualityLinkPreview: false, getMessage: async (key) => { if (store) { return await (store.loadMessage(key.remoteJid, key.id))?.message || undefined } return proto.Message.fromObject({}) } }

    if (conn.connectType == 'qr-code') { connection.browser = Browsers.macOS('Desktop') }

    const sock = makeWASocket(connection);
    sock['node-cache'] = new node_cache()
    sock.ev.on('creds.update', saveCreds);
    store?.bind(sock.ev);

    if (conn.connectType == 'pin-code') {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const pairingCode = await sock.requestPairingCode(conn.phoneNumber.replace(/\D/g, ''));
        return { PairingCode: pairingCode, state, store, ...sock, proto };
    } else { return { ...sock, state, store, proto } }
}

export async function connAssing(conn) {
    try {
        conn.Baileys = async () => { return (await import('@whiskeysockets/baileys')).default }

        conn.getFile = async (URL) => (await got(URL, { responseType: 'buffer', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36', 'Accept': '*/*', 'Connection': 'keep-alive', 'Range': 'bytes=0-' } })).body

        conn.getJSON = async (URL, options = {}) => { if (URL) { try { return await (await axios({ method: 'GET', url: URL, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36' }, ...options })).data } catch (e) { return e } } else throw new Error('URL?') }

        conn.uploadFileToTmp = async (file) => {
            try {
                const form = new FormData()
                file = Buffer.isBuffer(file) ? file : (await got(file, { responseType: 'buffer' })).body
                form.append('file', file, { filename: 'image.jpg' })
                const tmp = await got.post('https://tmpfiles.org/api/v1/upload', { body: form, headers: { ...form.getHeaders() } })
                return (JSON.parse(tmp.body).data.url).replace('tmpfiles.org/', 'tmpfiles.org/dl/')
            } catch (e) {
                logger.error(e)
            }
        }

        conn.downloadMediaMessage = async (message) => {
            const mime = message.mimetype || "";
            let messageType = mime.split("/")[0];
            const stream = await downloadContentFromMessage(message, messageType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]); }
            return buffer;
        }

        conn.sendSticker = async (jid, sticker, quoted, options = {}) => {
            if (!sticker) return logger.error('conn.sendSticker(jid, sticker ? undefined')
            let buff = Buffer.isBuffer(sticker.sticker) ? sticker.sticker : sticker.sticker.url ? await conn.getFile(sticker.sticker.url) : fs.existsSync(sticker.sticker) ? fs.readFileSync(sticker.sticker) : Buffer.alloc(0);
            return await conn.sendMessage(jid, { sticker: sticker.mediaType == 'video' ? await videoWebp(buff, options) : await imageWebp(buff, options), ...options }, { quoted })
        }

        conn.sendWAMContent = async (jid, message, options = {}) => {
            const gmessage = generateWAMessageFromContent(jid, message, options)
            await conn.relayMessage(jid, gmessage.message, {})
        }

        conn.saveMessageIdForResponse = (message, options = {}) => {
            if (!conn['d@base'].responseCommand) conn['d@base'].responseCommand = {}
            conn['d@base'].responseCommand[message.key.id] = { ...(options || {}) }
        }

        conn.sendButton = async (jid, text = [], media = null, buttons = [], quoted, options = {}) => {
            let mediaType;
            let mediaMessage = {};
            let type;

            if (media) {
                const [message, source] = media[0].split(':');
                const content = { [message]: source === 'url' ? { url: media[1] } : source === 'true' ? Buffer.alloc(5) : media[1], ...(media[2] || {}) };
                mediaType = await generateWAMessageContent(content, { upload: conn.waUploadToServer });
                type = Object.keys(mediaType)[0];
                mediaMessage[type] = mediaType[type];
            }

            const dynamicButtons = buttons.map(btn => {
                let buttonParams = {};
                if (btn.name == 'single_select') {
                    buttonParams = { title: btn.button[0], sections: btn.button[1] }
                } else if (btn.name == 'reminder') {
                    buttonParams = { display_text: btn.button[0], id: btn.button[1] }
                } else if (btn.name === 'url') {
                    buttonParams = { display_text: btn.button[0], url: btn.button[1], merchant_url: btn.button[1] };
                } else if (btn.name === 'copy') {
                    buttonParams = { display_text: btn.button[0], copy_code: btn.button[1] };
                } else if (btn.name === 'reply') {
                    buttonParams = { display_text: btn.button[0], id: btn.button[1] };
                }
                return {
                    name: btn.name == 'single_select' ? 'single_select' : btn.name === 'reply' ? 'quick_reply' : `cta_${btn.name}`,
                    buttonParamsJson: JSON.stringify(buttonParams)
                };
            });

            const interactiveMessage = {
                header: mediaMessage[type] ? { title: text[0] || '', hasMediaAttachment: false, [type]: mediaMessage[type] } : { title: text[0] || '', hasMediaAttachment: false },
                body: { text: text[1] || '' },
                footer: { text: text[2] || '' },
                contextInfo: options,
                nativeFlowMessage: {
                    buttons: dynamicButtons,
                    messageParamsJson: ''
                }
            }

            const message = await generateWAMessageFromContent(jid, { viewOnceMessage: { message: { interactiveMessage } } }, quoted ? { quoted } : {})

            return await conn.relayMessage(jid, message.message, {});
        }

        // resizePhoto
        conn.resizePhoto = async (data = { image: '', scale: 720, result: 'buffer' }) => {
            if (!data.image) return new Error('conn.resizePhoto( image ? )')
            const jimp = await Jimp.read(data.image);
            const cropped = jimp.crop(0, 0, jimp.getWidth(), jimp.getHeight());
            const scaledImage = cropped.scaleToFit(data.scale, data.scale);
            return data.result === 'base64' ?
                (await scaledImage.getBase64Async(Jimp.MIME_JPEG)).replace(/^data:image\/\w+;base64,/, '')
                : await scaledImage.getBufferAsync(Jimp.MIME_JPEG);
        }


        //getChatData
        conn.getChatData = async (chat, message) => {
            if (!chat) return new Error('conn.getChatData( chat ? )')
            let m = { id: chat }
            m.group = m.id.endsWith('@g.us')
            m.metaData = m.group ? (await conn.groupMetadata(m.id) || {}) : {}
            m.name = m.metaData.subject || 'undefined'
            m.description = m.metaData.desc || 'undefined'
            m.participants = m.metaData.participants || []
            m.admins = m.participants.filter(o => o.admin !== null).map(v => v.id) || []
            m.owner = m.metaData.owner || m.metaData.subjectOwner || 'undefined'
            m.photo = async (type = 'image') => await conn.profilePictureUrl(m.id, type).catch(_ => 'https://objetivoligar.com/wp-content/uploads/2017/03/blank-profile-picture-973460_1280-768x768.jpg')
            m.change = {
                description: async (text) => await conn.groupUpdateDescription(m.id, text),
                name: async (text) => await conn.groupUpdateSubject(m.id, text),
                photo: async (image, type = 'normal') => type == 'normal' ? await conn.updateProfilePicture(m.id, image) : await conn.query({ tag: 'iq', attrs: { target: m.id, to: '@s.whatsapp.net', type: 'set', xmlns: 'w:profile:picture' }, content: [{ tag: 'picture', attrs: { type: 'image' }, content: await conn.resizePhoto({ image: image, scale: 720, result: 'buffer' }) }] })
            }
            if (m.admins.includes(`${conn.user.id.split(":")[0]}@s.whatsapp.net`)) {
                m.InviteCode = async () => await conn.groupInviteCode(m.id)
                m.InviteLink = async () => `https://chat.whatsapp.com/${await m.InviteCode()}`
            }
            return m
        }

        //getUserData
        conn.getUserData = async (user, message) => {
            if (!user) return new Error('conn.getUserData( user ? )')
            let m = { id: user, mentioned: [] }
            m.number = m.id.split('@')[0] || undefined
            m.bot = (conn.user.id.split(":")[0] + "@s.whatsapp.net") == m.id
            m.photo = async (type = 'image') => await conn.profilePictureUrl(m.id, type).catch(_ => 'https://objetivoligar.com/wp-content/uploads/2017/03/blank-profile-picture-973460_1280-768x768.jpg')
            m.description = async () => (await conn.fetchStatus(m.id) || {})?.status || 'undefined'
            m.role = (Array) => Array.some(role => conn.data['@users'][m.id].roles[role])
            m.waLink = `https://wa.me/${m.number}`
            if (m.bot) m.change = {
                description: async (text) => await conn.updateProfileStatus(text),
                name: async (text) => await conn.updateProfileName(text),
                photo: async (image, type = 'normal') => type == 'normal' ? await conn.updateProfilePicture(m.id, image) : await conn.query({ tag: 'iq', attrs: { to: '@s.whatsapp.net', type: 'set', xmlns: 'w:profile:picture' }, content: [{ tag: 'picture', attrs: { type: 'image' }, content: await conn.resizePhoto({ image: image, scale: 720, result: 'buffer' }) }] })
            }
            return m
        }

    } catch (e) { logger.error(e) }
    return conn
}

export async function mAssing(m, conn) {
    try {
        conn.download = () => { return conn.downloadMediaMessage(m.SMS().message[m.type(m.SMS().message)]) }
        conn.stubType = async () => {
            if (typeof m.messageStubType == 'undefined') return false
            const even = proto.WebMessageInfo.StubType
            return Object.keys(even).find(key => even[key] === m.messageStubType)
        }

        m.reply = async (text, title = 'ZyphorAI', before = global.botName) => {
            if (typeof text == 'string') { await conn.relayMessage(m.chat.id, (await generateWAMessageFromContent(m.chat.id, { viewOnceMessage: { message: { interactiveMessage: { header: { title: title, hasMediaAttachment: false }, body: { text: text }, footer: { text: '@' + before }, contextInfo: { mentionedJid: (text.match(/@(\d{0,16})/g) || []).map(v => v.slice(1) + '@s.whatsapp.net') }, carouselMessage: { cards: [] } } } } }, { timestamp: new Date(), quoted: m })).message, {}) } else return new Error('[E]: m.reply(string ?)')
        }

        m.react = async (text) => {
            const sendReaction = async (text) => await conn.sendMessage(m.chat.id, { react: { text, key: m.key } });
            if (text === 'error' || text === 'done' || text === 'wait') {
                const reactionKey = { 'done': 'success', 'wait': 'waiting', 'error': 'failure' }[text];
                const reactions = global['@config'].botConfig.reactions[reactionKey];
                await sendReaction(reactions);
            } else {
                await sendReaction(text);
            }
        }

        m.SMS = () => {
            const mensage = m.quoted ? m.contextInfo.quotedMessage : m.message
            return { key: { remoteJid: m.key.remoteJid, fromMe: m.key.fromMe, id: m.key.id, participant: m.key.participant }, messageTimestamp: m.messageTimestamp, pushName: m.pushName, broadcast: m.broadcast, message: { [m.type(mensage)]: mensage[m.type(mensage)] } }
        }

        m.sms = (type) => {
            let msg = { rowner: 'Este comando solo puede ser utilizado por el *dueño*', owner: 'Este comando solo puede ser utilizado por un *propietario*', modr: 'Este comando solo puede ser utilizado por un *moderador*', premium: 'Esta solicitud es solo para usuarios *premium*', group: 'Este comando solo se puede usar en *grupos*', private: 'Este comando solo se puede usar por *chat privado*', admin: 'Este comando solo puede ser usado por los *administradores del grupo*', botAdmin: 'El bot necesita *ser administrador* para usar este comando', unreg: 'Regístrese para usar esta función escribiendo:\n\n.registrar nombre.edad', restrict: 'Esta función está desactivada' }[type]
            if (msg) return m.reply(msg)
        }

    } catch (e) { logger.error(e) }
}

/*const CatBox = async (file, userhash) => {
    const formData = new FormData();
    formData.append('fileToUpload', file, { filename: 'upload' });
    formData.append('userhash', userhash);
    formData.append('reqtype', 'fileupload');
    const CatBox = await axios.post('https://catbox.moe/user/api.php', formData, { headers: { ...formData.getHeaders(), 'Content-Type': 'multipart/form-data' } });
    if (CatBox.data.success) return CatBox.data.url
    return CatBox.data
}*/

//conn.CatBox = CatBox