import chalk from 'chalk'

const stubType = {
    stubtype: [
        'GROUP_CREATE',
        'GROUP_CHANGE_ICON',
        'GROUP_CHANGE_SUBJECT',
        'GROUP_MEMBER_ADD_MODE',
        'GROUP_CHANGE_ANNOUNCE',
        'GROUP_CHANGE_RESTRICT',
        'GROUP_PARTICIPANT_DEMOTE',
        'GROUP_CHANGE_INVITE_LINK',
        'GROUP_PARTICIPANT_PROMOTE',
        'GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD'
    ]
}

stubType.script = async (m, { conn, even: evento, parameters }) => {
    const chat = await conn.data['@chats'][m.chat.id]
    const { detect } = chat.settings
    let text

    console.log('\x1b[1;31m~\x1b[1;37m>', chalk.white('['), chalk.magenta('MessageStubType').trim(), chalk.white(']'), chalk.blue(evento + ':'), chalk.greenBright(JSON.stringify(parameters, null, 2)))

    if (detect.detect) {
        if (evento == 'GROUP_PARTICIPANT_DEMOTE') {
            if (detect.DEMOTE) text = `@${(m.sender).replace('@s.whatsapp.net', '')} le quitó admin a @${(parameters[0]).replace('@s.whatsapp.net', '')}`
            if (parameters[0] == global['@config'].botConfig.owner + "@s.whatsapp.net") {
                if (m.sender.id !== m.bot.id) {
                    await conn.groupParticipantsUpdate(m.chat.id, [m.sender.id], 'demote')
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await conn.groupParticipantsUpdate(m.chat.id, [parameters[0]], 'promote')
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await conn.sendMessage(parameters[0], { text: `@${m.sender.number} te quito admin.`, contextInfo: { mentionedJid: [m.sender.id] } }, {})
                }
            }
        }
        else if (evento == 'GROUP_PARTICIPANT_PROMOTE' && detect.PROMOTE) { text = `@${(m.sender).replace('@s.whatsapp.net', '')} le dio admin a @${(parameters[0]).replace('@s.whatsapp.net', '')}` }
        else if (evento == 'GROUP_CHANGE_ANNOUNCE' && detect.ANNOUNCE) { if (parameters[0] == 'on') { text = '*「 Configuración del grupo cambiada 」*\n¡Ahora solo los administradores pueden enviar mensajes!' } else text = '*「 Configuración del grupo cambiada 」*\n¡Ahora todos los participantes pueden enviar mensajes!' }
        else if (evento == 'GROUP_CHANGE_RESTRICT' && detect.RESTRICT) { if (parameters[0] == 'on') { text = '*「 La configuración del grupo ha cambiado 」*\nLa información del grupo se ha restringido, ¡ahora solo los administradores pueden editar la información del grupo!' } else text = '*「 La configuración del grupo ha cambiado 」*\nSe ha abierto la información del grupo, ¡ahora todos los participantes pueden editar la información del grupo!' }
        else if (evento == 'GROUP_CHANGE_INVITE_LINK') {
            if (detect.INVITE_LINK) text = '*「 El link del grupo fue actualizado 」*\nhttps://chat.whatsapp.com/' + parameters[0]
        }
        else if (evento == 'GROUP_CHANGE_SUBJECT' && detect.SUBJECT) { text = '*「 El nombre del grupo fue actualizado 」*\n' + parameters[0] }
        else if (evento == 'GROUP_CHANGE_ICON' && detect.ICON) { text = '*「 Imagen del grupo actualizada 」*' }
        else if (evento == 'GROUP_MEMBER_ADD_MODE' && detect.MEMBER_ADD_MODE) { if (parameters[0] == 'all_member_add') { text = '*「 Configuración del grupo actualizada 」*\nAhora todos los participantes pueden agregar usuarios.' } else text = '*「 Configuración del grupo actualizada 」*\nAhora solo los administradores pueden agregar usuarios.' }

        if (evento == 'GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD') {
            if (parameters[1] == 'created') {
                try { if (!Numero(parameters[0]) && detect.SOLO_LATAM) { await conn.groupRequestParticipantsUpdate(m.chat.id, [parameters[0]], 'reject') } } finally {
                    const participant = await conn.groupRequestParticipantsList(m.chat.id)
                    if (participant.find(o => o.jid == parameters[0]) && detect.VERIFICACION) {
                        await conn.sendButton(parameters[0], ['Hola, @' + parameters[0].split('@')[0] + '!', 'Ha solicitado unirse al *grupo:*\n' + (m.chat.name), 'Para proceder con la aceptación de su solicitud, por favor confirme que no es un robot.'], ['document:true', null, { fileName: global.botName, jpegThumbnail: true }], [
                            {
                                name: 'reply',
                                button: ['No soy un robot', '.sistembot tag=groupRequest tag=' + (m.key.remoteJid).split('@')[0] + ' tag=' + parameters[0].split('@')[0] + ' tag=true']
                            },
                            {
                                name: 'reply',
                                button: ['No unirme', '.sistembot tag=groupRequest tag=' + (m.key.remoteJid).split('@')[0] + ' tag=' + parameters[0].split('@')[0] + ' tag=false']
                            }
                        ], null, {
                            mentionedJid: [parameters[0]],
                            externalAdReply: {
                                title: m.chat.name,
                                body: global.botName,
                                thumbnailUrl: await m.chat.photo(),
                                containsAutoReply: true,
                                sourceUrl: '',
                                mediaType: 1
                            }
                        })
                    }
                }
            }
        }
    }

    if (evento == 'GROUP_CREATE') {
        const owner = global['@config'].botConfig.owner + "@s.whatsapp.net"
        await conn.sendButton(owner, [null, 'Se detecto el Bot en un grupo nuevo!\n\n' + parameters[0], 'Info - Bot'], ['image:url', await m.chat.photo()], [{ name: 'copy', button: ['Copiar I.D sender', m.participant] }, { name: 'copy', button: ['Copiar I.D Chat', m.key.remoteJid] }])
    }

    if (text) await m.reply(text)
}

export default stubType