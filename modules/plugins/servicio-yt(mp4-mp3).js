const Regex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/

const command = {
  command: ['ytmp3', 'ytmp4', 'ytmp'],
  categoria: ['servicio']
}

command.script = async (m, { conn }) => {
  if (!m.text) return m.reply(`Ingrese el comando *\`.${m.command}\`* y seguido el enlace de un video de YouTube`)
  if (!Regex.test(m.args[0])) return m.reply(`Link incorrecto`)

  try {
    if (m.command == 'ytmp3') {
      await m.react('wait')

      const data = await conn.getJSON(`https://btch.us.kg/download/ytdl?url=${m.args[0]}`)

      conn.saveMessageIdForResponse(await conn.sendMessage(m.chat.id, {
        audio: { url: data.result.mp3 },
        contextInfo: {
          externalAdReply: {
            title: data.result.title,
            body: data.result.name,
            thumbnailUrl: data.result.image,
            showAdAttribution: true,
            sourceUrl: CanalZp, 
            mediaType: 1
          }
        },
        mimetype: "audio/mp4",
        fileName: "audio.mp3"
      }, { quoted: m }), { user: 'all', response: { mp4: { command: `.ytmp4 ${m.args[0]}` }, video: { command: `.ytmp4 ${m.args[0]}` } } })

      await m.react('done')
    }
    else if (m.command == 'ytmp4') {
      await m.react('wait')

      const data = await conn.getJSON(`https://btch.us.kg/download/ytdl?url=${m.args[0]}`)

      conn.saveMessageIdForResponse(await conn.sendMessage(m.chat.id, {
        document: {
          url: data.result.mp4
        },
        mimetype: 'video/mp4',
        fileName: data.result.title + ".mp4",
        jpegThumbnail: await conn.resizePhoto({
          image: data.result.image,
          scale: 140,
          result: 'base64'
        })
      }, { quoted: m }), { user: 'all', response: { mp3: { command: `.ytmp3 ${m.args[0]}` }, audio: { command: `.ytmp3 ${m.args[0]}` } } })

      await m.react('done')
    }
  } catch (e) { m.react('error'), console.error(e) }
}

export default command

function YoutTube(texto) {
  var text = texto.split(' ')
  var enlaces = []
  var contador = 0

  for (var i = 0; i < text.length; i++) {
    if (Regex.test(text[i])) {
      enlaces.push(text[i]);
      contador++;
      if (contador === 5) { break }
    }
  }
  return enlaces
}