const { generateWAMessageFromContent, generateWAMessageContent } = (await import('@whiskeysockets/baileys')).default


const command = {
    command: ['ia', 'ai'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.text) return m.reply(`Y el texto?`)
    try {
        m.react('wait')
        const IA = await conn.getJSON(`https://widipe.com/prompt/gpt?prompt=Responde%20a%20las%20siguientes%20preguntas%20y%20mensajes%20de%20manera%20objetiva.%20Usa%20un%20tono%20sarc%C3%A1stico%20y%20despreocupado%20solo%20en%20ocasiones%20%28tambi%C3%A9n%20responde%20de%20forma%20sat%C3%ADrica%20cuando%20el%20texto%20sea%20demasiado%20absurdo%29%2C%20dependiendo%20de%20qu%C3%A9%20tan%20trivial%20sea%20la%20pregunta%20o%20mensaje.&text=${m.text}`)

        await m.reply(IA.result, '@GPT')
        await m.react('done')

    } catch (e) { console.log(e); m.react('error') }
}


export default command
