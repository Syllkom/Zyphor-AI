const command = {
    command: ['setpp', 'setpdesc', 'setpd', 'setpdescription', 'setpsubject', 'setpn', 'setps', 'setpname', 'setpasunto', 'setpa', 'setpphoto', 'setpf', 'setpfoto'],
    categoria: ['grupos']
}

command.script = async (m, { conn }) => {
    const findCmd = (array) => array.find(o => o == m.command)
    if (findCmd(['setpp', 'setpphoto', 'setpf', 'setpfoto'])) {
        const type = m.SMS().message;
        const change = async (type) => {
            await m.react('wait')
            try { await m[type].change.photo(await conn.download(), 'full'), await m.react('done') } catch (e) { try { await m[type].change.photo(await conn.download()), await m.react('done') } catch (e) { await m.react('error'), console.log(e) } }
        }

        if (!type['imageMessage']) {
            await m.react('❗')
            return await m.reply('Por favor, vuelva a enviar el comando junto con una imagen o respondiendo a una.')
        }
        if (m.args[0] == 'group' || m.args[0] == 'grupo' || m.args[0] == 'g') {
            if (!m.sender.admin) return m.sms('admin')
            if (!m.bot.admin) return m.sms('botAdmin')
            await change('chat')
        }
        else if (m.args[0] == 'bot' || m.args[0] == 'Bot' || m.args[0] == 'b') {
            if (!m.IS(['rowner', 'owner'])) return m.sms('owner')
            await change('bot')
        }
        else if (!m.args[0] && m.chat.group) {
            if (!m.sender.admin) return m.sms('admin')
            if (!m.bot.admin) return m.sms('botAdmin')
            await change('chat')
        }
        else if (!m.args[0] && !m.chat.group && m.IS(['rowner', 'owner'])) {
            await change('bot')
        }
        else m.reply('[prefix][command] [object] [quoted]')
    }
    else if (findCmd(['setpdesc', 'setpd', 'setpdescription'])) {
        const change = async (type, text) => {
            await m.react('wait')
            try { await m[type].change.description(text), await m.react('done') } catch (e) { await m.react('error') }
        }

        if (m.args[0] == 'group' || m.args[0] == 'grupo' || m.args[0] == 'g') {
            if (!m.chat.group) return m.sms('group');
            if (!m.sender.admin) return m.sms('admin');
            if (!m.bot.admin) return m.sms('botAdmin');
            const text = m.args[1] ? (m.args.slice(1).join(" ")) : false
            if (!text) return m.reply('[prefix][command] [object] [text] ? undefined: text')
            await change('chat', text)
        }
        else if (m.args[0] == 'bot' || m.args[0] == 'Bot' || m.args[0] == 'g') {
            if (!m.IS(['isROwner', 'isOwner'])) return m.sms('modr');
            const text = m.args[1] ? (m.args.slice(1).join(" ")) : false
            if (!text) return m.reply('[prefix][command] [object] [text] ? undefined: text')
            await change('bot', text)
        }
        else if (!m.args[1] && m.chat.group) {
            if (!m.sender.admin) return m.sms('admin');
            if (!m.bot.admin) return m.sms('botAdmin');
            const text = m.args[0] ? (m.args.join(" ")) : false
            if (!text) return m.reply('[prefix][command] [text] ? undefined: text')
            await change('chat', text)
        }
        else if (!m.args[1] && !m.chat.group && m.IS(['isROwner', 'isOwner'])) {
            if (!m.IS(['isROwner', 'isOwner'])) return m.sms('modr');
            const text = m.args[0] ? (m.args.join(" ")) : false
            if (!text) return m.reply('[prefix][command] [text] ? undefined: text')
            await change('bot', text)
        }
        else m.reply('[prefix][command] [object] [text]')
    }
    else if (findCmd(['setpsubject', 'setpn', 'setps', 'setpname', 'setpasunto', 'setpa'])) {
        const change = async (type, text) => {
            await m.react('wait')
            try { await m[type].change.name(text), await m.react('done') } catch (e) { await m.react('error') }
        }

        if (m.args[0] == 'group' || m.args[0] == 'grupo' || m.args[0] == 'g') {
            if (!m.chat.group) return m.sms('group');
            if (!m.sender.admin) return m.sms('admin');
            if (!m.bot.admin) return m.sms('botAdmin');
            const text = m.args[1] ? (m.args.slice(1).join(" ")) : false
            if (!text) return m.reply('[prefix][command] [object] [text] ? undefined: text')
            await change('chat', text)
        }
        else if (m.args[0] == 'bot' || m.args[0] == 'Bot' || m.args[0] == 'g') {
            if (!m.IS(['isROwner', 'isOwner'])) return m.sms('modr');
            const text = m.args[1] ? (m.args.slice(1).join(" ")) : false
            if (!text) return m.reply('[prefix][command] [object] [text] ? undefined: text')
            await change('bot', text)
        }
        else if (!m.args[1] && m.chat.group) {
            if (!m.sender.admin) return m.sms('admin');
            if (!m.bot.admin) return m.sms('botAdmin');
            const text = m.args[0] ? (m.args.join(" ")) : false
            if (!text) return m.reply('[prefix][command] [text] ? undefined: text')
            await change('chat', text)
        }
        else if (!m.args[1] && !m.chat.group && m.IS(['isROwner', 'isOwner'])) {
            if (!m.IS(['isROwner', 'isOwner'])) return m.sms('modr');
            const text = m.args[0] ? (m.args.join(" ")) : false
            if (!text) return m.reply('[prefix][command] [text] ? undefined: text')
            await change('bot', text)
        }
        else m.reply('[prefix][command] [object] [text]')
    }
}

export default command