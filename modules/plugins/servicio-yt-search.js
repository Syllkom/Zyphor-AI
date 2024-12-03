import yts from 'yt-search'

const command = {
    command: ['yts', 'ytsearch'],
    categoria: ['herramienta']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) return m.reply(`Ejemplo: /${m.command} Despacito`);
    await m.react('wait');
    
    try {
        const search = await yts(m.args.join(' '));
        if (!search || !search.all.length) return m.reply('No se encontraron resultados para tu búsqueda.');
        let texto = `● *Formato de descarga:*\n- /ytmp3 _url_\n- /ytmp4 _url_\n\n`;
        for (const video of search.all.slice(0, 20)) {
            texto += `○ *Título:* ${video.title}\n` +
                     `○ *Vistas:* \`${video.views}\`\n` +
                     `○ *Duración:* \`${video.timestamp}\`\n` +
                     `○ *Publicado:* ${video.ago}\n` +
                     `○ *Enlace:* ${video.url}\n\n○ ◦╶╴──◦──╶╴─◦╶╴◯\n\n`;
        }

        await conn.sendMessage(m.chat.id, { image: { url: search.all[0].thumbnail }, caption: texto }, { quoted: m });
        await m.react('done');
        
    } catch (error) {
        console.error('Error en la búsqueda de YouTube:', error);
        m.reply('❌ Ocurrió un error al realizar la búsqueda en YouTube.');
    }
}

export default command
