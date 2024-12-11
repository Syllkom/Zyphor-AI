const command = {
  command: ['threads', 'th'],
  categoria: ['servicio'],
}

command.script = async (m, { conn }) => {
  if (!m.args[0]) {
    return m.reply('Por favor, ingrese un enlace de Threads.\nEjemplo:\n/threads https://www.threads.net/t/CuZYPlCgaMf')
  }

  const url = `https://api.agatz.xyz/api/threads?url=${encodeURIComponent(m.args[0])}`
  try { const response = await conn.getJSON(url)
    if (response.status !== 200 || !response.data) {
      return m.reply('No se pudo procesar el enlace proporcionado.')
    }
    
    await m.react('wait')
    const { image_urls, video_urls } = response.data;
    if (image_urls.length > 0) {
      for (const imgUrl of image_urls) {
        await conn.sendMessage( m.chat.id, { image: { url: imgUrl }, caption: '', }, { quoted: m } )
      }
    }

    if (video_urls.length > 0) {
      for (const video of video_urls) {
        await conn.sendMessage( m.chat.id, { video: { url: video.download_url }, caption: '', }, { quoted: m } )
      }
    }

    if (image_urls.length === 0 && video_urls.length === 0) {
      return m.reply('No se encontraron imágenes ni videos en el enlace proporcionado.')
    }

    await m.react('done')
  } catch (e) {
    console.error(e)
    m.reply('Hubo un error al procesar el enlace. Asegúrate de que sea un enlace válido de Threads.')
  }
}

export default command
