const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = (await import('@whiskeysockets/baileys')).default
import got from 'got'
import FormData from 'form-data'

const secret = new TextEncoder()
const sendTmp = async (file) => {
    try {
        const form = new FormData()
        file = Buffer.isBuffer(file) ? file : (await got(file, { responseType: 'buffer' })).body
        form.append('file', file, { filename: 'image.jpg' })
        const tmp = await got.post('https://tmpfiles.org/api/v1/upload', { body: form, headers: { ...form.getHeaders() } })
        return (JSON.parse(tmp.body).data.url).replace('tmpfiles.org/', 'tmpfiles.org/dl/')
    } catch (e) {
        conn.logger.error(e)
    }
}

const command = {
    command: ['test740'],
    categoria: ['main']
}

command.script = async (m, { conn }) => {
    const image = await conn.resizePhoto({ image: await m.chat.photo(), scale: 360, result: 'base64' })
    const imagechat = await m.chat.photo()

    await conn.sendWAMContent(m.chat.id, {
        botInvokeMessage: {
            message: {
                conversation: 'Hola',
                contextInfo: {
                    conversionSource: '.ytmp4 tag=[0]'
                }
            }
        }
    })

    const message = await conn.sendMessage(m.chat.id, {
        document: Buffer.alloc(5),
        fileName: 'archivo.mp4',
        mimetype: 'video/mp4', //'application/pdf',
        messageContextInfo: {
            botMessageSecret: secret.encode('.ytmp4 tag=[0]')
        },
        contextInfo: {
            mentionedJid: [m.sender.id, '.ytmp4 tag=[0]'],
        }
    })

    console.log(JSON.stringify(message, 0, 2))

    const Message = {
        "header": {
            "hasMediaAttachment": true,
        },
        "nativeFlowMessage": {
            "buttons": [
                {
                    "name": "review_and_pay",
                    "buttonParamsJson": `{\"currency\":\"INR\",\"total_amount\":{\"value\":49981399788,\"offset\":100},\"reference_id\":\"4OON4PX3FFJ\",\"type\":\"physical-goods\",\"order\":{\"status\":\"payment_requested\",\"subtotal\":{\"value\":49069994400,\"offset\":100},\"tax\":{\"value\":490699944,\"offset\":100},\"discount\":{\"value\":485792999999,\"offset\":100},\"shipping\":{\"value\":48999999900,\"offset\":100},\"order_type\":\"ORDER\",\"items\":[{\"retailer_id\":\"7842674605763435\",\"product_id\":\"7842674605763435\",\"name\":\"🦄드림 가이 Xeon 🦄드림 가이 Xeon 🦄드림 가이 Xeon\",\"amount\":{\"value\":9999900,\"offset\":100},\"quantity\":7},{\"retailer_id\":\"custom-item-f22115f9-478a-487e-92c1-8e7b4bf16de8\",\"name\":\"\",\"amount\":{\"value\":999999900,\"offset\":100},\"quantity\":49}]},\"native_payment_methods\":[]}`
                }
            ]
        }
    }

    const getMessage = await generateWAMessageFromContent(m.chat.id, { viewOnceMessage: { message: { interactiveMessage: Message } } }, {})


    const message2 = {
        "templateMessage": {
            "hydratedFourRowTemplate": {
                "videoMessage": {
                    "mimetype": "video/mp4",
                    "fileSha256": "X9IouQ+ukj7uo8UISqYe83OXJeU4z7N9J2wJD6PA9pM=",
                    "fileLength": "1365602",
                    "seconds": 15,
                    "mediaKey": "euhKvqmzihjhNIDNtXzAT0bjyVgUg8oyppZynA9qnKY=",
                    "caption": "*Busca chats como un profesional*\nPrueba estas herramientas para organizar y buscar tus chats:\n\n1. Toca un filtro en la parte superior de la pestaña Chats para encontrar rápidamente conversaciones no leídas, grupales o favoritas.\n2. Fija hasta tres chats en la parte superior de la pestaña Chats para poder encontrarlos rápidamente. Tan solo mantén presionado un chat y selecciona 📌.\n3. Busca chats por nombre de grupo, contenido o participantes.",
                    "height": 1080,
                    "width": 1080,
                    "fileEncSha256": "68YihPSJ3ap7SMOmhjEhAMqxQE99n7qexsW0RXz0YyI=",
                    "staticUrl": "https://static.whatsapp.net/downloadable?category=PSA&id=635981193564247722&num=88d44b02-3faf-4ae4-bf6f-f1727b8844e7&_nc_cat=1"
                },
                "hydratedContentText": "*Busca chats como un profesional*\nPrueba estas herramientas para organizar y buscar tus chats:\n\n1. Toca un filtro en la parte superior de la pestaña Chats para encontrar rápidamente conversaciones no leídas, grupales o favoritas.\n2. Fija hasta tres chats en la parte superior de la pestaña Chats para poder encontrarlos rápidamente. Tan solo mantén presionado un chat y selecciona 📌.\n3. Busca chats por nombre de grupo, contenido o participantes.",
                "hydratedButtons": [
                    {
                        "urlButton": {
                            "displayText": "Más información",
                            "url": "https://faq.whatsapp.com/1131773267485499"
                        },
                        "index": 0
                    }
                ]
            },
            "hydratedTemplate": {
                "videoMessage": {
                    "mimetype": "video/mp4",
                    "fileSha256": "X9IouQ+ukj7uo8UISqYe83OXJeU4z7N9J2wJD6PA9pM=",
                    "fileLength": "1365602",
                    "seconds": 15,
                    "mediaKey": "euhKvqmzihjhNIDNtXzAT0bjyVgUg8oyppZynA9qnKY=",
                    "caption": "*Busca chats como un profesional*\nPrueba estas herramientas para organizar y buscar tus chats:\n\n1. Toca un filtro en la parte superior de la pestaña Chats para encontrar rápidamente conversaciones no leídas, grupales o favoritas.\n2. Fija hasta tres chats en la parte superior de la pestaña Chats para poder encontrarlos rápidamente. Tan solo mantén presionado un chat y selecciona 📌.\n3. Busca chats por nombre de grupo, contenido o participantes.",
                    "height": 1080,
                    "width": 1080,
                    "fileEncSha256": "68YihPSJ3ap7SMOmhjEhAMqxQE99n7qexsW0RXz0YyI=",
                    "staticUrl": "https://static.whatsapp.net/downloadable?category=PSA&id=635981193564247722&num=88d44b02-3faf-4ae4-bf6f-f1727b8844e7&_nc_cat=1"
                },
                "hydratedContentText": "*Busca chats como un profesional*\nPrueba estas herramientas para organizar y buscar tus chats:\n\n1. Toca un filtro en la parte superior de la pestaña Chats para encontrar rápidamente conversaciones no leídas, grupales o favoritas.\n2. Fija hasta tres chats en la parte superior de la pestaña Chats para poder encontrarlos rápidamente. Tan solo mantén presionado un chat y selecciona 📌.\n3. Busca chats por nombre de grupo, contenido o participantes.",
                "hydratedButtons": [
                    {
                        "urlButton": {
                            "displayText": "Más información",
                            "url": "https://faq.whatsapp.com/1131773267485499"
                        },
                        "index": 0
                    }
                ]
            }
        }
    }

    const getMessage2 = await generateWAMessageFromContent(m.chat.id, { viewOnceMessage: { message: message2 } }, {})

    await conn.relayMessage(m.chat.id, getMessage2.message, {});


    const message3 = {
        paymentInviteMessage: {
            serviceType: 1,
            expiryTimestamp: 86400
        }
    }

    await conn.relayMessage(m.chat.id, (await generateWAMessageFromContent(m.chat.id, { viewOnceMessage: { message: message3 } }, {})).message, {})

    const message4 = {
        requestPhoneNumberMessage: {
            contextInfo: {
                mentionedJid: [m.sender.id],
                externalAdReply: {
                    title: m.chat.name,
                    body: global.botName,
                    thumbnailUrl: imagechat,
                    previewType: 0,
                    sourceUrl: '',
                    mediaType: 1,
                }
            }
        }
    }

    await conn.relayMessage(m.chat.id, message4, {})

    const message5 = {
        botInvokeMessage: {
            message: {
                viewOnceMessage: {
                    "templateMessage": {
                        "hydratedFourRowTemplate": {
                            "videoMessage": {
                                "mimetype": "video/mp4",
                                "fileSha256": "X9IouQ+ukj7uo8UISqYe83OXJeU4z7N9J2wJD6PA9pM=",
                                "fileLength": "1365602",
                                "seconds": 15,
                                "mediaKey": "euhKvqmzihjhNIDNtXzAT0bjyVgUg8oyppZynA9qnKY=",
                                "caption": "*Busca chats como un profesional*\nPrueba estas herramientas para organizar y buscar tus chats:\n\n1. Toca un filtro en la parte superior de la pestaña Chats para encontrar rápidamente conversaciones no leídas, grupales o favoritas.\n2. Fija hasta tres chats en la parte superior de la pestaña Chats para poder encontrarlos rápidamente. Tan solo mantén presionado un chat y selecciona 📌.\n3. Busca chats por nombre de grupo, contenido o participantes.",
                                "height": 1080,
                                "width": 1080,
                                "fileEncSha256": "68YihPSJ3ap7SMOmhjEhAMqxQE99n7qexsW0RXz0YyI=",
                                "staticUrl": "https://static.whatsapp.net/downloadable?category=PSA&id=635981193564247722&num=88d44b02-3faf-4ae4-bf6f-f1727b8844e7&_nc_cat=1"
                            },
                            "hydratedContentText": "*Busca chats como un profesional*\nPrueba estas herramientas para organizar y buscar tus chats:\n\n1. Toca un filtro en la parte superior de la pestaña Chats para encontrar rápidamente conversaciones no leídas, grupales o favoritas.\n2. Fija hasta tres chats en la parte superior de la pestaña Chats para poder encontrarlos rápidamente. Tan solo mantén presionado un chat y selecciona 📌.\n3. Busca chats por nombre de grupo, contenido o participantes.",
                            "hydratedButtons": [
                                {
                                    "urlButton": {
                                        "displayText": "Más información",
                                        "url": "https://faq.whatsapp.com/1131773267485499"
                                    },
                                    "index": 0
                                }
                            ]
                        },
                        "hydratedTemplate": {
                            "videoMessage": {
                                "mimetype": "video/mp4",
                                "fileSha256": "X9IouQ+ukj7uo8UISqYe83OXJeU4z7N9J2wJD6PA9pM=",
                                "fileLength": "1365602",
                                "seconds": 15,
                                "mediaKey": "euhKvqmzihjhNIDNtXzAT0bjyVgUg8oyppZynA9qnKY=",
                                "caption": "*Busca chats como un profesional*\nPrueba estas herramientas para organizar y buscar tus chats:\n\n1. Toca un filtro en la parte superior de la pestaña Chats para encontrar rápidamente conversaciones no leídas, grupales o favoritas.\n2. Fija hasta tres chats en la parte superior de la pestaña Chats para poder encontrarlos rápidamente. Tan solo mantén presionado un chat y selecciona 📌.\n3. Busca chats por nombre de grupo, contenido o participantes.",
                                "height": 1080,
                                "width": 1080,
                                "fileEncSha256": "68YihPSJ3ap7SMOmhjEhAMqxQE99n7qexsW0RXz0YyI=",
                                "staticUrl": "https://static.whatsapp.net/downloadable?category=PSA&id=635981193564247722&num=88d44b02-3faf-4ae4-bf6f-f1727b8844e7&_nc_cat=1"
                            },
                            "hydratedContentText": "*Busca chats como un profesional*\nPrueba estas herramientas para organizar y buscar tus chats:\n\n1. Toca un filtro en la parte superior de la pestaña Chats para encontrar rápidamente conversaciones no leídas, grupales o favoritas.\n2. Fija hasta tres chats en la parte superior de la pestaña Chats para poder encontrarlos rápidamente. Tan solo mantén presionado un chat y selecciona 📌.\n3. Busca chats por nombre de grupo, contenido o participantes.",
                            "hydratedButtons": [
                                {
                                    "urlButton": {
                                        "displayText": "Más información",
                                        "url": "https://faq.whatsapp.com/1131773267485499"
                                    },
                                    "index": 0
                                }
                            ]
                        }
                    }
                }
            }
        }
    }

    await conn.relayMessage(m.chat.id, (await generateWAMessageFromContent(m.chat.id, message5, {})).message, {})

    await conn.sendWAMContent(m.chat.id, {
        groupMentionedMessage: {
            message: {
                conversation: 'hola'
            }
        }
    })

    await conn.sendWAMContent(m.chat.id, {
        groupInviteMessage: {
            groupJid: m.chat.id,
            inviteCode: await m.chat.InviteCode(),
            inviteExpiration: Date.now() + (1000 * 60 * 60 * 5),
            groupName: m.chat.name,
            jpegThumbnail: await conn.resizePhoto({ image: await m.chat.photo(), scale: 124, result: 'buffer' }),
            caption: 'a',
            groupType: 1,
        }
    })

    await conn.sendMessage(m.chat.id, { text: 'd' }, {
        quoted: {
            "key": {
                "participants": "0@s.whatsapp.net",
                "remoteJid": "status@broadcast",
                "fromMe": false,
                "id": "Halo"
            },
            "message": {
                "groupInviteMessage": {
                    "groupJid": m.chat.id,
                    "groupName": "hola",
                    "jpegThumbnail": await conn.resizePhoto({ image: await m.chat.photo(), scale: 124, result: 'base64' }),
                    "caption": "a"
                },
                "participant": "0@s.whatsapp.net"
            }
        }
    })

    const imageSender = await sendTmp(await m.sender.photo())

    /*const { body } = await got(`https://widipe.com/welcome2?name=${m.pushName}&gcname=Zyphor-Bot&member=350&pp=${imageSender}&bg=https%3A%2F%2Fwp.youtube-anime.com%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fmedia%2Fmanga%2Fbanner%2F99472-r0vPFL45SK0N.jpg`, { responseType: 'buffer' })

    /*await conn.sendMsg(m.chat.id, { image: body }, {
        title: 'Bienvenido @' + m.sender.number + '!',
        footer: 'Simple.Bot',
        buttons: [
            {
                name: 'quick_reply',
                buttonParamsJson: {
                    display_text: 'Welcome',
                    id: ''
                }
            }
        ],
    }, m, {
        mentionedJid: [m.sender.id],
        externalAdReply: {
            title: m.chat.name,
            body: global.botName,
            thumbnailUrl: imagechat,
            containsAutoReply: true,
            sourceUrl: '',
            mediaType: 1,
            renderLargerThumbnail: false,
            previewType: 0,

        }
    })*/

}

