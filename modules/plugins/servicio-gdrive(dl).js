import got from 'got'

const command = {
    command: ['gdrive', 'drive'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) return m.reply(`Ejemplo: ${m.command}gdrive https://drive.google.com/file/d/1puDHQmT_leglqDk9HObdbPTLfK9phGpl/view?usp=drive_open`);

    async function GDriveDl(url) {
        const id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))?.[1];
        if (!id) return m.reply('No se encontró ID en la URL.');

        const res = await got(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
            method: 'POST',
            headers: {
                'accept-encoding': 'gzip, deflate, br',
                'content-length': 0,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'origin': 'https://drive.google.com',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
                'x-drive-first-party': 'DriveWebUi',
                'x-json-requested': 'true'
            }
        });
        
        const { fileName, sizeBytes, downloadUrl } = JSON.parse(res.body.slice(4));
        if (!downloadUrl) return m.reply('¡El enlace de descarga está limitado!');
        
        const data = await got(downloadUrl);
        if (data.statusCode !== 200) throw new Error(data.statusMessage);

        return {
            downloadUrl, 
            fileName,
            fileSize: (sizeBytes / 1024 / 1024).toFixed(2),
            mimetype: data.headers['content-type']
        };
    }

    try {
        const driveData = await GDriveDl(m.args[0]);
        const message = `╭ ✦ *</Google Drive>*\n╵Nombre: ${driveData.fileName}\n╵Tamaño: ${driveData.fileSize} MB\n╵Tipo: ${driveData.mimetype}\n╰╶╴──────╶╴─╶╴◯`;

        await m.react('wait');
        await m.reply(message);
        await conn.sendMessage(m.chat.id, { document: { url: driveData.downloadUrl }, fileName: driveData.fileName, mimetype: driveData.mimetype }, { quoted: m });
        await m.react('done');
    } catch (error) {
        console.error('Error:', error);
        m.reply(`Error: ${error.message}`);
    }
}

export default command
