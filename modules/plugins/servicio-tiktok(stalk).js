const command = {
    command: ['tiktokstalk', 'ttstalk'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) return m.reply(`Uso: /${m.command} <username>\nEjemplo: /${m.command} Syllkom`)
    await m.react('wait')

    try {
        const data = await conn.getJSON(`https://btch.us.kg/download/tiktokstalk?username=${encodeURIComponent(m.args[0])}`)
        if (!data.status) return m.reply('No se encontró información para el usuario proporcionado.')
        const { profile, username, description, likes, followers, following, totalPosts } = data.result

        const texto = `○ *Usuario:* @${username}\n` +
            `○ *Descripción:* ${description || 'No disponible'}\n` +
            `○ *Likes:* \`${likes}\`\n` +
            `○ *Seguidores:* \`${followers}\`\n` +
            `○ *Siguiendo:* \`${following}\`\n` +
            `○ *Total de Posts:* \`${totalPosts}\`\n`

        await conn.sendMessage(m.chat.id, { image: { url: profile }, caption: texto }, { quoted: m })
        await m.react('done')
    } catch (error) {
        console.error('Error al obtener datos del usuario de TikTok:', error)
        m.reply('Ocurrió un error al procesar tu solicitud.')
    }
}

export default command