export default command


const nes = [
    {
        "messages": [
            {
                "key": {
                    "remoteJid": "13135550002@s.whatsapp.net",
                    "fromMe": false,
                    "id": "D409DC7F4096992C1F"
                },
                "message": {
                    "messageContextInfo": {
                        "messageSecret": "x5qyw0j3RPv/0F0gVFcwiIjLewEslZB1f+GFXln4T8g="
                    },
                    "editedMessage": {
                        "message": {
                            "protocolMessage": {
                                "key": {
                                    "remoteJid": "13135550002@s.whatsapp.net",
                                    "fromMe": false,
                                    "id": "FFA5FE7DFCCFA9910E"
                                },
                                "type": "MESSAGE_EDIT",
                                "editedMessage": {
                                    "conversation": "La pseudociencia se refiere a afirmaciones, teorías o prácticas que pretenden ser científicas, pero no cumplen con los estándares y métodos rigurosos de la investigación científica. A menudo, carecen de evidencia empírica o violan principios fundamentales de la lógica y la razón.\n\nAlgunas características comunes de la pseudociencia incluyen:\n\n- Afirmaciones no verificables o no falsables\n- Falta de evidencia empírica o basada en anécdot"
                                },
                                "timestampMs": "1730599764201"
                            }
                        }
                    }
                },
                "messageTimestamp": "1730599761",
                "messageSecret": "x5qyw0j3RPv/0F0gVFcwiIjLewEslZB1f+GFXln4T8g="
            }
        ],
        "type": "notify",
        "requestId": "3EB0E3F80D71533066FA3C"
    },
    {
        "messages": [
            {
                "key": {
                    "remoteJid": "13135550002@s.whatsapp.net",
                    "fromMe": false,
                    "id": "D1BA745F87CCCC3309"
                },
                "message": {
                    "messageContextInfo": { "messageSecret": "x5qyw0j3RPv/0F0gVFcwiIjLewEslZB1f+GFXln4T8g=" },
                    "editedMessage": {
                        "message": {
                            "protocolMessage": {
                                "key": {
                                    "remoteJid": "13135550002@s.whatsapp.net",
                                    "fromMe": false,
                                    "id": "FFA5FE7DFCCFA9910E"
                                },
                                "type": "MESSAGE_EDIT",
                                "editedMessage": {
                                    "conversation": "La pseudociencia se refiere a afirmaciones, teorías o prácticas que pretenden ser científicas, pero no cumplen con los estándares y métodos rigurosos de la investigación científica. A menudo, carecen de evidencia empírica o violan principios fundamentales de la lógica y la razón.\n\nAlgunas características comunes de la pseudociencia incluyen:\n\n- Afirmaciones no verificables o no falsables\n- Falta de evidencia empírica o basada en anécdotas\n- Uso de jargon científico sin sentido\n- Rechazo de la evidencia científica establecida\n- Apelaciones a la emocionalidad en lugar de la razón\n\nEjemplos de pseudociencias incluyen:\n\n- Astrología\n- Homeopatía\n- Feng shui\n- Ciencias de la Nueva Era (como la reencarnación o la telepatía)\n- Teorías de la conspiración sin fundamento\n\nEs importante distinguir entre pseudociencia y teorías científicas legítimas que aún están en investigación o debate. La ciencia verdadera se basa en el método científico, la evidencia empírica y la revisión por pares."
                                },
                                "timestampMs": "1730599767082"
                            }
                        }
                    }
                },
                "messageTimestamp": "1730599761",
                "messageSecret": "x5qyw0j3RPv/0F0gVFcwiIjLewEslZB1f+GFXln4T8g="
            }
        ],
        "type": "notify",
        "requestId": "3EB03613F003C4B0A48538"
    }
]