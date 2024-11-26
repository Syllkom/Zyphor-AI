import got from 'got'

const command = {
    command: Array.from({ length: 161 }, (_, i) => `sound${i + 1}`),
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    try {
        const soundUrl = `https://github.com/DGXeon/Tiktokmusic-API/raw/master/tiktokmusic/${m.command}.mp3`;
        const audioBuffer = await got(soundUrl).buffer();

        await conn.sendMessage(m.chat.id, { audio: audioBuffer, mimetype: 'audio/mp4', ptt: true }, { quoted: m });
    } catch (e) {
        console.error(e);
        await m.react('error');
        await m.reply('❌ No se pudo reproducir el sonido. Verifique el comando e intente nuevamente.');
    }
}

export default command
