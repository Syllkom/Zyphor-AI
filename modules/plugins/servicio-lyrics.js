const command = {
  command: ['lyrics', 'songlyrics', 'letras'],
  categoria: ['servicio']
}

command.script = async (m, { conn }) => {
  if (!m.args[0]) {
    return m.reply(`Uso: ${m.command} <nombre_de_la_canción>\nEjemplo: ${m.command} Arcade`);
  }

  try {
    await m.react('wait');
    const data = await conn.getJSON(`https://btch.us.kg/lirik?text=${encodeURIComponent(m.args.join(' '))}`);

    if (!data.result || Object.keys(data.result).length === 0) {
      await m.react('error');
      return m.reply('No se encontraron letras para esa canción.');
    }

    const {title, artist, lyrics, image, fullTitle, artistUrl, releaseDateForDisplay } = data.result;
    let texto = `● *Letra de la Canción:*\n`
    texto += `○ *Título:* ${title}\n`
    texto += `○ *Titiulo completo:* ${fullTitle || 'No disponible'}\n`
    texto += `○ *Artista:* ${artist}\n`
    texto += `○ *Lanzamiento:* ${releaseDateForDisplay || 'No disponible'}\n`
    texto += `○ *Más info:* [${artist}](${artistUrl})\n\n`
    texto += `◯ ◦╶╴──◦──╶╴─◦╶╴○\n\n`
    texto += `${lyrics}`

    await conn.sendMessage(m.chat.id, { image: { url: image }, caption: texto }, { quoted: m });

    await m.react('done');
  } catch (e) {
    console.error('Error al obtener las letras:', e);
    await m.react('error');
    m.reply('Ocurrió un error al procesar tu solicitud.');
  }
}

export default command
