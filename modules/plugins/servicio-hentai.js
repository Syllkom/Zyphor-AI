import fs from 'fs'
import path from 'path'

const command = {
    command: ['hentai', 'hentais'],
    categoria: ['servicio']
}
const _Image = {
    hentai: ['https://telegra.ph/file/e6e7a4f32b971870ab951.jpg']
}
const getRandom = (Array) => Array[Math.floor(Math.random() * Array.length)];

command.script = async (m, { conn }) => {
    const animeDB = JSON.parse(fs.readFileSync(path.resolve('./imagenes/animes/animeDB.json')));
    if (m.command === 'hentais' || m.command === 'hentai') {
        const animes = animeDB.hentais;
        const AnimList = Object.keys(animes).map(key => ({ name: key, ...animes[key] })).sort((a, b) => Object.values(a.capitulos).length - Object.values(b.capitulos).length);
        let single_select = [{ title: '', highlight_label: '', rows: [] }];

        if (m.tag.length < 1) {
            await m.react('wait');
            try {
                single_select = AnimList.map((anime, index) => ({
                    text: `[ \`${index + 1}\` ] *${anime.name.split('_').join(' ')}*\nCapítulos: ${Object.values(anime.capitulos).length}/${anime.cap_total}. Temporada: ${anime.temporada}`,
                    assign: { [`${index + 1}`]: { command: `.hentai tag=${anime.name} tag=hentai` } }
                }));
                const assign = { user: 'all', response: {} };
                for (let i = 0; i < single_select.length; i++) Object.assign(assign.response, single_select[i].assign);

                conn.saveMessageIdForResponse(await conn.sendMessage(m.chat.id, { image: { url: getRandom(_Image.hentai) }, caption: single_select.map((o) => o.text).join('\n\n') }), assign);
                await m.react('done');
            } catch (e) { await m.react('error'); console.error(e); }
        } else if (m.tag[1] === 'hentai') {
            if (animes[m.tag[0]]) {
                await m.react('wait');
                try {
                    const anime = animes[m.tag[0]], capitulos = Object.values(anime.capitulos);
                    single_select = capitulos.map((anime, index) => ({
                        text: `[ \`${index + 1}\` ]. Capítulo \`${index + 1}\` | Sub Español`,
                        assign: { [`${index + 1}`]: { command: `.hentai tag=${m.tag[0]} tag=capitulo tag=${index + 1}` } }
                    }));
                    const assign = { user: 'all', response: {} };
                    for (let i = 0; i < single_select.length; i++) Object.assign(assign.response, single_select[i].assign);

                    conn.saveMessageIdForResponse(await conn.sendMessage(m.chat.id, { image: { url: anime.imagen }, caption: '*' + anime.title + '*\n\nCapítulos: ' + capitulos.length + '/' + anime.cap_total + '\nClasificación: ' + anime.clasificacion + '\n\n' + (anime.sinopsis ? anime.sinopsis + '\n\n' : '') + single_select.map((o) => o.text).join('\n\n') }), assign);
                    await m.react('done');
                } catch (e) { await m.react('error'); console.error(e); }
            }
        } else if (m.tag[1] === 'capitulo') {
            await m.react('wait');
            try {
                const anime = animes[m.tag[0]], videoUrl = anime.capitulos['' + m.tag[2]], jpegThumbnail = await conn.resizePhoto({ image: anime.imagen, scale: 140, result: 'base64' });

                conn.saveMessageIdForResponse(await conn.sendMessage(m.chat.id, { document: { url: videoUrl }, mimetype: 'video/mp4', fileName: `${anime.title}. Capítulo ${m.tag[2]}. Sub Español.mp4`, jpegThumbnail: jpegThumbnail, caption: `Capítulo ${m.tag[2]} | Sub Español. ${anime.title}.` }, { quoted: m }));
                await m.react('done');
            } catch (e) { await m.react('error'); console.error(e); }
        }
    }
}

export default command
