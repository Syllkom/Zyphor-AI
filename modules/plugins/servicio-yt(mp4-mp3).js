import YouTube from "youtube-sr/dist/mod.mjs"
import cheerio from 'cheerio'
import got from 'got'

const Regex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/

const command = {
    command: ['ytmp3', 'ytmp4', 'ytmp'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.text) return m.reply(`Ingrese el comando *\`.${m.command}\`* y seguido el enlace de un video de YouTube`)
    if (!Regex.test(m.args[0])) return m.reply(`Link incorrecto`)

    try {
        if (m.command == 'ytmp') {
            await m.react('wait')
            try {
                let data
                try {
                    data = (await got('https://ab.cococococ.com/ajax/download.php', { searchParams: { copyright: '0', format: 360, url: m.args[0], api: 'dfcb6d76f2f6a9894gjkege8a4ab232222' }, headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36', 'Referer': 'https://ddownr.com/en46/' }, responseType: 'json' })).body
                    data.thumb = data.info.image
                    data.title = data.info.title
                } catch { data = await getMedia(urls[i]) }

                await conn.sendButton(m.chat.id, [data.title, null, global.botName], ['image-url', data.thumb], [
                    { name: 'reply', button: ['( Video • 📽️ )', `.ytmp4 ${m.args[0]}`] },
                    { name: 'reply', button: ['( Audio • 🎧 )', `.ytmp3 ${m.args[0]}`] },
                ], m)
                await m.react('done')
            } catch (e) { new Error('No result') }
        }
        else if (m.command == 'ytmp3') {
            await m.react('wait')
            const infoLink = await YouTube.getVideo(m.args[0])
            const data = await ytmp3(m.args[0])

            conn.saveMessageIdForResponse(await conn.sendMessage(m.chat.id, { audio: { url: data.url }, contextInfo: { externalAdReply: { title: data.title, body: infoLink?.channel?.name, previewType: "PHOTO", thumbnailUrl: infoLink?.thumbnail?.url } }, mimetype: "audio/mp4", fileName: "audio.mp3" }, { quoted: m }), { user: 'all', response: { mp4: { command: `.ytmp4 ${m.args[0]}` }, video: { command: `.ytmp4 ${m.args[0]}` } } })

            await m.react('done')
        }
        else if (m.command == 'ytmp4') {
            await m.react('wait')
            const data = (await got(`https://deliriussapi-oficial.vercel.app/download/ytmp4`, { searchParams: { url: m.args[0] }, responseType: 'json' })).body

            conn.saveMessageIdForResponse(await conn.sendMessage(m.chat.id, { document: { url: data.data.download.url }, mimetype: 'video/mp4', fileName: data.data.download.filename, jpegThumbnail: await conn.resizePhoto({ image: data.data.image, scale: 140, result: 'base64' }) }, { quoted: m }), { user: 'all', response: { mp3: { command: `.ytmp3 ${m.args[0]}` }, audio: { command: `.ytmp3 ${m.args[0]}` } } })

            await m.react('done')
        }
    } catch (e) { m.react('error'), console.error(e) }
}

export default command

function YoutTube(texto) {
    var text = texto.split(' ')
    var enlaces = []
    var contador = 0

    for (var i = 0; i < text.length; i++) {
        if (Regex.test(text[i])) {
            enlaces.push(text[i]);
            contador++;
            if (contador === 5) { break }
        }
    }
    return enlaces
}

async function getMedia(url) {
    try {
        const $ = await cheerio.load((await got.get(`https://y2hub.cc/esesto/download?url=${url}`)).body);
        const mp3 = $('section:nth-of-type(1) > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(3) > div > div:nth-of-type(2) > div > a:nth-of-type(2)')
        const mp4 = $('section:nth-of-type(1) > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(1) > div > div:nth-of-type(2) > div > a:nth-of-type(2)')
        const img = $('section:nth-of-type(1) > div > div > div:first-child > img')
        const title = (mp4.attr('download')).split('.mp4').join('')
        return {
            title: title,
            thumb: img.attr('src'),
            audio: mp3.attr('href'),
            video: mp4.attr('href'),
        }
    } catch (error) {
        console.error('Error:', error);
        return null
    }
}

async function ytmp3(url) {
    let data
    try {
        data = (await got.post('https://dws5.ezmp3.cc/api/convert', { json: { url: url, quality: 128, trim: false, startT: 0, endT: 0 }, headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36', 'Referer': 'https://ezmp3.cc/' }, responseType: 'json' })).body
    } catch (e) {
        data = (await got.post('https://cnvmp3.com/fetch.php', { json: { url: url, downloadMode: 'audio', filenameStyle: 'pretty', audioBitrate: '96' }, headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36', 'Referer': 'https://cnvmp3.com/' }, responseType: 'json' })).body
        data.title = data.filename
    }

    return data
}

async function ytmp4(url) {
    let data
    try {
        data = (await got('https://ab.cococococ.com/ajax/download.php', { searchParams: { copyright: '0', format: 360, url: url, api: 'dfcb6d76f2f6a9894gjkege8a4ab232222' }, headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36', 'Referer': 'https://ddownr.com/en46/' }, responseType: 'json' })).body
    } catch (e) {
        data = (await got.post('https://cnvmp3.com/fetch.php', { json: { url: url, 'downloadMode': 'auto', 'filenameStyle': 'pretty', 'audioBitrate': '96' }, headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36', 'Referer': 'https://cnvmp3.com/' }, responseType: 'json' })).body
        data.title = data.filename
    }

    if (data.id) {
        let convert = await getConvertStatus(data.id);
        if (convert.error) return new Error('error')
        do { convert = await getConvertStatus(data.id) } while (convert.text !== "Finished")
        data.url = convert.download_url
    }

    return data
}

async function getConvertStatus(id) {
    try { return (await got('https://p.oceansaver.in/ajax/progress.php', { searchParams: { id: id }, headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36', 'Referer': 'https://ddownr.com/en46/' }, responseType: 'json' })).body } catch (error) { return { error: true } }
}

//const infoLink = await YouTube.getVideo(urls[i])
//const data = await ytmp4(urls[i])

/**
 * {
  "id": "9Zj0JOHJR-s",
  "url": "https://www.youtube.com/watch?v=9Zj0JOHJR-s",
  "shorts_url": "https://www.youtube.com/watch?v=9Zj0JOHJR-s",
  "title": "My Ordinary Life-The Living Tombstone",
  "description": "Get ready for an Original Song, My Ordinary Life! Inspired by music from the Japanese cartoon Nichijou by Kyoto Animation and Nomi Yuuji.\n\nBuy this Song:\n➢ iTunes: https:/
/itunes.apple.com/us/album/my-ordinary-life-single/1317910809?uo=4&app=itunes&at=1001lry3&ct=dashboard\n➢ AmazonMP3: http://www.amazon.com/gp/product/B077SC2YLF/?tag=distrokid06-20\n➢ Apple Mu
sic: https://itunes.apple.com/us/album/my-ordinary-life-single/1317910809?uo=4&app=itunes&at=1001lry3&ct=dashboard&app=music&at=1001lry3&ct=dashboard\n➢ Deezer: https://www.deezer.com/album/52
418792\n➢ Google Play: https://play.google.com/store/music/album/The_Living_Tombstone_My_Ordinary_Life?id=Bh34vxrcptpvaai32bgwdp6rfoq\n➢ iHeartRadio: https://www.iheart.com/artist/id-747760/al
bums/id-59038520\n➢ Spotify: https://open.spotify.com/album/4AmFZET7RGujQAhG80kjwu\n➢ Bandcamp: https://thelivingtombstone.bandcamp.com/track/jump-up-super-star-remix\n➢ Newgrounds (Free Downl
oad): https://www.newgrounds.com/audio/listen/815436\n\n\n➢ Directed, Animated and Produced - Pedro Calvo pedrojosecalvo@gmail.com\n➢ Music Production - Yoav Landau\n➢ Lyrics and Vocals - Sam
Haft https://twitter.com/SamHaft\n➢ Guitar Recording - Orko\n➢ Vocal editing and Tuning - Fruutella https://twitter.com/freddy_hoof\n➢ Mixing and Mastering - Ara Adkins - Recursion Music https
://iamrecursion.com/\n➢ Character Design - Zee Giesbrecht https://www.facebook.com/zeegiesbrecht/\n➢ Visual Assets - Zee Giesbrecht & Pedro Calvo\n\nFollow The Living Tombstone:\n➢ YouTube: ht
tp://bit.ly/TLTSubscribe\n➢ SoundCloud: http://bit.ly/TLTSoundcloud\n➢ Facebook: http://bit.ly/TLTFaceBook\n➢ Twitter: http://bit.ly/TLTTwitter\n➢ Newgrounds: http://bit.ly/TLTNewgrounds\n\nLy
rics:\n\nVERSE 1\n\nThey tell me keep it simple, I tell them take it slow\nI feed and water an idea so I let it grow\nI tell them take it easy, they laugh and tell me no,\nIt’s cool but I don’
t see them laughing at my money though\nThey spittin facts at me, I’m spittin tracks, catch me?\nI’m spinning gold out my records know you can’t combat me\nThey tell me jesus walks, I tell the
m money talks.\nBling got me chill, cause I’m living in an ice box.\nThey tell me I've been sleepin, I say I’m wide awake\nTracks hot and ready so they call me mister e-z bake\nThey say the gr
ass is greener, I think my grass is dank\nDrivin with a drank on an empty tank to the bank\n\nPRE CHORUS\n\nDo you feel me? Talk a look inside my brain\nThe people always different but it alwa
ys feel the same\n\nThat’s the real me. Pop the champagne\nThe haters wanna hurt me and I’m laughin at the pain\n\nCHORUS\n\nStayin still, Eyes closed\nLet the world just pass me by\n\nPain pi
lls, Nice clothes\nIf I fall I think I’ll fly\n\nTouch me, Midas\nMake me part of your design\n\nNone to guide us\nI feel fear for the very last time\n\n\nVERSE 2\n\nThey tell me that I’m spec
ial, I smile and shake my head\nI’ll give them stories to tell friends about the things I said\nThey tell me I’m so humble, I say I’m turning red\nThey let me lie to them and don’t feel like t
hey’ve been misled\nThey give so much to me, I’m losing touch get me?\nServed on a silver platter, ask for seconds they just let me.\nThey tell me I’m a god, I’m lost in the facade\nSix feet o
ff the ground at all times I think I’m feelin odd\nNo matter what I make, they never see mistakes\nMakin so much bread, I don’t care that they’re just being fake\nThey tell me they’re below me
, I act like I’m above\nThe people blend together but I would be lost without their love\n\nPRE CHORUS\n\nCan you heal me? Have I gained too much?\nWhen you become untouchable you’re unable to
 touch\n\nIs there a real me? Pop the champagne\nIt hurts me just to think and I don’t do pain\n\nCHORUS \n\n\nStayin still, Eyes closed\nLet the world just pass me by\n\nPain pills, Nice clot
hes\nIf I fall I think I’ll fly\n\nTouch me, Midas\nMake me part of your design\n\nNone to guide us\nI feel fear for the very last time\n\nCHORUS 2\n\nLay still, Restless\nLosing sleep while I
 lose my mind\n\nAll thrill, No stress\nAll my muses left behind\n\nWorld is, below\nSo high up, I’m near divine\n\nLean in, Let go\nI feel fear for the very last time",
  "duration": 245000,
  "duration_formatted": "4:05",
  "uploadedAt": "Nov 23, 2017",
  "unlisted": false,
  "nsfw": false,
  "thumbnail": {
    "id": "9Zj0JOHJR-s",
    "width": 1920,
    "height": 1080,
    "url": "https://i.ytimg.com/vi_webp/9Zj0JOHJR-s/maxresdefault.webp"
  },
  "channel": {
    "name": "The Living Tombstone",
    "id": "UCFYMDSW-BzeYZKFSxROw3Rg",
    "icon": "https://yt3.ggpht.com/ytc/AIdro_nenUrGjDKt9CONHX-RAJoULoOAEL0QWTiXSVcvMk9MRMw=s0-c-k-c0x00ffffff-no-rj"
  },
  "views": 294164022,
  "type": "video",
  "tags": [
    "the living tombstone",
    "livingtombstone",
    "tlt",
    "thelivingtombstone",
    "Nichijou Song",
    "My Ordinary Life Song",
    "Nichijou",
    "The Living Tombstone Original Song",
    "Staying still eyes closed",
    "My Ordinary Life",
    "My Ordinary Life Original",
    "Nichijou Inspired",
    "Original Music Video",
    "My Ordinary Life Original Music Video",
    "playstation opening parody"
  ],
  "ratings": {
    "likes": 0,
    "dislikes": 0
  },
  "shorts": false,
  "live": false,
  "private": false,
  "music": [
    {
      "title": "My Ordinary Life",
      "cover": "https://lh3.googleusercontent.com/OixdLoXIBp4v1HgjDjRyVLAXNAmajxuoAmd06I_XIK2u1tIAHoGoEKxz93gZoF5WxaZ2zqZSWuA4vaVi",
      "artist": "The Living Tombstone",
      "album": "My Ordinary Life"
    }
  ]
}
*/