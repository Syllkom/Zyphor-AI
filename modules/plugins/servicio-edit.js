import fs from 'fs';
import path from 'path';

const command = {
    command: ['edit', 'ed'],
    categoria: ['servicio']
};

command.script = async (m, { conn }) => {
    if (!m.args[0]) {
        m.reply(`Ejemplo: ${command.command[0]} <anime|phonk>`);
        return;
    }

    const arg = m.args[0].toLowerCase();

    const editsAnimeDB = JSON.parse(fs.readFileSync(path.resolve('./lib/editsAnime.json')));

    let edits;

    if (arg === 'anime') {
        edits = editsAnimeDB.edits_anime;
    } else if (arg === 'phonk') {
        edits = editsAnimeDB.edit_phonk;
    } else {
        m.reply(`Ejemplo: ${command.command[0]} <anime|phonk>`);
        return;
    }

    if (edits.length === 0) {
        m.reply('No hay edits disponibles.');
        return;
    }

    const randomEdit = edits[Math.floor(Math.random() * edits.length)];

    await conn.sendMessage(m.chat.id, { 
        video: { url: randomEdit }, 
        caption: `*Aquí tienes tu edit ${arg}:*`
    }, { quoted: m })
}

export default command;