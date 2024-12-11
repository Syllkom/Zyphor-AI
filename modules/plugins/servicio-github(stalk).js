const command = {
  command: ['githubstalk', 'ghstalk'],
  categoria: ['servicio']
}

command.script = async (m, { conn }) => {
  if (!m.text) {
    return m.reply(`Ingrese el comando *\`/${m.command}\`* seguido del nombre de un usuario de GitHub.`)
  }

  try {
    await m.react('wait')
    const username = m.text
    const data = await conn.getJSON(`https://api.github.com/users/${encodeURIComponent(username)}`)

    if (!data || !data.login) {
      await m.react('error')
      return m.reply('No se encontraron datos para el usuario proporcionado.')
    }

    const { login, bio, company, email, public_repos, followers, following, blog, location, avatar_url } = data

    const message = `○ *Usuario:* ${login}\n` +
      `○ *Biografía:* ${bio || 'No disponible'}\n` +
      `○ *Compañía:* ${company || 'No disponible'}\n` +
      `○ *Correo electrónico:* ${email || 'No disponible'}\n` +
      `○ *Repositorios públicos:* ${public_repos || '0'}\n` +
      `○ *Seguidores:* ${followers || '0'}\n` +
      `○ *Siguiendo:* ${following || '0'}\n` +
      `○ *Blog:* ${blog || 'No disponible'}\n` +
      `○ *Ubicación:* ${location || 'No disponible'}`

    await conn.sendMessage(m.chat.id, { image: { url: avatar_url }, caption: message, }, { quoted: m })

    await m.react('done')
  } catch (e) {
    console.error('Error en githubstalk:', e)
    await m.react('error')
    m.reply('Ocurrió un error al procesar tu solicitud. Inténtalo más tarde.')
  }
}

export default command
