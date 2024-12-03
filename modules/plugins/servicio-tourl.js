import got from 'got'
import BodyForm from 'form-data'
import fs from 'fs'
import path from 'path'
import { fileTypeFromBuffer } from 'file-type'

const command = {
    command: ['tourl'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    const smsg = m.type(m.SMS().message);
    if (['imageMessage', 'videoMessage'].includes(smsg)) {
        try {
            const mediaBuffer = await conn.download(), fileType = await fileTypeFromBuffer(mediaBuffer);
            if (!fileType) return m.reply('No se pudo determinar el tipo de archivo.');
            const tempFile = path.join('/tmp', `temp_${Date.now()}.${fileType.ext}`);
            fs.writeFileSync(tempFile, mediaBuffer);
            const url = await CatBox(tempFile);
            m.react('wait');
            m.reply(url);
            m.react('done');
            fs.unlinkSync(tempFile);
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            m.reply('Hubo un error al procesar tu solicitud.');
        }
    } else m.reply(`/${m.command} Responde a una imagen o video`);
}

export default command

async function CatBox(input) {
    try {
        const form = new BodyForm();
        form.append("fileToUpload", fs.createReadStream(input));
        form.append("reqtype", "fileupload");
        return (await got.post("https://catbox.moe/user/api.php", { body: form })).body;
    } catch (e) {
        console.error('Error:', e.message);
        throw e;
    }
}
