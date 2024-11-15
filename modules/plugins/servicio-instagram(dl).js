import { igdl } from 'ruhend-scraper';

const command = {
    command: ['instagram', 'ig'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) {
        return m.reply('*Ingresa un enlace de Instagram.*');
    }

    try {
        await m.react('wait');

        const res = await igdl(m.args[0]);
        const data = res.data;

        for (let media of data) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            await conn.sendMessage(m.chat.id, { video: { url: media.url }, caption: '', fileName: 'instagram.mp4', mimetype: 'video/mp4' }, { quoted: m });
            
        await m.react('done');
        }
    } catch (e) {
        console.log(e);
        await m.react('error');
        return m.reply('Ocurrió un error.');
    }
};

export default command
