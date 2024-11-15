import fs from 'fs'
import path from 'path'

const command = {
    command: ['anime', 'animes', 'hentai', 'henatis', 'animeslatino'],
    categoria: ['servicio']
}

const _Image = {
    anime: [
        "https://img2.wallspic.com/crops/4/6/9/1/4/141964/141964-novela_visual-espacio-3840x2160.jpg",
        "https://img2.wallspic.com/crops/1/3/6/3/4/143631/143631-ambiente-castillo-arte-pintura_acuarela-lienzo-3840x2160.jpg",
        "https://img2.wallspic.com/crops/4/0/1/1/7/171104/171104-anime-arte-ilustracion-artista-edificio-3840x2160.jpg",
        "https://images.wallpaperscraft.com/image/single/girl_silhouette_planet_1067694_3840x2160.jpg"
    ],
    hentai: ['https://wp.youtube-anime.com/s4.anilist.co/file/anilistcdn/media/manga/banner/99472-r0vPFL45SK0N.jpg']
}


const getRandom = (Array) => Array[Math.floor(Math.random() * Array.length)]

command.script = async (m, { conn }) => {
    const animeDB = JSON.parse(fs.readFileSync(path.resolve('./lib/animeDB.json')))
    if (m.command == 'hentais' || m.command == 'hentai') {
        const animes = animeDB.hentais;
        const AnimList = Object.keys(animes).map(key => ({ name: key, ...animes[key] })).sort((a, b) => Object.values(a.capitulos).length - Object.values(b.capitulos).length)
        let single_select = [{ title: '', highlight_label: '', rows: [] }];

        if (m.tag.length < 1) {
            await m.react('wait')
            try {
                single_select = AnimList.map(anime => ({ title: '', highlight_label: Object.values(anime.capitulos).length === anime.cap_total ? '' : 'Emisión', rows: [{ header: anime.name.split('_').join(' '), title: `Capítulos: ${Object.values(anime.capitulos).length}/${anime.cap_total}. Temporada: ${anime.temporada}`, description: anime.clasificacion, id: `.hentai tag=${anime.name} tag=anime` }] }));
                await conn.sendButton(m.chat.id, ['Hola!', '', global.botName], ['image:url', getRandom(_Image.hentai)], [{ name: 'single_select', button: ['Animes', single_select] }], m);

                await m.react('done')
            } catch (e) { await m.react('error') }
        } else if (m.tag[1] === 'hentai') {
            if (animes[m.tag[0]]) {
                await m.react('wait')
                try {
                    const anime = animes[m.tag[0]];
                    single_select[0].title = anime.title;
                    const capitulos = Object.values(anime.capitulos);
                    for (let i = 0; i < capitulos.length; i++) { single_select[0].rows.push({ header: '', title: `Capítulo ${i + 1} | Sub Español`, description: '', id: `.hentai tag=${m.tag[0]} tag=capitulo tag=${i + 1}` }) }
                    await conn.sendButton(m.chat.id, [anime.title, 'Capítulos: ' + capitulos.length + '/' + anime.cap_total + '\n\n' + anime.sinopsis, '' + anime.clasificacion], ['image:url', anime.imagen], [{ name: 'single_select', button: ['Animes', single_select] }], m);
                    await m.react('done')
                } catch (e) { await m.react('error') }
            }
        } else if (m.tag[1] === 'capitulo') {
            await m.react('wait')
            try {
                const anime = animes[m.tag[0]];
                await conn.sendMessage(m.chat.id, { document: { url: anime.capitulos['' + m.tag[2]] }, caption: `Capítulo ${m.tag[2]} | Sub Español. ${anime.title}.`, mimetype: 'video/mp4', fileName: `${anime.title}. Capítulo ${m.tag[2]}. Sub Español.mp4` }, { quoted: m });
                await m.react('done')
            } catch (e) { await m.react('error') }
        }
    } else if (m.command == 'animeslatino') {
        const animes = animeDB.animes_latino;
        let single_select = [{ title: '', highlight_label: '', rows: [] }];

        if (m.tag[1] === 'anime') {
            if (animes[m.tag[0]]) {
                await m.react('wait')
                try {
                    const anime = animes[m.tag[0]];
                    single_select[0].title = anime.title;
                    const capitulos = Object.values(anime.capitulos);
                    for (let i = 0; i < capitulos.length; i++) { single_select[0].rows.push({ header: '', title: `Capítulo ${i + 1} | Español Latino`, description: '', id: `.animeslatino tag=${m.tag[0]} tag=capitulo tag=${i + 1}` }) }

                    await conn.sendButton(m.chat.id, [anime.title, 'Capítulos: ' + capitulos.length + '/' + anime.cap_total + '\n\n' + anime.sinopsis, '' + anime.clasificacion], ['image:url', anime.imagen], [{ name: 'single_select', button: ['Capítulos', single_select] }], m);
                    await m.react('done')
                } catch (e) { console.log(e), await m.react('error') }
            }
        } else if (m.tag[1] === 'capitulo') {
            await m.react('wait')
            try {
                const anime = animes[m.tag[0]];
                await conn.sendMessage(m.chat.id, { document: { url: anime.capitulos['' + m.tag[2]] }, caption: `Capítulo ${m.tag[2]} | Español Latino. ${anime.title}.`, mimetype: 'video/mp4', fileName: `${anime.title}. Capítulo ${m.tag[2]}. Español Latino.mp4` }, { quoted: m });
                await m.react('done')
            } catch (e) { await m.react('error') }
        }
    } else {
        const animes = animeDB.animes;
        const AnimList = Object.keys(animes).map(key => ({ name: key, ...animes[key] })).sort((a, b) => Object.values(a.capitulos).length - Object.values(b.capitulos).length)
        let single_select = [{ title: '', highlight_label: '', rows: [] }];

        const animesLatino = animeDB.animes_latino;
        const AnimListLatino = Object.keys(animesLatino).map(key => ({ name: key, ...animesLatino[key] })).sort((a, b) => Object.values(a.capitulos).length - Object.values(b.capitulos).length)
        let single_selectLatino = [{ title: '', highlight_label: '', rows: [] }];

        if (m.tag.length < 1) {
            await m.react('wait')
            try {
                single_select = AnimList.map(anime => ({ title: '', highlight_label: Object.values(anime.capitulos).length === anime.cap_total ? '' : 'Emisión', rows: [{ header: anime.name.split('_').join(' '), title: `Capítulos: ${Object.values(anime.capitulos).length}/${anime.cap_total}. Temporada: ${anime.temporada}`, description: anime.clasificacion, id: `.anime tag=${anime.name} tag=anime` }] }));

                single_selectLatino = AnimListLatino.map(anime => ({ title: '', highlight_label: Object.values(anime.capitulos).length === anime.cap_total ? '' : 'Emisión', rows: [{ header: anime.name.split('_').join(' '), title: `Capítulos: ${Object.values(anime.capitulos).length}/${anime.cap_total}. Temporada: ${anime.temporada}`, description: anime.clasificacion, id: `.animeslatino tag=${anime.name} tag=anime` }] }));

                await conn.sendButton(m.chat.id, ['Hola!', 'Aquí podrás encontrar algunos de los animes que se han añadido a este bot.', global.botName], ['image:url', getRandom(_Image.anime)], [{ name: 'single_select', button: ['Animes | Sub español', single_select] }, { name: 'single_select', button: ['Animes | Español Latino', single_selectLatino] }], m);

                await m.react('done')
            } catch (e) { await m.react('error') }
        } else if (m.tag[1] === 'anime') {
            if (animes[m.tag[0]]) {
                await m.react('wait')
                try {
                    const anime = animes[m.tag[0]];
                    single_select[0].title = anime.title;
                    const capitulos = Object.values(anime.capitulos);
                    for (let i = 0; i < capitulos.length; i++) { single_select[0].rows.push({ header: '', title: `Capítulo ${i + 1} | Sub Español`, description: '', id: `.anime tag=${m.tag[0]} tag=capitulo tag=${i + 1}` }) }
                    await conn.sendButton(m.chat.id, [anime.title, 'Capítulos: ' + capitulos.length + '/' + anime.cap_total + '\n\n' + anime.sinopsis, '' + anime.clasificacion], ['image:url', anime.imagen], [{ name: 'single_select', button: ['Capítulos', single_select] }], m);
                    await m.react('done')
                } catch (e) { await m.react('error') }
            }
        } else if (m.tag[1] === 'capitulo') {
            await m.react('wait')
            try {
                const anime = animes[m.tag[0]];
                await conn.sendMessage(m.chat.id, { document: { url: anime.capitulos['' + m.tag[2]] }, caption: `Capítulo ${m.tag[2]} | Sub Español. ${anime.title}.`, mimetype: 'video/mp4', fileName: `${anime.title}. Capítulo ${m.tag[2]}. Sub Español.mp4` }, { quoted: m });
                await m.react('done')
            } catch (e) { await m.react('error') }
        }
    }
}

export default command;
