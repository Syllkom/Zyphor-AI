import axios from 'axios'

const command = {
    command: ['gpt4'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.args[0]) return m.reply('Hola, ¿En qué puedo ayudarte?');

    const openai = async (text, logic) => {
        try {
            const response = await axios.post("https://chateverywhere.app/api/chat/", {
                model: { id: "gpt-4", name: "GPT-4", maxLength: 32000, tokenLimit: 8000, completionTokenLimit: 5000, deploymentName: "gpt-4" },
                messages: [{ pluginId: null, content: text, role: "user" }],
                prompt: logic, temperature: 0.5
            }, { headers: { "Accept": "/*/", "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36" } });
            return response.data;
        } catch (error) {
            console.error('Error en la petición a OpenAI:', error);
            throw new Error('Hubo un problema al procesar la solicitud.');
        }
    };

    try {
        const response = await openai(m.args.join(' '), `tu nombre es ZyphorAI, eres un asistente de inteligencia artificial que ayuda a las personas con sus preguntas`);
        m.reply(response);
    } catch (error) {
        m.reply('Hubo un error al intentar procesar tu solicitud.');
    }
}

export default command
