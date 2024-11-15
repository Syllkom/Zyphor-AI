/**
 * Gestiona el mensaje `m` y la conexión `conn`.
 * Si ocurre alguna condición que requiera terminar el proceso,
 * se utiliza `return 'exit(1)'`.
 * 
 * @param {object} m - El mensaje que se está procesando.
 * @param {object} conn - La conexión que se está utilizando.
 */

export default async (m, conn) => {
    try {
        if (!conn.data['@chats']) { conn.data['@chats'] = {} }
        if (!conn.data['@users']) { conn.data['@users'] = {} }
        if (!conn.data['@bot']) { conn.data['@bot'] = {} }
        if (!conn.data['@chats'][m.chat.id]) {
            conn.data['@chats'][m.chat.id] = {
                isBan: false,
                settings: {
                    detect: {
                        detect: false,
                        SOLO_LATAM: false,
                        BIENVENIDA: false,
                        DESPEDIDA: false,
                        VERIFICACION: false,
                        ANNOUNCE: false,
                        RESTRICT: false,
                        INVITE_LINK: false,
                        SUBJECT: false,
                        ICON: false,
                        MEMBER_ADD_MODE: false,
                        DEMOTE: false,
                        PROMOTE: false,
                    },
                    antiLink: {
                        antiLink: false,
                        WhatsApp: true,
                        Discord: false,
                        facebook: false,
                        YouTube: false,
                        TikTok: false,
                        Telegram: false,
                        X: false,
                    },
                    antiDelete: {
                        antiDelete: false,
                        audio: true,
                        video: true,
                        image: true,
                        message: true
                    },
                    antiOnce: {
                        antiOnce: false,
                        audio: true,
                        video: true,
                        image: true,
                        admin: false,
                    }
                }
            }
        }

        if (!conn.data['@users'][m.sender.id]) {
            conn.data['@users'][m.sender.id] = {
                isBan: false,
                roles: {
                    rowner: m.bot.id == m.sender.id ? true : false,
                    owner: m.bot.id == m.sender.id ? true : false,
                    modr: m.bot.id == m.sender.id ? true : false,
                    prem: m.bot.id == m.sender.id ? true : false,
                }
            }

            if (global['@config'].botConfig.trustedUsers) {
                const senderConfig = global['@config'].botConfig.trustedUsers;
                const senderDb = conn.data['@users'][m.sender.id];
                if (senderConfig[m.sender.number]) {
                    Object.assign(senderDb.roles, {
                        ...senderConfig[m.sender.number]
                    });
                }
            }

        }

        if (!conn.data['@bot'][m.bot.id]) {
            conn.data['@bot'][m.bot.id] = {
                objecto: {},
                SubBots: {},
                autoread: false,
                OwnerUse: false,
                antiPrivado: false,
                settings: {
                    autoread: false,
                    globalUse: undefined,
                    chatUseAdmin: {}
                }
            }
        }
        await conn.db.write()
    } catch (e) {
        console.log(chalk.bgRed('\n[ ERROR - DataBase ] : '), chalk.white(util.format(e)));
    }

    try {
        const userData = await conn.data['@users'][m.sender.id];

        if (global['@config'].botConfig.trustedUsers) {
            const senderConfig = global['@config'].botConfig.trustedUsers;
            const senderDb = conn.data['@users'][m.sender.id];
            if (senderConfig[m.sender.number]) {
                Object.assign(senderDb.roles, {
                    ...senderConfig[m.sender.number]
                });
            }
        }

        if (!userData.roles.owner && global['@config'].botConfig.owner.includes(m.sender.number)) {
            Object.assign(userData.roles, {
                rowner: true,
                owner: true,
                modr: true,
                prem: true
            })
        }

        Object.assign(m.sender, userData.roles || {});
        await conn.db.write();
    } catch (e) { conn.logger.error(e) }


    if (['video', 'document', 'image'].some(o => m.message && m.type(m.message, o + 'Message'))) {
        const messageType = ['video', 'document', 'image'].find(o => m.message && m.type(m.message, o + 'Message'));
        if (messageType) {
            const message = m.message[messageType + 'Message'];
            if (!message || !message.caption) {
                return 'exit(1)';
            }
        }
    }

}