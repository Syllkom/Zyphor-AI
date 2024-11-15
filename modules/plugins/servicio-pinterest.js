import axios from 'axios'
const { generateWAMessageFromContent, generateWAMessageContent } = (await import('@whiskeysockets/baileys')).default

const command = {
    command: ['pin', 'pinterest'],
    categoria: ['servicio']
};

command.script = async (m, { conn }) => {
    if (!m.text) return m.reply('y el texto?');
    m.react('wait')
    try {
        const { data } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${m.text}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${m.text}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`);
        const res = data.resource_response.data.results.map(v => v.images.orig.url);
        const shuffledRes = (res.sort(() => Math.random() - 0.20)).slice(0, 20);

        const push = await Promise.all(shuffledRes.map(async (url, i) => ({ body: { text: '' }, header: { title: '', hasMediaAttachment: true, imageMessage: (await generateWAMessageContent({ image: { url } }, { upload: conn.waUploadToServer })).imageMessage }, nativeFlowMessage: { buttons: [{ name: "single_select", buttonParamsJson: JSON.stringify({ title: BotName, sections: [] }) }] } })));

        const msg = await generateWAMessageFromContent(m.chat.id, { viewOnceMessage: { message: { interactiveMessage: { body: { text: 'Hecho.' }, footer: { text: TextBot }, header: { hasMediaAttachment: false }, carouselMessage: { cards: push } } } } }, { timestamp: new Date() })

        await conn.relayMessage(m.chat.id, msg.message, { messageId: msg.key.id });
    } catch (e) {
        m.react(error)
    }
};

export default command;