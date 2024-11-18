import axios from 'axios'
let enviando = false

const command = {
    command: ['tw', 'twt', 'twitter', 'twdl', 'xdl'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) throw m.reply(`Ingrese el enlace de X (Twitter)\nEjemplo: *\`/${m.command}\`* https://x.com/NIKKE_japan/status/1823177979050000451?t=mh4Tbv7g3w56Xx2xNqUKOw&s=19`);
    if (enviando) return;
    enviando = true;
    try {
        await m.react('wait');
        const res = await TwitterDL(m.args[0]);
        if (res?.result.type === 'video') {
            await m.react('done');
            for (let i = 0; i < res.result.media.length; i++) {
                await conn.sendMessage(m.chat.id, { video: { url: res.result.media[i].result[0].url }, caption: res.result.caption || '*Aquí tiene su video*' }, { quoted: m });
            }
        } else if (res?.result.type === 'photo') {
            await m.react('done');
            for (let i = 0; i < res.result.media.length; i++) {
                await conn.sendMessage(m.chat.id, { image: { url: res.result.media[i].url }, caption: res.result.caption || '*Aquí tiene su imagen*' }, { quoted: m });
            }
        }
        enviando = false;
    } catch {
        await m.react('error');
        enviando = false;
        throw m.reply('Error, intente más tarde.');
    }
}

export default command

const _twitterapi = (id) => `https://info.tweeload.site/status/${id}.json`;
const getAuthorization = async () => (await axios.get("https://pastebin.com/raw/SnCfd4ru")).data;

const TwitterDL = async (url) => new Promise(async (resolve) => {
    const id = url.match(/\/([\d]+)/);
    if (!id) return resolve({ status: "error", message: "Error al obtener ID de Twitter." });
    const response = await axios.get(_twitterapi(id[1]), {
        headers: { Authorization: await getAuthorization(), "user-agent": "Mozilla/5.0" },
    });
    if (response.data.code !== 200) return resolve({ status: "error", message: "Error en la solicitud." });

    let media = [], type;
    if (response.data.tweet?.media?.videos) {
        type = "video";
        response.data.tweet.media.videos.forEach((v) => {
            const resultVideo = v.video_urls.map((z) => ({ bitrate: z.bitrate, content_type: z.content_type, resolution: z.url.match(/([\d ]{2,5}[x][\d ]{2,5})/)[0], url: z.url }));
            if (resultVideo.length) media.push({ type: v.type, duration: v.duration, thumbnail_url: v.thumbnail_url, result: resultVideo });
        });
    } else {
        type = "photo";
        response.data.tweet.media.photos.forEach((v) => media.push(v));
    }

    resolve({
        status: "success",
        result: {
            id: response.data.tweet.id,
            caption: response.data.tweet.text,
            type,
            media: media.length ? media : null,
        },
    });
});
