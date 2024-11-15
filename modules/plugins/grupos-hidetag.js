const command = {
    command: ['hidetag', 'notificar', 'tag'],
    categoria: ['grupos']
}

command.script = async (m, { conn }) => {
    if (!m.chat.group) return m.sms('group')
    if (!m.sender.admin) return m.sms('admin')
    if (!m.text) return m.reply(`*Y el texto?*`)
    await conn.sendMessage(m.chat.id, { text: m.text ? m.text : '', mentions: m.chat.participants.map(a => a.id) }, { ephemeralExpiration: 24 * 60 * 100, disappearingMessagesInChat: 24 * 60 * 100 })
} 

export default command