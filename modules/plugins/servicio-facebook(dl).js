import { igdl } from 'ruhend-scraper';

const command = {
    command: ['facebook', 'fb'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) {
        return m.reply('*Ingresa un enlace de Facebook.*');
    }

    try {
        await m.react('wait');

        const res = await igdl(m.args[0]);
        if (!res || !res.data || res.data.length === 0) {
            await m.react('error');
            return m.reply('*No se encontraron resultados.*');
        }

        let data = res.data.find(i => i.resolution === "720p (HD)") || res.data.find(i => i.resolution === "360p (SD)");
        if (!data) {
            await m.react('error');
            return m.reply('*No se encontró una resolución adecuada.*')
        }

        let video = data.url;

        await m.react('wait');
        await conn.sendMessage(m.chat.id, { video: { url: video }, caption: '', fileName: 'fb.mp4', mimetype: 'video/mp4' }, { quoted: m });

        await m.react('done');
    } catch (e) {
        console.log(e);
        await m.react('error');
        return m.reply('*Error al enviar el video.*');
    }
};

export default command
