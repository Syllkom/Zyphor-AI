import got from 'got'

const command = {
    command: ['gitclone', 'clone', 'git'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
    if (!m.args[0]) return m.reply('Y el link?');
    if (!regex.test(m.args[0])) return m.reply('Link incorrecto');

    let [_, user, repo] = m.args[0].match(regex) || [];
    const url = `https://api.github.com/repos/${user}/${repo.replace(/.git$/, '')}/zipball`;

    try {
        const filename = (await got.head(url)).headers['content-disposition'].match(/attachment; filename=(.*)/)[1];
        await m.react('🕑');
        await conn.sendMessage(m.chat.id, { document: { url }, mimetype: 'application/zip', fileName: filename }, { quoted: m });
        await m.react('✅');
    } catch (e) { console.error(e); await m.react('error'); }
}

export default command
