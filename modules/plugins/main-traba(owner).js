const command = {
    command: ['_kom', '_374'],
    categoria: ['main']
};

command.script = async (m, { conn }) => {
const message7 = {
        interactiveMessage: {
            body: { text: 'Traba WhatsApp' },
            header: {
                //title: 'test',
                hasMediaAttachment: false
            },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: "galaxy_message",
                        buttonParamsJson: JSON.stringify({
                            mode: "published",
                            flow_message_version: 3,
                            flow_token: "232909,179339",
                            flow_id: "409674138644027",
                            flow_cta: "CONTINUAR",
                            flow_action: "navigate",
                            flow_action_payload: {
                                screen: "ORIGIN_INPUT",
                                data: {
                                    init_values: {
                                        dummy: "dummy"
                                    },
                                    error_messages: {
                                        dummy: "dummy"
                                    },
                                    origin_label: "🚏 LOCAL DE ORIGEM?",
                                    origin_helper: "Ex: Brasília, São Paulo...",
                                    finish_label: "Pesquisar"
                                }
                            }
                        })
                    }
                ],
                messageParamsJson: ''
            }
        }
    }

    await conn.relayMessage(m.chat.id, { viewOnceMessage: { message: message7 } }, {})
}
    
export default command