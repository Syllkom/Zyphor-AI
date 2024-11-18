import { generateWAMessageFromContent, generateWAMessageContent } from '@whiskeysockets/baileys'

const command = { 
    command: ['tiktok', 'tt'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.text) return m.reply(`Ingrese el comando *\`.${m.command}\`* y seguido un enlace de *Tiktok*`);
    m.react('wait');

    try {
        const TkTk = await conn.getJSON(`https://www.tikwm.com/api/?url=${m.args[0]}?hd=1`);
        const TikTok = TkTk.data;

        if (m.tag[0] == 'audio') {
            if (TikTok.music) {
                await conn.sendMessage(m.chat.id, { audio: { url: TikTok.music }, mimetype: 'audio/mpeg' }, { quoted: m });
                m.react('done');
            } else return m.reply('Este video/imagen no tiene ningun audio.');
        } else {
            if (TikTok.images) {
                const url = TikTok.images, Texto = `- *Titulo:* ${TikTok.title}\n- *Usuario:* ${TikTok.author.nickname}\n- *Reproducciones:* \`${TikTok.play_count}\`\n- *Comentarios:* \`${TikTok.comment_count}\`\n- *Descargas:* \`${TikTok.download_count}\`\n- *Imagenes:* \`${url.length}\``;
                const cards = await Promise.all(url.map(async (imgUrl, i) => ({
                    body: { text: `Imagen ${i + 1}` },
                    header: { title: TikTok.title, hasMediaAttachment: true, imageMessage: (await generateWAMessageContent({ image: { url: imgUrl } }, { upload: conn.waUploadToServer })).imageMessage },
                    nativeFlowMessage: { buttons: [{ name: "single_select", buttonParamsJson: JSON.stringify({ title: "@ZyphorAI", sections: [] }) }] }
                })));
                
                if (cards.length > 0) {
                    const message = await generateWAMessageFromContent(m.chat.id, { viewOnceMessage: { message: { interactiveMessage: { body: { text: `\`${url.length}\` imágenes.` }, footer: { text: '@ZyphorAI' }, header: { hasMediaAttachment: false }, carouselMessage: { cards: cards } } } } }, { timestamp: new Date(), quoted: m });
                    await conn.relayMessage(m.chat.id, message.message, {});
                }

                const response = { audio: { command: `.${m.command} ${m.args[0]} tag=audio` }, mp3: { command: `.${m.command} ${m.args[0]} tag=audio` } };
                conn.saveMessageIdForResponse(await conn.sendMessage(m.chat.id, { text: `\n- Responda enviando un mensaje diciendo *audio*, para enviar el audio. :)\n${readMore}\n` + Texto }, { quoted: m }), { user: 'all', response });
            } else {
                const Texto = `- *Titulo:* ${TikTok.title}\n- *Usuario:* ${TikTok.author.nickname}\n- *Reproducciones:* \`${TikTok.play_count}\`\n- *Comentarios:* \`${TikTok.comment_count}\`\n- *Descargas:* \`${TikTok.download_count}\``;
                const response = { audio: { command: `.${m.command} ${m.args[0]} tag=audio` }, mp3: { command: `.${m.command} ${m.args[0]} tag=audio` } };
                conn.saveMessageIdForResponse(await conn.sendMessage(m.chat.id, { video: { url: TikTok.play }, caption: `\n- Responda enviando un mensaje diciendo *audio*, para enviar el audio. :)\n${readMore}\n` + Texto }, { quoted: m }), { user: 'all', response });
            }
        }
    } catch (e) {
        console.log(e);
        m.react('error');
    }
};

export default command;
