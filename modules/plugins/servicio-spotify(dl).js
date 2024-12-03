import got from 'got'

const command = {
    command: ['spotify', 'spotifydl'],
    categoria: ['servicio']
};

command.script = async (m, { conn }) => {
    if (!m.args[0]) return m.reply(`❌ Uso: ${m.command} <enlace de Spotify>\nEjemplo: ${m.command} https://open.spotify.com/track/2Tp8vm7MZIb1nnx1qEGYv5`);

    const spotifyDl = async (url) => {
        try {
            const apiUrl = `https://api.agatz.xyz/api/spotifydl?url=${encodeURIComponent(url)}`;
            const response = await got(apiUrl, { responseType: 'json' });
            if (response.body.status !== 200) throw new Error('Error al obtener datos desde la API.');
            const data = JSON.parse(response.body.data);
            if (!data || !data.url_audio_v1) throw new Error('No se encontró un enlace de audio.');
            return data;
        } catch (error) {
            throw new Error(error.message || 'Error al procesar la solicitud.');
        }
    };

    try {
        const spotifyData = await spotifyDl(m.args[0]);

        const info = `${spotifyData.judul || 'No disponible'}\n\n` +
                     `╭ ✦ *</Spotify>*\n` +
                     `╵🎤 Artista: ${spotifyData.nama_channel || 'No disponible'}\n` +
                     `╵⏱️ Duración: ${spotifyData.durasi || 'No disponible'} segundos\n` +
                     `╵🔗 Audio: DowMp3\n` +
                     `╰╶╴──────╶╴─╶╴◯\n\n` +
                     `● *DowMp3:* ${spotifyData.url_audio_v1}`;

        await m.react('wait');
        await m.reply(info);
        await conn.sendMessage(m.chat.id, { audio: { url: spotifyData.url_audio_v1 },  caption: '🎵 Aquí está tu audio.', mimetype: 'audio/mpeg' }, { quoted: m });
        await m.react('done');
    } catch (error) {
        console.error('Error:', error);
        m.reply(`❌ Error: ${error.message}`);
    }
}

export default command
