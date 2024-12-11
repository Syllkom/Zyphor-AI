const command = {
  command: ['apk', 'apkdl', 'aptoide'],
  categoria: ['servicio'],
}

command.script = async (m, { conn }) => {
  if (!m.args[0]) {
    return m.reply(`Ingrese el nombre de la aplicación que desea descargar.*\nEjemplo:\n/${m.command} WhatsApp`)
  }

  const { search, download } = await import('aptoide-scraper')
  try {
    await m.react('wait')
    const searchResults = await search(m.args[0])
    if (!searchResults || searchResults.length === 0) {
      return m.reply('No se encontraron resultados para la búsqueda.')
    }

    const appData = await download(searchResults[0].id)
    const infoText = `○ *Fuente:* aptoide\n○ *Nombre*: ${appData.name}\n○ *Package*: ${appData.package}\n○ *Actualización*: ${appData.lastup}\n○ *Tamaño*: ${appData.size}`

    await conn.sendMessage( m.chat.id, { image: { url: appData.icon }, caption: infoText, }, { quoted: m } )

    if ( appData.size.includes('GB') || parseFloat(appData.size.replace(' MB', '')) > 2000 ) {
      return m.reply('El archivo es demasiado pesado para ser enviado.')
    }

    await conn.sendMessage( m.chat.id, { document: { url: appData.dllink }, mimetype: 'application/vnd.android.package-archive', fileName: `${appData.name}.apk`, }, { quoted: m } )

    await m.react('done')
  } catch (error) {
    console.error(error)
    await m.react('error')
    return m.reply('Ocurrió un fallo durante la descarga.')
  }
}

export default command
