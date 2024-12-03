import axios from 'axios'
import cheerio from 'cheerio'
import got from 'got'

const command = {
    command: ['mediafire', 'mdfire', 'mf'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) return m.reply('Y el link?');
    try {
        const res = await mediafireDl(m.args[0]);
        const { name, size, mime, link } = res;
        const caption = `╭ ✦ *</Mediafire>*\n╵Nombre: ${name}\n╵Peso: ${size}\n╵Tipo: ${mime}\n╰╶╴──────╶╴─╶╴◯`.trim();
        await m.reply(caption);
        await conn.sendMessage(m.chat.id, { document: { url: link }, fileName: name, mimetype: mime, asDocument: true }, { quoted: m });
        await m.react('✅');
    } catch (e) { console.error(e); await m.reply(`Error`); await m.react('error'); }
}

export default command

async function mediafireDl(url) {
    const res = await axios.get(`https://www-mediafire-com.translate.goog/${url.replace('https://www.mediafire.com/', '')}?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp`);
    const $ = cheerio.load(res.data);
    const link = $('#downloadButton').attr('href');
    const name = $('body > main > div.content > div.center > div > div.dl-btn-cont > div.dl-btn-labelWrap > div.promoDownloadName.notranslate > div').attr('title').replaceAll(' ', '').replaceAll('\n', '');
    const size = $('#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('                         ', '').replaceAll(' ', '');
    const mime = (await got.head(link)).headers['content-type'];
    return { name, size, mime, link };
}
