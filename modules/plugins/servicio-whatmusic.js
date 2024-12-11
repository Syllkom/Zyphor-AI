import acrcloud from 'acrcloud'
import fs from 'fs'
import path from 'path'

const command = {
    command: ['whatmusic', 'identifymusic'],
    categoria: ['herramienta']
}

command.script = async (m, { conn }) => {
    const acr = new acrcloud({
        host: 'identify-us-west-2.acrcloud.com',
        access_key: '4a204cb87e0aecdc821cc1e69510433c',
        access_secret: 'NhyODMNhUtMoLQZ8DPCKfV1mRhVgpNd1c4UrpMHJ' });
    const smsg = m.type(m.SMS().message);
    if (!['audioMessage', 'videoMessage'].includes(smsg)) return m.reply('*Responde a un mensaje con un audio o video.*');

    await m.react('wait');
    try {
        const mediaBuffer = await conn.download(), tmpDir = path.resolve('./tmp'); 
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
        const tempPath = path.join(tmpDir, `temp_${Date.now()}.mp3`); 
        fs.writeFileSync(tempPath, mediaBuffer);
        const res = await acr.identify(fs.readFileSync(tempPath)), { code, msg } = res.status;
        if (code !== 0) return m.reply(msg);

        const { title, artists, album, genres, release_date } = res.metadata.music[0], txt = `○ *Título:* ${title}\n○ *Artista(s):* ${artists ? artists.map(v => v.name).join(', ') : 'No encontrado'}\n○ *Álbum:* ${album.name || 'No encontrado'}\n○ *Género(s):* ${genres ? genres.map(v => v.name).join(', ') : 'No encontrado'}\n○ *Fecha de Lanzamiento:* ${release_date || 'No encontrado'}`.trim();

        await m.react('done'), m.reply(txt), fs.unlinkSync(tempPath);
    } catch (e) { console.error('Error al identificar la música:', e), m.reply('Ocurrió un error al procesar el audio.'); }
}

export default command
