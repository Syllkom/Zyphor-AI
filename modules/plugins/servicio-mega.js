import { File } from 'megajs'
import { fileTypeFromBuffer } from 'file-type'

const command = {
    command: ['megadl', 'mega'],
    categoria: ['descargas']
}

command.script = async (m, { conn }) => {
  if (!m.args[0]) return m.reply(`Uso: ${m.command} <enlace de Mega>\nEjemplo: ${m.command} https://mega.nz/file/...`);
  const sessionKey = `mega_${m.sender}`; 
  if (conn.sessions?.[sessionKey]);
  conn.sessions = { ...conn.sessions, [sessionKey]: true };
  await m.react('wait');
  try {
    const file = File.fromURL(m.args[0]), loadedFile = await file.loadAttributes(), data = await file.downloadBuffer(), mimeType = await fileTypeFromBuffer(data);
    await conn.sendMessage(m.chat.id, { document: data, fileName: loadedFile.name, mimetype: mimeType?.mime || 'application/octet-stream' }, { quoted: m });
    await m.react('done');
  } catch (e) {
    console.error('Error en la descarga:', e); 
    m.reply('Error al descargar el archivo. Inténtalo más tarde.');
  } finally {
    delete conn.sessions[sessionKey];
  }
}

export default command
