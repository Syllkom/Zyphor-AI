const command = {
    command: ['101'],
    usePrefix: false
}

command.script = async (m, { conn }) => {
    if (conn.before[m.sender.id]) {
        if (m.sender.id == m.bot.id) return;
        return await conn.before[m.sender.id].script(m, { conn })
    }
    else if (m.type(m.quoted, "interactiveMessage") &&
        m.quoted.interactiveMessage.header?.title === '@GPT') {
        m.text = m.budy
        await conn.commands.get('servicio-IA.js').script(m, { conn });
    }
}

export default command