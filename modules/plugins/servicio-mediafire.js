import got from 'got';
import cheerio from 'cheerio';

const MDregex = /https:\/\/www\.mediafire\.com\/(file|file_premium)\/([a-zA-Z0-9]+)/i;
const MFregex = /https:\/\/www\.mediafire\.com\/folder\/([a-zA-Z0-9]+)/i;

const Size = (number) => {
    number = Number(number);
    const sizes = ['KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(number) / Math.log(1024)) || 0;
    return { KB: (number / 1024 ** i).toFixed(2), string: `${(number / 1024 ** i).toFixed(2)} • ${sizes[i]}` }
};

const extractKey = (url, regex) => url.match(regex)?.[2] || null;

async function mediaFDL(URL) {
    const KEY = extractKey(URL, MDregex);
    try {
        const res = await got.get(URL);
        const $ = await cheerio.load(res.body);
        const ButtonDL = $('#downloadButton');
        if (!ButtonDL.length) throw new Error('No se puede descargar el archivo');
        const { body } = await got.get(`https://www.mediafire.com/api/1.5/file/get_info.php?quick_key=${KEY}&response_format=json`);
        const files = JSON.parse(body).response.file_info;

        return {
            fileName: files.filename,
            fileSize: files.size,
            mimeType: files.mimetype,
            created: files.created,
            Link: ButtonDL.attr('href')
        };
    } catch (e) {
        console.error(e);
        return null;
    }

}

async function mediaFFL(URL) {
    const KEY = extractKey(URL, MFregex);
    const { body } = await got.get(`https://www.mediafire.com/api/1.5/folder/get_content.php?content_type=files&filter=all&order_by=name&order_direction=asc&chunk=1&folder_key=${KEY}&response_format=json`);
    const files = JSON.parse(body).response.folder_content.files;
    return files.map(({ filename, size, mimetype, created_utc, links }) => ({
        fileName: filename,
        fileSize: size,
        mimeType: mimetype,
        created: created_utc,
        Link: links.normal_download
    }));
}

const command = {
    command: ['mediafire', 'mdf'],
    categoria: ['servicio'],
    script: async (m, { conn }) => {
        const URLMD = m.text.match(MDregex);
        const URLMF = m.text.match(MFregex);
        if (!m.args[0]) return m.reply('Y el link?');

        await m.react('wait');
        try {
            if (URLMD) {
                const mediafireDL = await mediaFDL(URLMD[0]);
                if (!mediafireDL) return m.reply('No se pudo obtener el enlace de descarga.');
                await conn.sendMessage(m.chat.id, {
                    document: { url: mediafireDL.Link },
                    mimetype: mediafireDL.mimeType,
                    fileName: mediafireDL.fileName
                }, { quoted: m });
            } else if (URLMF) {
                const mediaFL = await mediaFFL(URLMF[0]);
                const buttons = mediaFL.map(obj => ({
                    header: '',
                    title: obj.fileName,
                    description: `tamaño: ${Size(obj.fileSize).string}\nCreado: ${obj.created}`,
                    id: '.mediafire ' + obj.Link
                }));

                await conn.sendButton(m.chat.id, [
                    `*${mediaFL.length} archivos*`, null, null
                ], ['document:true', null, { fileName: ' ', jpegThumbnail: true }],
                    [{ name: 'single_select', button: ['Settings', [{ title: 'MEDIAFIRE', highlight_label: 'files', rows: buttons }]] }], m, {
                    mentionedJid: [m.sender.id],
                    externalAdReply: {
                        thumbnailUrl: 'https://th.bing.com/th/id/OIP.4nqy7etYoNgJZKI61RUPEgAAAA?rs=1&pid=ImgDetMain',
                        renderLargerThumbnail: true,
                        mediaType: 1
                    }
                });
            } else {
                return m.reply('No es un enlace válido.');
            }
            m.react('done');
        } catch (e) {
            console.error('Error:', e);
            m.react('error');
        }
    }
};

export default command;