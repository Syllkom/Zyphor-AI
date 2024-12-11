const command = {
    command: ['youtubestalk', 'ystalk'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) return m.reply(`Uso: /${m.command} <nombre del canal o usuario>\nEjemplo: /${m.command} Syllkom`)
    await m.react('wait')

    try {
        const response = await conn.getJSON(`https://btch.us.kg/download/youtubestalk?text=${encodeURIComponent(m.args.join(' '))}`)
        const result = response.result?.data?.[0]
        if (!result) return m.reply('No se encontró información sobre este canal.')

        const { channelId, url, channelName, avatar, isVerified, subscriberH, description } = result

        const texto = `○ *Nombre del canal:* ${channelName}\n` +
                      `○ *Verificado:* ${isVerified ? 'Sí' : 'No'}\n` +
                      `○ *Suscriptores:* ${subscriberH}\n` +
                      `○ *Descripción:* ${description || 'Sin descripción'}\n` +
                      `○ *Enlace:* ${url}`

        await conn.sendMessage(m.chat.id, { image: { url: avatar }, caption: texto }, { quoted: m })
        await m.react('done')
    } catch (e) {
        console.error('Error al obtener datos del canal de YouTube:', e)
        m.reply('Ocurrió un error al procesar tu solicitud.')
    }
}

export default command
