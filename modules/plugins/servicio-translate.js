import fetch from "node-fetch";

const command = {
    command: ['translate', 'traducir', 'trad', 'tr'],
    categoria: ['tools']
};

command.script = async (m, { conn }) => {
    let lang, text;
    
    if (m.args.length >= 2) {
        lang = m.args[0] ? m.args[0] : "id";
        text = m.args.slice(1).join(" ");
    } else if (m.quoted && m.quoted.text) {
        lang = m.args[0] ? m.args[0] : "id";
        text = m.quoted.text;
    } else {
        return conn.sendMessage(m.chat.id, { text: `*Ejemplo: ${global.prefix + m.command} es Hello World*` });
    }

    try {
        const prompt = encodeURIComponent(text);
        let res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${prompt}`);
        let result = await res.json();
        
        let lister = Object.keys(await langList());
        if (!lister.includes(lang)) {
            return conn.sendMessage(m.chat.id, { text: `El idioma *${lang}* no es válido. Consulta la lista de idiomas admitidos: https://cloud.google.com/translate/docs/languages` });
        }
        
        await m.react('🕓');

        let caption = `${result[0][0][0]}`;
        await conn.sendMessage(m.chat.id, { text: caption });

        await m.react('✅');
    } catch (e) {
        console.log(e);
        await m.react('❌');
    }
};

export default command;

async function langList() {
    let data = await fetch("https://translate.google.com/translate_a/l?client=webapp&sl=auto&tl=en&v=1.0&hl=en&pv=1&tk=&source=bh&ssel=0&tsel=0&kc=1&tk=626515.626515&q=")
        .then((response) => response.json());
    return data.tl;
}
