const command = {
    command: ['allban'],
    categoria: ['grupos'],
}

command.script = async (m, { conn }) => {
    if (!m.chat.group) return m.sms('group')
    if (!m.sender.admin) return m.sms('admin')

    if (m.tag[0] == 'true') {
        const participants = m.chat.participants.filter(o => o.admin === null)
        for (const o of participants) {
            if (typeof o == 'object' && o.id) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await conn.groupParticipantsUpdate(m.chat.id, [o.id], 'remove').catch(() => { });
            }
        }
    }
    else if (m.tag[0] == 'false') {

    } else {
        conn.saveMessageIdForResponse(await conn.sendMessage(m.chat.id, { text: '¿Estás seguro de que deseas eliminar a todos los participantes de este chat? Una vez que se inicie el proceso, no podrá cancelarse.\n\nPor favor, responde con \'sí\' para confirmar la acción o \'no\' para cancelarla.' }, { quoted: m }), {
            user: m.sender.id,
            response: {
                si: { command: `.allban tag=true` },
                no: { command: `.allban tag=false` }
            }
        })
    }
}

export default command