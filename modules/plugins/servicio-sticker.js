const command = {
    command: ['sticker', 's'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    const smsg = m.type(m.SMS().message)

    if (smsg == 'imageMessage') {
        let media = await conn.download()
        await conn.sendSticker(m.chat.id, { sticker: media, mediaType: 'image' }, m, { packname: m.args[0] || m.pushName || '@ZyphorAI', author: '    ' })
    }
    else if (smsg == 'videoMessage') {
        if (m.SMS().message.seconds > 12) return m.reply('Máximo 10 segundos!')
        let media = await conn.download()
        await conn.sendSticker(m.chat.id, { sticker: media, mediaType: '    ' }, m, { packname: m.args[0] || m.pushName || '@ZyphorAI', author: '    ' })
    } else {
        m.reply(`/${m.command} quoted/send ? [image/video <= 10 seconds]`)
    }
}

export default command