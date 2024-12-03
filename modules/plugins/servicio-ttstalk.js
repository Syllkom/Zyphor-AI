import axios from 'axios';
import cheerio from 'cheerio';

const command = {
    command: ['ttstalk'],
    categoria: ['herramienta']
};

command.script = async (m, { conn }) => {
    if (!m.args[0]) return m.reply(`Por favor, ingresa un nombre de usuario.\nEjemplo: /${m.command} foxamv`);

    const tiktokStalk = async (user) => {
        try {
            const res = await axios.get(`https://urlebird.com/user/${user}/`);
            const $ = cheerio.load(res.data);
            return {
                pp_user: $('div[class="col-md-auto justify-content-center text-center"] > img').attr('src'),
                name: $('h1.user').text().trim(),
                username: $('div.content > h5').text().trim(),
                followers: $('div[class="col-7 col-md-auto text-truncate"]').text().trim().split(' ')[1],
                following: $('div[class="col-auto d-none d-sm-block text-truncate"]').text().trim().split(' ')[1],
                description: $('div.content > p').text().trim()
            };
        } catch (error) {
            console.error('Error al hacer scraping:', error);
            throw new Error('No se pudo obtener información del usuario.');
        }
    };

    try {
        await m.react('wait');
        const data = await tiktokStalk(m.args[0]);

        const caption = `╭ ✦ *</Tiktok Stalk>*\n` +
                        `╵👤 Nombre: ${data.name}\n` +
                        `╵📛 Usuario: ${data.username}\n` +
                        `╵👥 Seguidores: \`${data.followers}\`\n` +
                        `╵✅ Siguiendo: \`${data.following}\`\n` +
                        `╰╶╴──────╶╴─╶╴◯\n\n` +
                        `● *Descripción:* ${data.description}`;

        await conn.sendMessage(m.chat.id, {
            image: { url: data.pp_user },
            caption
        }, { quoted: m });

        await m.react('done');
    } catch (error) {
        console.error('Error en ttstalk:', error);
        m.reply('❌ Ocurrió un error al obtener los datos del usuario.');
    }
};

export default command;
