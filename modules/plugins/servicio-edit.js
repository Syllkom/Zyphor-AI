import fs from 'fs'
import path from 'path'

const command = { 
    command: ['edit', 'ed'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) return m.reply(`Ejemplo: ${command.command[0]} <anime|phonk>`);

    const arg = m.args[0].toLowerCase(), editsAnimeDB = JSON.parse(fs.readFileSync(path.resolve('./imagenes/anime/editsAnime.json')));
    const edits = arg === 'anime' ? editsAnimeDB.edits_anime : arg === 'phonk' ? editsAnimeDB.edit_phonk : null;

    if (!edits) return m.reply(`Ejemplo: ${command.command[0]} <anime|phonk>`);
    if (edits.length === 0) return m.reply('No hay edits disponibles.');

    const randomEdit = edits[Math.floor(Math.random() * edits.length)];
    await conn.sendMessage(m.chat.id, { video: { url: randomEdit }, caption: `*Aquí tienes tu edit ${arg}:*` }, { quoted: m });
}

export default command
