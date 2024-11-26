import PhoneNumber from 'awesome-phonenumber'

const command = {
    command: ['creador', 'owner'],
    categoria: ['main']
}

command.script = async (m, { conn }) => {
    const getName = async (sender) => {
        try {
            const userData = await conn.data.get(sender);
            return userData.getname ? userData.getname : sender.split('@')[0];
        } catch (e) {
            return sender.split('@')[0];
        }
    };

    await sendContactArray(conn, m.chat.id, [
        ['51933479416', `${await getName('51933479416@s.whatsapp.net')}`, '⚡ Creador', null],
        ['51924543252', `${await getName('51924543252@s.whatsapp.net')}`, '🤝 Colaborador', null]
    ], {
        key: { fromMe: false, participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: 'status@broadcast' } : {}) },
        message: { contactMessage: { displayName: 'Syllkom', vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;0,;;;\nFN:0,\nitem1.TEL;waid=51933479416:51933479416\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } }
    });
}

export default command

async function sendContactArray(conn, jid, data, quoted, options) {
    if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data];
    const contacts = data.map(([number, name, isi, isi1]) => {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const vcard = `
BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:${name.replace(/\n/g, '\\n')}
item.ORG:${isi}
item1.TEL;waid=${sanitizedNumber}:${PhoneNumber('+' + sanitizedNumber).getNumber('international')}
item1.X-ABLabel:${isi1}
END:VCARD`.trim();
        return { vcard, displayName: name };
    });

    return await conn.sendMessage(jid, {
        contacts: {
            displayName: contacts.length > 1 ? `${contacts.length} contactos` : contacts[0].displayName,
            contacts,
        }
    }, { quoted, ...options });
}
