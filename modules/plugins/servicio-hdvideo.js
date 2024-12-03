import { exec } from 'child_process'

const command = {
    command: ['hdvideo', 'hdvid'],
    categoria: ['herramienta']
}

command.script = async (m, { conn }) => {
    const mime = (m.quoted?.msg || m.msg || {}).mimetype || ''; 
    if (!mime) return m.reply('¿Dónde está el video?');
    m.reply('Espera un momento... esto puede tomar algo de tiempo.');

    try {
        const media = await conn.download(), output = `/tmp/output_${Date.now()}.mp4`;
        exec(`ffmpeg -i ${media} -s 1280x720 -c:v libx264 -c:a copy ${output}`, async (error) => {
            if (error) return console.error(`Error al procesar el video: ${error.message}`), m.reply('Hubo un error al procesar el video.');
            await conn.sendMessage(m.chat.id, { video: { url: output }, caption: '✅ *Video mejorado a HD con éxito.*' }, { quoted: m });
        });
    } catch (e) { console.error('Error:', e); m.reply('Hubo un error al procesar tu solicitud.'); }
}

export default command
