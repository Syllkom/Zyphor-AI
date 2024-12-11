const command = {
    command: ['xnxxsearch', 'xnxx'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) {
        return m.reply(`Ingresa una palabra para buscar en XNXX.\nEjemplo: /${m.command} sister`)
    }

    const query = encodeURIComponent(m.args.join(' '))
    const apiUrl = `https://api.agatz.xyz/api/xnxx?message=${query}`

    try {
        await m.react('wait')
        const response = await conn.getJSON(apiUrl)
        if (!response?.data?.result || response.data.result.length === 0) {
            await m.react('error')
            return m.reply('No se encontraron resultados para tu búsqueda.')
        }

        const randomVideo = response.data.result[Math.floor(Math.random() * response.data.result.length)]
        const { title, info, link } = randomVideo
        const caption = `○ *Título:* ${title}\n` +
                        `○ *Información:* ${info}\n` +
                        `○ *Enlace:* [Ver video](${link})`;

        await conn.sendMessage(m.chat.id, {
            text: caption,
            contextInfo: {
                externalAdReply: {
                    title: 'Resultado de búsqueda en XNXX',
                    body: 'Pulsa para ver el video',
                    thumbnailUrl: 'https://www.xnxx.com/favicon.ico',
                    mediaType: 1,
                    sourceUrl: link
                }
            }
        }, { quoted: m });

        await m.react('done')
    } catch (error) {
        console.error('Error al buscar en XNXX:', error)
        await m.react('error')
        m.reply('Hubo un error al procesar tu solicitud. Inténtalo más tarde.')
    }
}

export default command
