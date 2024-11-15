import axios from 'axios';
const {
  proto,
  generateWAMessageFromContent,
  generateWAMessageContent
} = (await import("@whiskeysockets/baileys")).default;

const command = {
    command: ['tiktoksearch', 'tts', 'tiktoks'],
    categoria: ['search']
};

command.script = async (m, { conn, args }) => {
    const text = m.args.join(' ').trim();

    console.log("Término de búsqueda:", text);

    if (!text) {
        return conn.sendMessage(m.chat.id, { text: 'Proporciona el título de su búsqueda de Tiktok.' });
    }

    async function createVideoMessage(url) {
        const { videoMessage } = await generateWAMessageContent({
            video: { url }
        }, {
            upload: conn.waUploadToServer
        });
        return videoMessage;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    try {
        await m.react('🕑');

        let results = [];
        let { data } = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(text)}`);
        let searchResults = data.data;
        shuffleArray(searchResults);
        let topResults = searchResults.splice(0, 7);

        for (let result of topResults) {
            results.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: TextBot }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: result.title,
                    hasMediaAttachment: true,
                    videoMessage: await createVideoMessage(result.nowm)
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
            });
        }

        const messageContent = generateWAMessageFromContent(m.chat.id, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `🔎 Resultados de: ${text}`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: BotName
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            hasMediaAttachment: false
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: [...results]
                        })
                    })
                }
            }
        }, {
            quoted: m
        });
        
        await m.react('✅');

        await conn.relayMessage(m.chat.id, messageContent.message, {
            messageId: messageContent.key.id
        });
    } catch (error) {
        console.error(error);
        await conn.sendMessage(m.chat.id, { text: `❌️ Ocurrió un error: ${error.message}` });
    }
};

export default command;
