const command = {
    command: ['instagram', 'ig'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.text) return m.reply(`Ingrese el comando *\`.${m.command}\`* y seguido un enlace de *Tiktok*`)
    m.react('wait')
    try {
        const Instagram = await conn.getJSON(`https://widipe.com/download/igdl?url=${m.args[0]}`)
        if (Array.isArray(Instagram.result)) { if (Instagram.result.length > 0) { await conn.sendMessage(m.chat.id, { video: { url: Instagram.result[0].url } }) } else return new Error('No result') } else return m.reply('-_-')
    } catch (e) { console.log(e); m.react('error') }
}


export default command