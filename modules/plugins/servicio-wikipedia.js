import axios from 'axios';
import cheerio from 'cheerio';

const command = {
    command: ['wiki', 'wikipedia'],
    categoria: ['servicio']
};

command.script = async (m, { conn }) => {
    if (!m.args || !m.args[0]) {
        return m.reply('❗️ Ingrese lo que quiere buscar en Wikipedia');
    }

    const query = m.args.join('_');

    try {
        const link = await axios.get(`https://es.wikipedia.org/wiki/${query}`);
        const $ = cheerio.load(link.data);

        const wikTitle = $('#firstHeading').text().trim();
        const wikContent = $('#mw-content-text > div.mw-parser-output').find('p').text().trim();

        if (!wikContent) {
            return m.reply('❌ No se han encontrado resultados en Wikipedia.');
        }

        const response = `🔎 *Buscado:* ${wikTitle}\n\n${wikContent}`;

        await m.reply(response);
    } catch (error) {
        console.error(error);
        m.reply('❌ Ocurrió un error o no se han encontrado resultados.');
    }
};

export default command;