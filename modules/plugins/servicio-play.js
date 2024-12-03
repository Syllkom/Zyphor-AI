import yts from 'yt-search'

const command = {
  command: ['play', 'youtube'],
  categoria: ['servicio']
}

command.script = async (m, { conn }) => {
  if (m.text) {
    m.react('wait');
    try {
      const videos = (await yts(m.text)).videos;
      if (!(videos.length > 0)) {
        await m.react('❗');
        return m.reply('Sin resultados');
      }

      const { title, thumbnail, timestamp, ago, views, url, author } = videos[0];

      let texto = `╭ ✦ *</YouTube-Play>*\n`;
      texto += `╵Publicado: ${ago}\n`;
      texto += `╵Duración: ${timestamp}\n`;
      texto += `╵Vistas: ${views}\n`;
      texto += `╵Canal: ${author.name} (${author.url})\n`;
      texto += `╰╶╴──────╶╴─╶╴◯\n`;
      texto += `● Para descargar responde a este mensaje con *Video* o *Audio*.\n${readMore}\n📌 *Link:* ${url}`;

      conn.saveMessageIdForResponse( await conn.sendMessage(m.chat.id, { text: texto, contextInfo: { externalAdReply: { title: title, body: global.botName, thumbnailUrl: thumbnail, renderLargerThumbnail: true, showAdAttribution: true, sourceUrl: CanalZp, mediaType: 1 } } }),
        {
          user: 'all', response: { audio: { command: `.ytmp3 ${url}` }, mp3: { command: `.ytmp3 ${url}` }, video: { command: `.ytmp4 ${url}` }, mp4: { command: `.ytmp4 ${url}` }
          }
        }
      );

      await m.react('done');
    } catch (e) {
      m.react('error');
      console.log(e);
    }
  } else m.reply(`Ingrese el comando *\`.${m.command}\`* y seguido el título de un video de *YouTube*`);
}

export default command
