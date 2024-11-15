import FormData from "form-data"

const command = {
    command: ['remini', 'hd'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    const type = m.SMS().message;
    if (!type['imageMessage']) {
        await m.react('❗')
        return await m.reply('Por favor, vuelva a enviar el comando junto con una imagen o respondiendo a una.')
    }
    let media = await conn.download();
    const Image = await remini(media, "enhance");
    conn.sendMessage(m.chat.id, { image: Image }, { quoted: m })
}

export default command

async function remini(urlPath, method) {
    return new Promise(async (resolve, reject) => {
        let Methods = ["enhance", "recolor", "dehaze"];
        Methods.includes(method) ? (method = method) : (method = Methods[0]);
        let buffer, Form = new FormData(), scheme = "https" + "://" + "inferenceengine" + ".vyro" + ".ai/" + method

        Form.append("model_version", 1, { "Content-Transfer-Encoding": "binary", contentType: "multipart/form-data; charset=uttf-8" })
        Form.append("image", Buffer.from(urlPath), { filename: "enhance_image_body.jpg", contentType: "image/jpeg" })
        Form.submit({ url: scheme, host: "inferenceengine" + ".vyro" + ".ai", path: "/" + method, protocol: "https:", headers: { "User-Agent": "okhttp/4.9.3", Connection: "Keep-Alive", "Accept-Encoding": "gzip", } }, function (err, res) {
            if (err) reject();
            let data = [];
            res.on("data", function (chunk, resp) { data.push(chunk) }).on("end", () => { resolve(Buffer.concat(data)) })
            res.on("error", (e) => { reject() })
        });
    });
}