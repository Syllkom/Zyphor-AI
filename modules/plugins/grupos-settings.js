const command = {
    command: ['settings', 'true', 'editsttgs', 'false', 'config'],
    cantegoria: ['grupos']
}

command.script = async (m, { conn }) => {
    const chatdata = await conn.data['@chats'][m.chat.id]
    const { detect, antiLink, antiOnce, antiDelete } = chatdata.settings
    if (m.command == 'editsttgs') {
        const STTDetect = {
            title: '<[ settings • Detect ]>',
            highlight_label: '',
            rows: [
                {
                    header: detect.SOLO_LATAM ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'PARTICIPANT • SOLO LATAM',
                    description: 'Rechaza solicitudes de remitentes fuera de LATAM; elimina en caso de ingreso.',
                    id: '.' + m.command + ' detect tag=detect tag=SOLO_LATAM tag=' + (detect.SOLO_LATAM ? false : true)
                },
                {
                    header: detect.VERIFICACION ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'PARTICIPANT • VERIFICACION',
                    description: 'Envía un mensaje para verificar si el remitente es humano.',
                    id: '.' + m.command + ' detect tag=detect tag=VERIFICACION tag=' + (detect.VERIFICACION ? false : true)
                },
                {
                    header: detect.BIENVENIDA ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'PARTICIPANT • ADD',
                    description: 'Envía un aviso de bienvenida al ingresar alguien nuevo.',
                    id: '.' + m.command + ' detect tag=detect tag=BIENVENIDA tag=' + (detect.BIENVENIDA ? false : true)
                },
                {
                    header: detect.DESPEDIDA ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'PARTICIPANT • LEAVE',
                    description: 'Envía un aviso al salir alguien del grupo.',
                    id: '.' + m.command + ' detect tag=detect tag=DESPEDIDA tag=' + (detect.DESPEDIDA ? false : true)
                },
                {
                    header: detect.PROMOTE ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'PARTICIPANT • PROMOTE',
                    description: 'Envía un mensaje cuando un usuario se convierte en administrador.',
                    id: '.' + m.command + ' detect tag=detect tag=PROMOTE tag=' + (detect.PROMOTE ? false : true)
                },
                {
                    header: detect.DEMOTE ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'PARTICIPANT • DEMOTE',
                    description: 'Envía un mensaje cuando un administrador deja de serlo.',
                    id: '.' + m.command + ' detect tag=detect tag=DEMOTE tag=' + (detect.DEMOTE ? false : true)
                },
                {
                    header: detect.ANNOUNCE ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'CHANGE • ANNOUNCE',
                    description: 'Envía un aviso cuando alguien envía un mensaje. Solo administradores o participantes pueden enviar.',
                    id: '.' + m.command + ' detect tag=detect tag=ANNOUNCE tag=' + (detect.ANNOUNCE ? false : true)
                },
                {
                    header: detect.MEMBER_ADD_MODE ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'CHANGE • MEMBER_ADD_MODE',
                    description: 'Envía un aviso cuando alguien agrega un usuario al grupo. Solo administradores o participantes pueden agregar.',
                    id: '.' + m.command + ' detect tag=detect tag=MEMBER_ADD_MODE tag=' + (detect.MEMBER_ADD_MODE ? false : true)
                },
                {
                    header: detect.RESTRICT ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'CHANGE • RESTRICT',
                    description: 'Envía un aviso cuando alguien edita la información del grupo. Solo administradores o participantes pueden editar.',
                    id: '.' + m.command + ' detect tag=detect tag=RESTRICT tag=' + (detect.RESTRICT ? false : true)
                },
                {
                    header: detect.INVITE_LINK ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'CHANGE • INVITE_LINK',
                    description: 'Envía un mensaje cuando el enlace del grupo se actualiza.',
                    id: '.' + m.command + ' detect tag=detect tag=INVITE_LINK tag=' + (detect.INVITE_LINK ? false : true)
                },
                {
                    header: detect.SUBJECT ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'CHANGE • SUBJECT',
                    description: 'Envía un mensaje cuando se actualiza el nombre del grupo.',
                    id: '.' + m.command + ' detect tag=detect tag=SUBJECT tag=' + (detect.SUBJECT ? false : true)
                },
                {
                    header: detect.ICON ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'CHANGE • ICON',
                    description: 'Envía un mensaje cuando se actualiza la imagen del grupo.',
                    id: '.' + m.command + ' detect tag=detect tag=ICON tag=' + (detect.ICON ? false : true)
                }

            ]
        }

        const STTAntiLink = {
            title: '<[ Settings • AntiLink ]>',
            highlight_label: '',
            rows: [
                {
                    header: antiLink.WhatsApp ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'AntiLink • WhatsApp',
                    description: 'Elimina a quienes envíen links de WhatsApp al grupo.',
                    id: '.' + m.command + ' antilink tag=antiLink tag=WhatsApp tag=' + (antiLink.WhatsApp ? false : true)
                },
                {
                    header: antiLink.YouTube ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'AntiLink • YouTube',
                    description: 'Elimina a quienes envíen links de YouTube al grupo.',
                    id: '.' + m.command + ' antilink tag=antiLink tag=YouTube tag=' + (antiLink.YouTube ? false : true)
                },
                {
                    header: antiLink.facebook ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'AntiLink • Facebook',
                    description: 'Elimina a quienes envíen links de Facebook al grupo.',
                    id: '.' + m.command + ' antilink tag=antiLink tag=facebook tag=' + (antiLink.facebook ? false : true)
                },
                {
                    header: antiLink.TikTok ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'AntiLink • TikTok',
                    description: 'Elimina a quienes envíen links de TikTok al grupo.',
                    id: '.' + m.command + ' antilink tag=antiLink tag=TikTok tag=' + (antiLink.TikTok ? false : true)
                },
                {
                    header: antiLink.Discord ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'AntiLink • Discord',
                    description: 'Elimina a quienes envíen links de Discord al grupo.',
                    id: '.' + m.command + ' antilink tag=antiLink tag=Discord tag=' + (antiLink.Discord ? false : true)
                },
                {
                    header: antiLink.Telegram ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'AntiLink • Telegram',
                    description: 'Elimina a quienes envíen links de Telegram al grupo.',
                    id: '.' + m.command + ' antilink tag=antiLink tag=Telegram tag=' + (antiLink.Telegram ? false : true)
                },
                {
                    header: antiLink.X ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'AntiLink • X (Twitter)',
                    description: 'Elimina a quienes envíen links de X (Twitter) al grupo.',
                    id: '.' + m.command + ' antilink tag=antiLink tag=X tag=' + (antiLink.X ? false : true)
                }
            ]
        }

        const STTAntiOnce = {
            title: '<[ Settings • AntiOnce ]>',
            highlight_label: '',
            rows: [
                {
                    header: antiOnce.audio ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'Anti-Once • Audio',
                    description: 'El bot enviará audios de una sola vista como mensajes normales.',
                    id: '.' + m.command + ' antionce tag=antiOnce tag=audio tag=' + (antiOnce.audio ? false : true)
                },
                {
                    header: antiOnce.image ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'Anti-Once • Imagen',
                    description: 'El bot enviará imágenes de una sola vista como mensajes normales.',
                    id: '.' + m.command + ' antionce tag=antiOnce tag=image tag=' + (antiOnce.image ? false : true)
                },
                {
                    header: antiOnce.video ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'Anti-Once • Video',
                    description: 'El bot enviará videos de una sola vista como mensajes normales.',
                    id: '.' + m.command + ' antionce tag=antiOnce tag=video tag=' + (antiOnce.video ? false : true)
                },
                {
                    header: antiOnce.admin ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                    title: 'Anti-Once • Admin',
                    description: 'El bot enviará mensajes de una sola vista como normales si son de un admin.',
                    id: '.' + m.command + ' antionce tag=antiOnce tag=admin tag=' + (antiOnce.admin ? false : true)
                }

            ]
        }

        if (m.args[0] == 'detect') {
            if (!detect.detect) return await m.reply('El ajuste "detect" no está activo.')
            if (m.tag[0]) {
                if (!m.chat.group) return m.sms('group')
                if (!m.sender.admin) return m.sms('admin')
                if (!m.bot.admin) return m.sms('botAdmin')
                if (!chatdata.settings[m.tag[0]]) return await m.reply('Tag=' + m.tag[0] + ' no encontrado.')
                const tagBoolean = m.tag[2] == 'true' ? true : m.tag[2] == 'false' ? false : m.tag[2]
                try {
                    await m.react('done')
                    chatdata.settings[m.tag[0]][m.tag[1]] = tagBoolean
                    await conn.db.write()
                } catch { m.react('error') }

            } else return await conn.sendButton(m.chat.id, ['Edit Settings • Detect', '¡Hola, @' + m.sender.number + '!', 'Comando `/editsttgs`'], null, [{ name: 'single_select', button: ['Detect', [STTDetect]] }], m, { mentionedJid: [m.sender.id] })
        }

        else if (m.args[0] == 'antionce') {
            if (!antiOnce.antiOnce) return await m.reply('El ajuste "antiOnce" no está activo.')
            if (m.tag[0]) {
                if (!m.chat.group) return m.sms('group')
                if (!m.sender.admin) return m.sms('admin')
                if (!chatdata.settings[m.tag[0]]) return await m.reply('Tag=' + m.tag[0] + ' no encontrado.')
                const tagBoolean = m.tag[2] == 'true' ? true : m.tag[2] == 'false' ? false : m.tag[2]
                try {
                    await m.react('done')
                    chatdata.settings[m.tag[0]][m.tag[1]] = tagBoolean
                    await conn.db.write()
                } catch { m.react('error') }
            } else return await conn.sendButton(m.chat.id, ['Edit Settings • AntiOnce', '¡Hola, @' + m.sender.number + '!', 'Comando `/editsttgs`'], null, [{ name: 'single_select', button: ['AntiOnce', [STTAntiOnce]] }], m, { mentionedJid: [m.sender.id] })
        }

        else if (m.args[0] == 'antilink') {
            if (!antiLink.antiLink) return await m.reply('El ajuste "antiOnce" no está activo.')
            if (m.tag[0]) {
                if (!m.chat.group) return m.sms('group')
                if (!m.sender.admin) return m.sms('admin')
                if (!m.bot.admin) return m.sms('botAdmin')
                if (!chatdata.settings[m.tag[0]]) return await m.reply('Tag=' + m.tag[0] + ' no encontrado.')
                const tagBoolean = m.tag[2] == 'true' ? true : m.tag[2] == 'false' ? false : m.tag[2]
                try {
                    await m.react('done')
                    chatdata.settings[m.tag[0]][m.tag[1]] = tagBoolean
                    await conn.db.write()
                } catch { m.react('error') }
            } else return await conn.sendButton(m.chat.id, ['Edit Settings • AntiLink', '¡Hola, @' + m.sender.number + '!', 'Comando `/editsttgs`'], null, [{ name: 'single_select', button: ['AntiLink', [STTAntiLink]] }], m, { mentionedJid: [m.sender.id] })
        }
        else {
            let buttons = []
            if (antiOnce.antiOnce) buttons.push(STTAntiOnce)
            if (antiLink.antiLink) buttons.push(STTAntiLink)
            if (detect.detect) buttons.push(STTDetect)
            if (buttons[0]) {
                return await await conn.sendButton(m.chat.id, ['Edit • Settings', '¡Hola, @' + m.sender.number + '!', 'Comando `/editsttgs`'], null, [{ name: 'single_select', button: ['Edit Settings', buttons] }], m, { mentionedJid: [m.sender.id] })
            } else {
                await m.reply('Actualmente, no hay ajustes activos que se puedan modificar, como AntiOnce, AntiLink y Detect.')
                await m.react('❗')
            }
        }

    } else {
        const Update = chatdata.settings
        if (m.tag[0]) {
            if (!Update[m.tag[1]]) return await m.reply('Tag=[' + m.tag[1] + '] no encontrado.')
            const m74 = m.tag[2] == 'true' ? true : m.tag[2] == 'false' ? false : m.tag[2]
            if (!m.chat.group) return m.sms('group')
            if (!m.sender.admin) return m.sms('admin')
            if (m.tag[1] == 'antiLink') {
                if (!m.bot.admin) return m.sms('botAdmin')
            }
            try {
                await m.react('done')
                chatdata.settings[m.tag[1]][m.tag[1]] = m74
                await conn.db.write()
            } catch { m.react('error') }
        } else {

            await conn.sendButton(m.chat.id, ['Settings • BOT', '¡Hola, @' + m.sender.number + '!', null], null, [
                {
                    name: 'single_select',
                    button: ['Settings', [{
                        title: '<[ SETTINGS ]>',
                        highlight_label: '',
                        rows: [
                            {
                                header: antiLink.antiLink ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                                title: 'Settings • Antilinks',
                                description: 'El bot eliminará automáticamente a cualquier participante que envíe un enlace de WhatsApp al grupo.',
                                id: '.settings tag=settings tag=antiLink tag=' + (antiLink.antiLink ? false : true)
                            },
                            {
                                header: antiOnce.antiOnce ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                                title: 'Settings • AntiOnce',
                                description: 'El bot detectará automáticamente cualquier contenido que solo deba verse una vez y lo enviará como un mensaje normal.',
                                id: '.settings tag=settings tag=antiOnce tag=' + (antiOnce.antiOnce ? false : true)
                            },
                            {
                                header: antiDelete.antiDelete ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                                title: 'Settings • AntiDelete',
                                description: 'El bot detectará automáticamente cualquier contenido eliminado y lo enviará al chat.',
                                id: '.settings tag=settings tag=antiDelete tag=' + (antiDelete.antiDelete ? false : true)
                            },
                            {
                                header: detect.detect ? 'Apagar (Actualmente activo)' : 'Encender (Actualmente apagado)',
                                title: 'Settings • Detectar',
                                description: 'El bot detectará automáticamente cualquier ajuste realizado en el grupo.',
                                id: '.settings tag=settings tag=detect tag=' + (detect.detect ? false : true)
                            }
                        ]
                    }]]
                },
                {
                    name: 'reply',
                    button: ['Editar Settings', '.editsttgs']
                }
            ], null, { mentionedJid: [m.sender.id] })
        }
    }
}

export default command