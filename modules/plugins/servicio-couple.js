import { generateWAMessageFromContent, generateWAMessageContent } from '@whiskeysockets/baileys'
import fs from 'fs'
import path from 'path'

const command = {
    command: ['couple', 'pareja', 'wallpapers'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    m.react('wait');
    try {
        const animeDB = JSON.parse(fs.readFileSync(path.resolve('./imagenes/animes/coupleDB.json')));
        const selectedCouple = animeDB[Math.floor(Math.random() * animeDB.length)];
        const masculino = selectedCouple.masculino;
        const femenino = selectedCouple.femenino;

        const cards = [
            { body: { text: 'Masculino' }, header: { title: 'Imagen Masculina', hasMediaAttachment: true, imageMessage: (await generateWAMessageContent({ image: { url: masculino } }, { upload: conn.waUploadToServer })).imageMessage }, nativeFlowMessage: { buttons: [{ name: "single_select", buttonParamsJson: JSON.stringify({ title: "@ZyphorAI" }) }] } }, { body: { text: 'Femenino' }, header: { title: 'Imagen Femenina', hasMediaAttachment: true, imageMessage: (await generateWAMessageContent({ image: { url: femenino } }, { upload: conn.waUploadToServer })).imageMessage }, nativeFlowMessage: { buttons: [{ name: "single_select", buttonParamsJson: JSON.stringify({ title: "@ZyphorAI" }) }] }
            }
        ];

        const message = await generateWAMessageFromContent(m.chat.id, {  viewOnceMessage: {  message: {  interactiveMessage: {  body: { text: '¡Comparte perfil entre pareja!!!' }, footer: { text: 'Powered by @Syllkom' }, header: { hasMediaAttachment: false }, carouselMessage: { cards: cards } } } } }, { timestamp: new Date(), quoted: m });
        
        await conn.relayMessage(m.chat.id, message.message, {});
        m.react('done');

    } catch (e) {
        console.error(e);
        m.react('error');
        m.reply('❌ Ocurrió un error al generar el carrusel de imágenes.');
    }
}

export default command