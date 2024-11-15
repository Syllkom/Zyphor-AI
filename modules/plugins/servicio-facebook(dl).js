const command = {
    command: ['facebook', 'fb'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.text) return m.reply(`Ingrese el comando *\`.${m.command}\`* y seguido un enlace de *Tiktok*`)
    m.react('wait')

    try {
        const Facebook = await conn.getJSON(`https://widipe.com/download/fbdl?url=${m.args[0]}`)
        if (m.tag[0] == 'audio') {
            if (Facebook.result?.audio) { await conn.sendMessage(m.chat.id, { audio: { url: Facebook.result.audio }, mimetype: 'audio/mpeg' }, { quoted: m }), m.react('done') } else return m.reply('Este video/imagen no tiene ningun audio.')
        }
        else if (Facebook.result?.Normal_video) {
            if (Facebook.result?.Normal_video) { await conn.sendButton(m.chat.id, [null, null, global.botName], ['video:url', Facebook.result.Normal_video], [{ name: 'reply', button: ['Send Audio ?', '.facebook ' + m.args[0] + ' tag=audio'] }], m), m.react('done') }
        } else return m.reply('-_-')
    } catch (e) { console.log(e); m.react('error') }
}


export default command