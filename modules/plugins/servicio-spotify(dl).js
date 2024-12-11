const command = {
  command: ['spotifydl', 'spotdl', 'spotify', 'sp'],
  categoria: ['servicio']
}

command.script = async (m, { conn }) => {
  if (!m.args[0]) {
    return m.reply(`Por favor, ingrese un enlace de Spotify.\nEjemplo:\n/${m.command} https://open.spotify.com/track/2Tp8vm7MZIb1nnx1qEGYv5`)
  }

  const url = `https://api.agatz.xyz/api/spotifydl?url=${encodeURIComponent(m.args[0])}`
  try { const response = await conn.getJSON(url);
    if (response.status !== 200 || !response.data) {
      return m.reply('No se pudo obtener información para el enlace proporcionado.')
    }

    const data = JSON.parse(response.data)
    const caption = `● *${data.judul}*\n○ *Artista*: ${data.nama_channel}\n○ *Duración*: ${data.durasi} segundos`
    
    m.react('wait')
    await conn.sendMessage( m.chat.id, { image: { url: data.gambar_kecil[0].url }, caption: caption }, { quoted: m } )
    
    await conn.sendMessage(m.chat.id, { audio: { url: data.url_audio_v1 }, contextInfo: { externalAdReply: { title: data.judul, body: data.nama_channel, thumbnailUrl: data.gambar_kecil[0].url, showAdAttribution: true, sourceUrl: CanalZp,  mediaType: 1 } }, mimetype: "audio/mp4", fileName: "audio.mp3" }, { quoted: m })
    await m.react('done')
  } catch (e) {
    console.error(e)
    m.reply('Hubo un error al procesar el enlace. Asegúrate de que sea un enlace válido de Spotify.')
  }
}

export default command
