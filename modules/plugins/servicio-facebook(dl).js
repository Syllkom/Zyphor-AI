import { igdl } from 'ruhend-scraper'

const command = {
    command: ['facebook', 'fb'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) return m.reply('*Ingresa un enlace de Facebook.*');
    try {
        await m.react('wait');
        const res = await igdl(m.args[0]);
        if (!res?.data?.length) return await m.react('error'), m.reply('*No se encontraron resultados.*');

        const data = res.data.find(i => i.resolution === "720p (HD)") || res.data.find(i => i.resolution === "360p (SD)");
        if (!data) return await m.react('error'), m.reply('*No se encontró una resolución adecuada.*');

        await conn.sendMessage(m.chat.id, { video: { url: data.url }, caption: '', fileName: 'fb.mp4', mimetype: 'video/mp4' }, { quoted: m });
        await m.react('done');
    } catch (e) {
        console.log(e);
        await m.react('error');
        m.reply('*Error al enviar el video.*');
    }
}

export default command
