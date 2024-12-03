import axios from 'axios'

const command = {
    command: ['tthd', 'tiktokhd'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) return m.reply(`Ingrese el comando *\`/${m.command}\`* y seguido un enlace de *Tiktok*\nEjemplo: /${m.command} https://vm.tiktok.com/ZMh3TnkQp/`);
    if (!(m.args[0].includes('http://') || m.args[0].includes('https://'))) return m.reply('URL no válida, asegúrate de que incluya http:// o https://');
    if (!m.args[0].includes('tiktok.com')) return m.reply('URL de TikTok no válida.');

    const tiktokDl = async (url) => new Promise(async (resolve, reject) => {
        try {
            const formatNumber = (num) => Number(parseInt(num)).toLocaleString().replace(/,/g, '.');
            const formatDate = (n, locale = 'en') => new Date(n).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
            const res = await axios.post('https://www.tikwm.com/api/', {}, {
                headers: {
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Origin': 'https://www.tikwm.com',
                    'Referer': 'https://www.tikwm.com/',
                    'Sec-Ch-Ua': '"Not)A;Brand" ;v="24" , "Chromium" ;v="116"',
                    'Sec-Ch-Ua-Mobile': '?1',
                    'Sec-Ch-Ua-Platform': 'Android',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                params: { url, count: 12, cursor: 0, web: 1, hd: 1 }
            }).then(res => res.data.data);

            const data = [];
            if (res && !res.size && !res.wm_size && !res.hd_size) res.images.forEach(v => data.push({ type: 'photo', url: v }));
            else {
                if (res.wmplay) data.push({ type: 'watermark', url: 'https://www.tikwm.com' + res.wmplay });
                if (res.play) data.push({ type: 'nowatermark', url: 'https://www.tikwm.com' + res.play });
                if (res.hdplay) data.push({ type: 'nowatermark_hd', url: 'https://www.tikwm.com' + res.hdplay });
            }

            resolve({
                status: true,
                title: res.title,
                taken_at: formatDate(res.create_time).replace('1970', ''),
                region: res.region,
                id: res.id,
                durations: res.duration,
                duration: res.duration + ' Seconds',
                cover: 'https://www.tikwm.com' + res.cover,
                size_wm: res.wm_size,
                size_nowm: res.size,
                size_nowm_hd: res.hd_size,
                data,
                music_info: {
                    id: res.music_info.id,
                    title: res.music_info.title,
                    author: res.music_info.author,
                    album: res.music_info.album || null,
                    url: 'https://www.tikwm.com' + (res.music || res.music_info.play)
                },
                stats: {
                    views: formatNumber(res.play_count),
                    likes: formatNumber(res.digg_count),
                    comment: formatNumber(res.comment_count),
                    share: formatNumber(res.share_count),
                    download: formatNumber(res.download_count)
                },
                author: {
                    id: res.author.id,
                    fullname: res.author.unique_id,
                    nickname: res.author.nickname,
                    avatar: 'https://www.tikwm.com' + res.author.avatar
                }
            });
        } catch (e) { reject(e); }
    });

    try {
        const down = await tiktokDl(m.args[0]);
        const caption = `${readMore}\n● *Videos:*\n- Título: ${down.title}\n- Server: ${down.region}\n- ID: \`${down.id}\`\n- Duración: \`${down.duration}\`\n- Size: \`${down.size_nowm_hd}\`\n\n● *Music Info:*\n- ID: \`${down.music_info.id}\`\n- Título: ${down.music_info.title}\n- Propietario music: ${down.music_info.author}\n\n● *Stats:*\n- Visitas: \`${down.stats.views}\`\n- Likes: \`${down.stats.likes}\`\n- Comentarios: \`${down.stats.comment}\`\n- Share: \`${down.stats.share}\`\n- Download: \`${down.stats.download}\`\n\n● *Autor:*\n- ID: \`${down.author.id}\`\n- Full Name: ${down.author.fullname}\n- Nickname: ${down.author.nickname}\n- Avatar: ${down.author.avatar}`;

        await m.react('wait');
        await conn.sendMessage(m.chat.id, { video: { url: down.data[2].url }, caption }, { quoted: m });
        await conn.sendMessage(m.chat.id, { audio: { url: down.music_info.url }, mimetype: 'audio/mp4', ptt: false }, { quoted: m });
        await m.react('done');
    } catch (e) {
        console.error(e);
        m.reply('Error al descargar el video.');
    }
}

export default command
