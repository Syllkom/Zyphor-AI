const command = {
  command: ['igstalk', 'iginfo', 'iguser'],
  categoria: ['servicio']
}

command.script = async (m, { conn }) => {
  if (!m.args[0]) return m.reply(`Uso: ${m.command} <nombre_de_usuario>\nEjemplo: ${m.command} Syllkom`)

  try {
    await m.react('wait')
    const data = await conn.getJSON(`https://btch.us.kg/download/igstalkfull?username=${m.args[0]}`)

    if (!data.result || Object.keys(data.result).length === 0) {
      await m.react('error')
      return m.reply('No se encontraron resultados para ese usuario.')
    }

    const { username, fullName, bio, profilePic, stats } = data.result
    const { posts, followers, following } = stats

    let texto = `○ *Usuario:* @${username}\n`
    texto += `○ *Nombre Completo:* ${fullName || 'No disponible'}\n`
    texto += `○ *Biografía:* ${bio || 'No disponible'}\n`
    texto += `○ *Publicaciones:* \`${posts || 0}\`\n`
    texto += `○ *Seguidores:* \`${followers || 0}\`\n`
    texto += `○ *Siguiendo:* \`${following || 0}\`\n`

    conn.saveMessageIdForResponse(await conn.sendMessage(m.chat.id, { image: { url: profilePic }, caption: texto, contextInfo: { externalAdReply: { title: `@${username}`, body: 'Instagram User Stalker', thumbnailUrl: profilePic, showAdAttribution: true, sourceUrl: `https://www.instagram.com/${username}`, mediaType: 1 } } }, { quoted: m }))
    await m.react('done')
  } catch (e) {
    console.error('Error al obtener datos del usuario de Instagram:', e)
    await m.react('error')
    m.reply('Ocurrió un error al procesar la solicitud.')
  }
}

export default command
