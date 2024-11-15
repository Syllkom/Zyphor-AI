const command = {
    command: ['owner', 'creator', 'creador', 'dueño'],
    categoria: ['main']
};

command.script = async (m, { conn }) => {
    let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;Syllkom;;\nFN:Syllkom\nORG:Syllkom\nTITLE:\nitem1.TEL;waid=51933479416:51933479416\nitem1.X-ABLabel:Syllkom\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:Syllkom\nEND:VCARD`;

    await conn.sendMessage(m.chat.id, {
        contacts: { displayName: 'Syllkom', contacts: [{ vcard }] }
    }, { quoted: m });

    await m.react('✅');
};

export default command;
