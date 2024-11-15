import gis from 'g-i-s'

const command = {
    command: ['gimage', 'image', 'imagen'],
    categoria: ['servicio']
}

command.script = async (m, { conn }) => {
    if (!m.text) return m.reply("¡Ingrese un término de búsqueda para obtener una imagen de Google!");
    m.react('🔎')
    try {
        await gis(m.text, async (error, result) => {
            if (error) { return m.reply("Se ha producido un error al buscar imágenes.") }
            if (!result || result.length === 0) { return m.reply("No se han encontrado imágenes para el término de búsqueda dado.") }
            const images = result[Math.floor(Math.random() * result.length)].url
            try { await conn.sendMessage(m.chat.id, { image: { url: images }, caption: `🔎 *Resultado de:* ${m.text}`, }, { quoted: m }); m.react('✔️');  } catch { m.react('❌') }
        });
    } catch { m.react('❌') }
}

export default command