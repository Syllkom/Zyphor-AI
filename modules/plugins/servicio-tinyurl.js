import fetch from 'node-fetch';

const command = {
    command: ['tinyurl', 'short', 'acortar', 'corto'],
    categoria: ['tools']
};

command.script = async (m, { conn }) => {
    try {
        if (!m.args || m.args.length < 1) {
            return m.reply('Por favor, ingresa el enlace que deseas acortar.')
        }

        let url = m.args[0];
        let shortUrl = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`).then(res => res.text());

        if (!shortUrl) {
            return m.reply('No se pudo acortar el enlace. Intenta nuevamente.')
        }

        let responseText = `🔗 *URL Acortada:*\n${shortUrl}`;
        await m.reply(responseText);

        await m.react('✅');
    } catch (error) {
        console.log(error);
        await m.reply('❌ Ocurrió un error al procesar tu solicitud.')
        await m.react('❌');
    }
};

export default command;
