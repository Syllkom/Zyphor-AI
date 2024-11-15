import { Boom } from '@hapi/boom';
import { DisconnectReason, makeInMemoryStore } from '@whiskeysockets/baileys';
import { JSONFileSync } from 'lowdb/node';
import moment from 'moment-timezone';
import { watch } from 'chokidar';
import minimist from 'minimist';
import { LowSync } from 'lowdb';
import chalk from 'chalk';
import path from 'path';
import pino from 'pino';
import util from 'util';
import fs from 'fs';

const { proto } = (await import('@whiskeysockets/baileys')).default
const config = JSON.parse(fs.readFileSync(path.resolve('./config.json')));
const {
    logger,
    connAssing,
    makeWABot,
    mAssing
} = await import(`./${config.directorySetup.system}/utils/Simple.js`)

try {
    let setupObject;
    const commands = new Map();
    const stubtype = new Map();
    const Process = minimist(process.argv.slice(2));
    let args = Process._[0] ? JSON.parse(Process._[0]) : {};
    global.readMore = String.fromCharCode(8206).repeat(850);
    global.botName = config.botConfig.nameBot;
    global.icon = fs.readFileSync('./imagenes/icon.png')
    global.aicover = fs.readFileSync('./imagenes/aicover.png')
    global.hostWa = fs.readFileSync('./imagenes/hostWa.png')
    global.mylogo = fs.readFileSync('./imagenes/mylogo.png')
    global.Syllkom = 'https://beacons.ai/Syllkom'
    global.CanalZp = 'https://whatsapp.com/channel/0029VaiYDdB89inkuoRbEV13'
    global.TextBot = 'Powered by @Syllkom'
    global.BotName = '@ZyphorAI'
    global.ptn = '●'
    global.author = '○ Zyphor-AI - 𝟸𝟺/𝟽'
    global.desc = 'WhatsApp Easy Chat Assistant'
    global['@config'] = config;
    let store;
    let db;

    const dataBot = new LowSync(new JSONFileSync(path.resolve(`./${config.directorySetup.system}/store/data.bot.json`)), {});
    dataBot.read();

    if (config.dataStorage.database.active) {
        db = new LowSync(new JSONFileSync(path.resolve(`./${config.directorySetup.system}/store/${config.dataStorage.database.fileName}.json`)), {});
        global.db = db
        db.read();
    }

    if (config.directorySetup?.foldersToCreate?.length) {
        for (const { baseDir, subfolders } of config.directorySetup.foldersToCreate) { for (const folderName of subfolders) { if (!fs.existsSync(path.join(baseDir, folderName))) { fs.mkdirSync(path.join(baseDir, folderName), { recursive: true }), logger.info(`"${folderName}" folder created`) } } }
    }

    const tmpDir = path.resolve(`./${config.directorySetup.system}/tmp`);

    setInterval(async () => {
        try { await Promise.all((await fs.promises.readdir(tmpDir)).map(async (file) => { try { await fs.promises.unlink(path.join(tmpDir, file)) } catch (error) { logger.error(`Failed to delete ${file}:`, error) } })) } catch (error) { logger.error(error) }
    }, config.botConfig.tmpClear)

    if (config.dataStorage.store.active) {
        store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
    }

    if (dataBot.data) setInterval(async () => {
        await dataBot.write();
    }, 1000 * 60 * 2);

    if (db) setInterval(async () => {
        await db.write();
    }, config.dataStorage.database.interval)

    const Import = async (file, folder, type = 'commands') => {
        if (file.endsWith('.js')) { await import(`./${config.botConfig.botModules.coreDir}/${folder}/${file}?update=${Date.now()}`).then(_file => type == 'commands' ? commands.set(file, { fileName: [file], ...(_file?.default || {}) }) : stubtype.set(file, { fileName: [file], ...(_file?.default || {}) })).catch(error => logger.error(file, ':', error)) }
    }

    watch(path.resolve(`./${config.botConfig.botModules.coreDir}/${config.botConfig.botModules.pluginsDir}`), { persistent: true }).on('add', async (file) => await Import(path.basename(file), config.botConfig.botModules.pluginsDir)).on('change', async (file) => {
        file = path.basename(file);
        if (commands.has(file)) commands.delete(file);
        setTimeout(async () => {
            await Import(file, config.botConfig.botModules.pluginsDir);
            logger.log('modified:', file);
        }, 1000);
    }).on('unlink', async (file) => {
        file = path.basename(file);
        if (commands.has(file)) commands.delete(file);
        logger.log('Deleted file:', file);
    }).on('error', error => logger.error(error));

    watch(path.resolve(`./${config.botConfig.botModules.coreDir}/${config.botConfig.botModules.logicDir}`), { persistent: true }).on('add', async (file) => await Import(path.basename(file), config.botConfig.botModules.logicDir, 'stubtype')).on('change', async (file) => {
        file = path.basename(file);
        if (stubtype.has(file)) stubtype.delete(file);
        setTimeout(async () => {
            await Import(file, config.botConfig.botModules.logicDir, 'stubtype');
            logger.log('modified:', file);
        }, 1000);
    }).on('unlink', async (file) => {
        file = path.basename(file);
        if (stubtype.has(file)) stubtype.delete(file);
        logger.log('Deleted file:', file);
    }).on('error', error => logger.error(error));

    commands.set('plugins', async (criteria) => {
        return Array.from(commands.values()).filter(plugin => Object.keys(criteria).every(key => {
            const value = criteria[key];
            const pluginValue = plugin[key];
            if (value === undefined || (typeof value === 'boolean' && value)) { return !(key in plugin) || pluginValue === true } else if (typeof value === 'string') { return Array.isArray(pluginValue) && pluginValue.includes(value) } else { return typeof value === typeof pluginValue && pluginValue === value }
        }));
    });

    stubtype.set('stubtype', async (criteria) => {
        return Array.from(stubtype.values()).filter(stubtype => Object.keys(criteria).every(key => {
            const value = criteria[key];
            const stubtypeValue = stubtype[key];
            if (value === undefined || (typeof value === 'boolean' && value)) { return !(key in stubtype) || stubtypeValue === true } else if (typeof value === 'string') { return Array.isArray(stubtypeValue) && stubtypeValue.includes(value) } else { return typeof value === typeof stubtypeValue && stubtypeValue === value }
        }))
    });

    if (store) {
        store.readFromFile(path.resolve(`./${config.directorySetup.system}/store/${config.dataStorage.store.fileName}.json`));
        setInterval(async () => {
            store.writeToFile(path.resolve(`./${config.directorySetup.system}/store/${config.dataStorage.store.fileName}.json`));
            logger.info(`Data store saved: store/${config.dataStorage.store.fileName}.json`);
        }, config.dataStorage.store.interval);
    }

    // setupLogic
    try {
        const setupLogic = await import(`./${config.botConfig.botModules.coreDir}/${config.botConfig.botModules.evalScripts.setupScript}`);
        const result = await setupLogic.default();
        if (result === 'exit(1)') process.exit(1)
        if (typeof result == 'object') {
            setupObject = result
        }
    } catch (error) {
        console.error(error);
    }


    async function StartBot(stMessage) {
        const conn = await makeWABot(stMessage ? stMessage : args, store)

        Object.assign(conn, {
            logger: logger,
            '@dbBot': dataBot,
            commands: commands,
            ...(setupObject ?? {}),
            'd@base': dataBot.data,
            ...(await connAssing(conn))
        })

        if (db) {
            conn.db = db
            conn.data = db.data
        }

        if (conn.PairingCode) {
            const code = conn.PairingCode.match(/.{1,4}/g)?.join("-");
            logger.log('Pairing-PinCode:', code)
        }

        if (!conn.before) { conn.before = {} }

        conn.ev.on('connection.update', async (update) => {
            const { lastDisconnect } = update;
            if (update.connection === 'close') {
                const reason = new Boom(lastDisconnect?.error)?.output?.statusCode || 500;
                if (reason === DisconnectReason.restartRequired) {
                    await StartBot({ connectType: 'qr-code' })
                } else {
                    logger.error(`Conexión cerrada, code ${reason}`);
                    if (reason !== DisconnectReason.loggedOut) {
                        logger.info('Restarting()...');
                        await StartBot({ connectType: 'qr-code' })
                    }
                }
            }
            if (update.connection === 'open') {
                logger.log('Connected')
                if (config.botConfig.numeroBot !== conn.user.id.split(":")[0]) {
                    config.botConfig.numeroBot = conn.user.id.split(":")[0]
                    fs.writeFileSync(path.resolve('./config.json'), JSON.stringify(config, null, 2))
                }
            }
            if (update.qr) { logger.log('Pairing-QrCode:', 'Qrcode()...') }
        })

        conn.ev.on('messages.upsert', async (m) => {
            let message_org = JSON.stringify(m, null, 2)
            await m.messages.forEach(async m => {
                try {
                    m.message_org = message_org
                    m.type = (message = { _: null }, object = false) => {
                        if (object) return Object.keys(message).find(o => o == object)
                        else return Object.keys(message)[0]
                    }

                    if (m.key) {
                        m.chat = { id: m.key.remoteJid }
                        m.chat.group = m.chat.id.endsWith('@g.us')
                        m.sender = {
                            id: m.key.remoteJid.endsWith('@s.whatsapp.net') ?
                                m.key.remoteJid : m.key.participant,
                            number: m.key.remoteJid.split('@')[0] || undefined,
                        }
                        m.bot = { id: conn.user.id.split(":")[0] + "@s.whatsapp.net" }
                        m.sender.bot = m.sender.id == m.bot.id
                        m.sender.name = m.pushName
                    }

                    // Auto read
                    if (config.botConfig.autoRead) {
                        await conn.readMessages([m.key]);
                    }

                    // preLogic
                    try {
                        const preLogic = await import(`./${config.botConfig.botModules.coreDir}/${config.botConfig.botModules.evalScripts.preScript}?update=${Date.now()}`);
                        const result = await preLogic.default(m, conn);
                        if (result === 'exit(1)') return;
                    } catch (error) {
                        console.error(error);
                    }

                    if (m.key) {
                        Object.assign(m.bot, await conn.getUserData(m.bot.id, m));
                        Object.assign(m.sender, await conn.getUserData(m.sender.id, m));
                        Object.assign(m.chat, await conn.getChatData(m.chat.id, m));
                        m.bot.fromMe = m.key.fromMe || false

                        if (m.chat.group) {
                            m.bot.admin = m.chat.admins.includes(m.bot.id) || false
                            m.sender.admin = m.chat.admins.includes(m.sender.id) || false
                        }
                    }
                    try {
                        // Imprime los mensajes filtrados
                        console.log(conn.store.messages[m.chat.id].array.length)

                    } catch (e) {

                    }

                    await mAssing(m, conn)

                    if (m.messageStubType) {
                        const even = proto.WebMessageInfo.StubType
                        const evento = Object.keys(even).find(key => even[key] === m.messageStubType)
                        const stubType = await stubtype.get('stubtype')({ stubtype: evento })
                        if (stubType[0]) { return await stubType[0].script(m, { conn, even: evento, parameters: m.messageStubParameters }) }
                    }

                    if (m.message && m.key) {
                        const message = m.message[m.type(m.message)];
                        m.contextInfo = message?.contextInfo || null;

                        const getMessageBody = (message) => m.type(message, 'conversation') ? message.conversation : m.type(message, 'imageMessage') ? message.imageMessage.caption : m.type(message, 'videoMessage') ? message.videoMessage.caption : m.type(message, 'extendedTextMessage') ? message.extendedTextMessage.text : m.type(message, 'templateButtonReplyMessage') ? message.templateButtonReplyMessage.selectedId : m.type(message, 'interactiveResponseMessage') ? (JSON.parse(message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)).id : false

                        m.body = await getMessageBody(m.message);

                        if (m.contextInfo?.quotedMessage) {
                            if (conn['d@base'].responseCommand) {
                                const resCmd = conn['d@base'].responseCommand[m.contextInfo.stanzaId]
                                if (resCmd) Object.keys(resCmd.response).forEach(o => { if ((m.body?.trim().toLowerCase()) == o) { if (resCmd.user == 'all') { m.body = resCmd.response[o].command } else if (resCmd.user == m.sender.id) { m.body = resCmd.response[o].command } } })
                            }
                        }

                        m.tag = m.body ? (m.body.match(/tag=[^ ]+/g) || []).map(tag => tag.split('=')[1]) : [];
                        m.budy = m.tag.length > 0 ? m.body.replace(/tag=[^\s]+/g, '') : m.body || '';
                        m.budy = typeof m.budy === 'string' ? m.budy.split(/ +/).join('  ') : m.budy || '';
                        m.args = m.budy.trim().split(/ +/).slice(1)
                        m.text = m.args.length > 0 ? m.args.join(" ") : null

                        if (config.botConfig.prefix) {
                            m.command = m.budy.substring(1).trim().split(/ +/)[0].toLowerCase();
                            m.isCmd = (config.botConfig.prefix).includes(m.budy[0]) && (await commands.get('plugins')({ command: m.command, usePrefix: true }))[0] ? m.command : false
                            if (!m.isCmd) {
                                m.command = m.budy.trim().split(/ +/)[0].toLowerCase()
                                m.isCmd = (await commands.get('plugins')({ command: m.command, usePrefix: false }))[0] ? m.command : false
                            }
                        } else {
                            m.command = m.budy.trim().split(/ +/)[0].toLowerCase()
                            m.isCmd = (await commands.get('plugins')({ command: m.command }))[0] ? m.command : false;
                        }

                        console.log('\x1b[1;31m~\x1b[1;37m>', chalk.white('['), chalk.magenta(moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('HH:mm:ss')).trim(), chalk.white(']'), chalk.blue(m.isCmd ? `COMANDO:` : `MENSAJE:`), chalk.green('{'), chalk.rgb(255, 131, 0).underline(m.budy == '' ? m.type(m.message) + '' : m.budy), chalk.green('}'), chalk.blue(m.isCmd ? 'Por' : 'De'), chalk.cyan(m.sender.name), 'Chat', m.chat.group ? chalk.bgGreen('grupo:' + (m.chat.name || m.chat.id)) : chalk.bgRed('Privado:' + m.sender.name || m.sender.id))

                        if (m.contextInfo) {
                            m.sender.mentioned = m.contextInfo.mentionedJid || [];
                            if (m.contextInfo.quotedMessage) {
                                m.quoted = { key: { remoteJid: m.contextInfo.remoteJid || m.chat.id, fromMe: m.contextInfo.participant == m.bot.id, id: m.contextInfo.stanzaId, participant: m.contextInfo.participant }, message: m.contextInfo.quotedMessage, sender: await conn.getUserData(m.contextInfo.participant) || {} }
                                m.quoted.body = await getMessageBody(m.quoted.message)
                            }
                        }

                        //cache
                        if (m.chat.id) {
                            if (!conn['node-cache'].has(m.chat.id)) conn['node-cache'].set(m.chat.id, []);
                            const msgCache = conn['node-cache'].get(m.chat.id);
                            if (m.key && m.key.participant) {
                                if (msgCache.length >= 100) msgCache.pop()
                                msgCache.unshift({ key: m.key, message: JSON.stringify(m.message) })
                                conn['node-cache'].set(m.chat.id, msgCache)
                            }
                        }

                        // postEvalLogic
                        try {
                            const postLogic = await import(`./${config.botConfig.botModules.coreDir}/${config.botConfig.botModules.evalScripts.postScript}?update=${Date.now()}`);
                            const result = await postLogic.default(m, conn);
                            if (result === 'exit(1)') return;
                        } catch (error) {
                            logger.error(error);
                        }

                        try {
                            const command = await conn.commands.get('plugins')({ command: m.command })
                            if (command[0]) return await command[0].script(m, { conn, store })
                        } catch (e) {
                            logger.error(util.format(e));
                            await m.react('error')
                            return await conn.sendMessage(`${config.botConfig.owner}@s.whatsapp.net`, { text: `*[ Evento - ERROR ]*\n\n- Comando:* ${global.prefix + m.command}\n- Usuario:* wa.me/${m.sender.number}\n- Chat:* ${m.chat.id}\n${global.readMore}\n*\`[ERORR]\`:* ${util.format(e)}\n` }, { quoted: m })
                        }

                    } else { console.log(message_org) }
                } catch (e) { logger.error(e) }
            })
        })
    }
    await StartBot()
} catch (e) { logger.error(e) }