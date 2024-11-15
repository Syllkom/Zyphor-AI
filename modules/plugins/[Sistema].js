const command = {
    command: ['sistembot'],
    categoria: ['sistembot'],
}

command.script = async (m, { conn }) => {
    if (m.tag[0] == 'groupRequest') {
        await m.react('wait')
        try {
            const chatParticipant = await conn.groupRequestParticipantsList(m.tag[1] + '@g.us')
            const participant = chatParticipant.find(o => o.jid == m.tag[2] + "@s.whatsapp.net")
            if (participant) { await conn.groupRequestParticipantsUpdate(m.tag[1] + '@g.us', [m.tag[2] + "@s.whatsapp.net"], m.tag[3] == 'true' ? 'approve' : 'reject'), await m.react('done') } else { await m.reply('No hay ninguna solicitud a su numero'), await m.react('error') }
        } catch (e) { m.react('error') }
    }
}

export default command