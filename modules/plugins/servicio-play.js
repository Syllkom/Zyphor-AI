import yts from 'yt-search'

const command = {
  command: ['play', 'youtube'],
  categoria: ['servicio']
}


command.script = async (m, { conn }) => {
  if (m.text) {
    m.react('wait')
    try {
      const videos = (await yts(m.text)).videos
      if (!(videos.length > 0)) {
        await m.react('❗')
        return m.reply(`Sin resultados`)
      }
      const { title, thumbnail, timestamp, ago, views, url } = videos[0]

      let texto = `╭╼◯ \`\`\`Zp - Play\`\`\`\n`
      texto += `│ *Publicado:* ${ago}\n`
      texto += `│ *Duración:* ${timestamp}\n`
      texto += `│ *Vistas:* ${views}\n`
      texto += `╰───────────────◯\n`
      texto += `● Para descargar responde a este mensaje con *Video* o *Audio*.\n${readMore}\n📌 *Link:* ${url}`

      /*if (!m.chat.group) {
        const single_select = [{ title: '', highlight_label: '', rows: [] }]
        for (let i = 1; i <= 8; i++) {
          if (videos.length >= i) single_select[0].rows.push({ header: videos[i].title, title: 'Duracion ' + videos[i].timestamp + ' / Subido ' + videos[i].ago, description: readMore + (videos[i].description === '' ? 'Sin descripción' : videos[i].description), id: '.ytmp ' + videos[i].url })
        }
        Buttons.push({ name: 'single_select', button: ['Otros', single_select] })
      }*/

      conn.saveMessageIdForResponse(await conn.sendMessage(m.chat.id, {
        text: texto,
        contextInfo: {
          externalAdReply: {
            title: title,
            body: global.botName,
            thumbnailUrl: thumbnail,
            renderLargerThumbnail: true,
            mediaType: 1,
          }
        }
      }), {
        user: 'all',
        response: {
          audio: { command: `.ytmp3 ${url}` },
          mp3: { command: `.ytmp3 ${url}` },
          video: { command: `.ytmp4 ${url}` },
          mp4: { command: `.ytmp4 ${url}` }
        }
      })

      await m.react('done')
    } catch (e) {
      m.react('error')
      console.log(e)
    }
  } else m.reply(`Ingrese el comando *\`.${m.command}\`* y seguido el título de un video de *YouTube*`)
}

export default command



/*const g = {
          "type": "video",
          "videoId": "nOmBUIeAaLE",
          "url": "https://youtube.com/watch?v=nOmBUIeAaLE",
          "title": "Solitario - Intromisivo",
          "description": "Quienes no pueden objetar una idea se ceban con el formato. [La publicación de las nuevas obras se sostiene económicamente ...",
          "image": "https://i.ytimg.com/vi/nOmBUIeAaLE/hq720.jpg",
          "thumbnail": "https://i.ytimg.com/vi/nOmBUIeAaLE/hq720.jpg",
          "seconds": 243,
          "timestamp": "4:03",
          "duration": {
            "seconds": 243,
            "timestamp": "4:03"
          },
          "ago": "11 days ago",
          "views": 134034,
          "author": {
            "name": "Solitario",
            "url": "https://youtube.com/channel/UCVdFs1X_DOGWi81Q6XTaBrg"
          }
        }*/