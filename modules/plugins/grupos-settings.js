const command = {
    command: ['settings', 'editsttgs'],
    categoria: ['grupos']
}

command.script = async (m, { conn }) => {
    const chatdata = await conn.data['@chats'][m.chat.id]
    const { detect, antiLink, antiOnce, antiDelete } = chatdata.settings

    if (!m.args[0]) {
        let response = '*[ SETTINGS DEL GRUPO ]*\n\n';
        response += `- Detect: ${detect.detect ? 'Activo' : 'Inactivo'}\n`;
        response += `- AntiLink: ${antiLink.antiLink ? 'Activo' : 'Inactivo'}\n`;
        response += `- AntiOnce: ${antiOnce.antiOnce ? 'Activo' : 'Inactivo'}\n`;
        response += `- AntiDelete: ${antiDelete.antiDelete ? 'Activo' : 'Inactivo'}\n\n`;
        response += 'Escribe el comando seguido de la opción que deseas modificar:\n';
        response += '`/settings detect on` o `/settings antilink off`';
        return m.reply(response);
    }

    const setting = m.args[0].toLowerCase()
    const action = m.args[1]?.toLowerCase()

    if (!['detect', 'antilink', 'antionce', 'antidelete'].includes(setting)) {
        return m.reply('Configuración no válida. Opciones: detect, antilink, antionce, antidelete.')
    }

    if (!['on', 'off'].includes(action)) {
        return m.reply('Acción no válida. Usa `on` para activar o `off` para desactivar.')
    }

    const isEnabled = action === 'on'

    if (setting === 'detect') {
        if (!m.chat.group) return m.sms('group');
        if (!m.sender.admin) return m.sms('admin');
        if (!m.bot.admin) return m.sms('botAdmin');
        chatdata.settings.detect.detect = isEnabled;
    } else if (setting === 'antilink') {
        if (!m.chat.group) return m.sms('group');
        if (!m.sender.admin) return m.sms('admin');
        if (!m.bot.admin) return m.sms('botAdmin');
        chatdata.settings.antiLink.antiLink = isEnabled;
    } else if (setting === 'antionce') {
        if (!m.chat.group) return m.sms('group');
        if (!m.sender.admin) return m.sms('admin');
        if (!m.bot.admin) return m.sms('botAdmin');
        chatdata.settings.antiOnce.antiOnce = isEnabled;
    } else if (setting === 'antidelete') {
        if (!m.chat.group) return m.sms('group');
        if (!m.sender.admin) return m.sms('admin');
        if (!m.bot.admin) return m.sms('botAdmin');
        chatdata.settings.antiDelete.antiDelete = isEnabled;
    }

    try {
        await conn.db.write()
        m.react('done')
        m.reply(`✅ Configuración actualizada: ${setting} está ahora ${isEnabled ? 'activado' : 'desactivado'}.`)
    } catch (e) {
        console.error(e)
        m.react('error')
        m.reply('❌ Hubo un error al actualizar la configuración.')
    }
}

export default command
