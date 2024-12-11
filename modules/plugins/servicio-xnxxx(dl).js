const command = {
    command: ['xnxxdown', 'xnxxdl'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) {
        return m.reply(`Proporciona un enlace de un video de XNXX y opcionalmente la calidad.\n\n*Ejemplo de uso:*\n/${m.command} <enlace> (Muestra opciones)\n/${m.command} <enlace> 720p (Descarga video en 720p)`)
    }

    const url = m.args[0]
    const quality = m.args[1] ? m.args[1].toLowerCase() : null
    const apiUrl = `https://api.agatz.xyz/api/xnxxdown?url=${encodeURIComponent(url)}`

    try {
        await m.react('wait')
        const response = await conn.getJSON(apiUrl)
        if (response.error) {
            await m.react('error')
            return m.reply(`Error: ${response.error}`)
        }

        if (!response.data || !response.data.files) {
            await m.react('error')
            return m.reply('No se pudo obtener los datos del video. Inténtalo más tarde.')
        }

        const { title, duration, image, files } = response.data
        const caption = `○ *Título:* ${title}\n` +
                        `○ *Duración:* ${parseInt(duration) / 60} min\n` +
                        `○ *Opciones de descarga:*\n` +
                        `- *360p:* ${files.low}\n` +
                        `- *720p:* ${files.high}\n\n` +
                        `● *Ejemplo de uso:*\n/${m.command} ${url} 360p`

        if (!quality) {
            await conn.sendMessage(m.chat.id, {
                image: { url: image },
                caption,
                contextInfo: {
                    externalAdReply: {
                        title: 'Opciones de descarga de XNXX',
                        body: 'Selecciona una calidad',
                        thumbnailUrl: image,
                        mediaType: 1,
                        sourceUrl: url
                    }
                }
            }, { quoted: m })
            await m.react('done')
            return;
        }

        let downloadUrl;
        if (quality.includes('360')) downloadUrl = files.low;
        else if (quality.includes('720')) downloadUrl = files.high;
        else {
            await m.react('error');
            return m.reply('Calidad no válida. Usa "360p" o "720p".')
        }

        await m.react('download')
        await conn.sendMessage(m.chat.id, {
            video: { url: downloadUrl },
            caption: `○ *Título:* ${title}\n○ *Duración:* ${parseInt(duration) / 60} min\n○ *Calidad:* ${quality.toUpperCase()}`
        }, { quoted: m })
        await m.react('done')
    } catch (error) {
        console.error('Error al descargar el video de XNXX:', error);
        await m.react('error')
        m.reply('Hubo un error al procesar tu solicitud. Inténtalo más tarde.')
    }
}

export default command
