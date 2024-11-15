/**
 * Gestiona el mensaje `m` y la conexión `conn`.
 * Si ocurre alguna condición que requiera terminar el proceso,
 * se utiliza `return 'exit(1)'`.
 * 
 * @param {object} m - El mensaje que se está procesando.
 * @param {object} conn - La conexión que se está utilizando.
 */

const { generateWAMessageFromContent } = (await import('@whiskeysockets/baileys')).default

export default async (m, conn) => {
    const chat = await conn.data['@chats'][m.chat.id]
    const { antiLink, antiOnce, antiDelete } = chat.settings

    if (conn.data['@bot'][m.bot.id].settings) {
        const db = conn.data['@bot'][m.bot.id].settings
        if (db.globalUse) {
            if (db.globalUse == 'admin' && !(m.sende.role(['admin', 'owner', 'rowner']))) {
                conn.logger.info('[globalUse = admin]: The sender is not an admin.')
                return 'exit(1)'
            }
            else if (db.globalUse == 'owner' && !(m.sende.role(['owner', 'rowner']))) {
                conn.logger.info('[globalUse = owner]: The sender is not an owner.')
                return 'exit(1)'
            }
            else if (db.globalUse == 'rowner' && !(m.sende.role(['rowner']))) {
                conn.logger.info('[globalUse = admin]: The sender is not an ROwner.')
                return 'exit(1)'
            }
        }
    }

    if (antiLink.antiLink) {
        const { WhatsApp, facebook, YouTube, TikTok, X, Telegram, Discord } = antiLink
        const enlaces = { youtube: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/ig, tiktok: /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/(@[A-Za-z0-9._]{1,24}\/video\/[0-9]{1,19})/ig, facebook: /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:[a-zA-Z0-9.]+\/videos\/|watch\/?\?v=)([0-9]+)/ig, whatsapp: /(?:https?:\/\/)?(?:chat\.whatsapp\.com\/[A-Za-z0-9]{22})/ig, twitter: /(?:https?:\/\/)?(?:www\.)?(?:x|twitter)\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/ig, Telegram: /https?:\/\/t\.me\/(\w+)\/(\d+)/ig, Discord: /(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discordapp\.com\/invite)\/([a-zA-Z0-9]+)/ig }

        const searchLink = async (regex, platform) => {
            const match = m.budy.match(regex);
            if (match) {
                const UserType = ['admin', 'owner', 'modr', 'rowner'].some(role => m.sender[role]);
                if (UserType) return await m.react('👀')
                const grupoDesc = m.chat.description.match(regex)
                if (grupoDesc && match[0] === grupoDesc[0]) return await m.react('👀')
                if (match[0] && m.bot.id !== m.sender.id && !match[0].includes(m.chat.link)) {
                    await conn.sendMessage(m.chat.id, { delete: { remoteJid: m.chat.id, fromMe: false, id: m.key.id, participant: m.key.participant } });
                    await conn.groupParticipantsUpdate(m.chat.id, [m.sender.id], 'remove')
                    await conn.sendMessage(m.chat.id, { text: 'Enlace de ' + platform + ' detectado.' })
                }
            }
        }

        if (WhatsApp) await searchLink(enlaces.whatsapp, 'WhatsApp')
        if (YouTube) await searchLink(enlaces.youtube, 'YouTube')
        if (TikTok) await searchLink(enlaces.tiktok, 'TikTok')
        if (Telegram) await searchLink(enlaces.Telegram, 'Telegram');
        if (Discord) await searchLink(enlaces.Discord, 'Discord')
        if (facebook) await searchLink(enlaces.facebook, 'Facebook');
        if (X) await searchLink(enlaces.twitter, 'X (Twitter)')
    }

    if (antiOnce.antiOnce) {
        const message = m.message
        const messageType = m.type(message)

        if ((/viewOnceMessageV2/g).test(messageType) && !m.fromMe) {
            const mediaMessage = message[messageType].message
            const mediaType = m.type(mediaMessage)
            delete mediaMessage[mediaType].viewOnce
            const { audio, video, image, admin } = antiOnce
            const isAdmin = admin ? m.sender.admin : false

            const sendMTP = async () => await conn.relayMessage(m.chat.id, (await generateWAMessageFromContent(m.chat.id, mediaMessage, { quoted: m })).message, {})

            if ((/audio/g).test(mediaType) && audio && !isAdmin) {
                await m.react('❗')
                await sendMTP()
            } else if ((/video/g).test(mediaType) && video && !isAdmin) {
                await m.react('❗')
                await sendMTP()
            } else if ((/image/g).test(mediaType) && image && !isAdmin) {
                await m.react('❗')
                await sendMTP()
            } if (isAdmin) await m.react('👀')
        }
    }

    if (antiDelete.antiDelete) {
        if (m.bot.fromMe) return;
        if (m.message.protocolMessage) {
            const protocolMessage = m.message.protocolMessage;
            if (protocolMessage.type == 0) {
                const smsCache = await conn['node-cache'].get(m.chat.id);
                const smsDelete = smsCache.find(o => o.key.id === protocolMessage.key.id);
                if (!smsDelete) return;
                const message = JSON.parse(smsDelete.message)
                const messageType = m.type(message)
                if ((/viewOnceMessageV2/g).test(messageType) && message.viewOnceMessageV2) {
                    const Message = message[messageType].message
                    delete Message[m.type(Message)].viewOnce
                    const msg = await generateWAMessageFromContent(m.chat.id, Message, { quoted: smsDelete })
                    await conn.relayMessage(m.chat.id, msg.message, {})
                } else {
                    const msg = await generateWAMessageFromContent(m.chat.id, message, { quoted: smsDelete })
                    await conn.relayMessage(m.chat.id, msg.message, {})
                }
            }
        }
    }

}