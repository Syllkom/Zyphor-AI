import { googleImage } from '@bochilteam/scraper'

const command = {
    command: ['wallpaper', 'wallpapers', 'wp'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args || m.args.length === 0) return m.reply(`Introduce un texto de búsqueda junto al comando.\n\n*Ejemplo:*\n*/${m.command}* Nakano Miku`)

    const searchText = m.args.join(' '); await m.react('wait');
    try {
        const images = await googleImage('wallpaper ' + searchText); 
        const imageUrl = images[Math.floor(Math.random() * images.length)]; 
        await conn.sendMessage(m.chat.id, { image: { url: imageUrl }, caption: `*● Wallpaper:* ${searchText}` }, { quoted: m });
        await m.react('done');
    } catch (e) {
        console.error(e); await m.react('error');
        await m.reply('❌ Ocurrió un error al buscar el wallpaper.');
    }
}

export default command
