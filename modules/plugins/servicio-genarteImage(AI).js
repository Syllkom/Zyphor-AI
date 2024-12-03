import axios from 'axios'

const command = {
    command: ['txtimg'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) return m.reply(`Ejemplo: /${m.command} cat`);
    const photoleap = async (prompt) => {
        try { return await Promise.all(Array(3).fill().map(async () => (await axios.get(`https://tti.photoleapapp.com/api/v1/generate?prompt=${prompt}`)).data.result_url)); } 
        catch (e) { console.error(e); return { msg: 404 }; }
    };
    const images = await photoleap(m.args.join(' '));
    if (images.msg === 404) return m.reply('Error al generar la imagen.');
    images.forEach(async (img) => await conn.sendMessage(m.chat.id, { image: { url: img }, caption: '' }, { quoted: m }));
}

export default command
