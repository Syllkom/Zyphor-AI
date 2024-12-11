import axios from 'axios'
import moment from 'moment-timezone'

const command = {
    command: ['sc', 'script'],
    categoria: ['main']
}

command.script = async (m, { conn }) => {
    const repoUrl = 'https://api.github.com/repos/Syllkom/Zyphor-AI';
    try {
        const response = await axios.get(repoUrl, { timeout: 10000 });
        const repo = response.data;
        const formatSize = (sizeInKB) => { const units = ['KB', 'MB', 'GB', 'TB']; let size = sizeInKB, unitIndex = 0; while (size >= 1024 && unitIndex < units.length - 1) { size /= 1024; unitIndex++; } return `${size.toFixed(2)} ${units[unitIndex]}`; };
        
        const info = {
            nombre: repo.name,
            descripcion: repo.description,
            fechaCreacion: moment(repo.created_at).format('YYYY-MM-DD HH:mm:ss'),
            fechaActualizacion: moment(repo.updated_at).format('YYYY-MM-DD HH:mm:ss'),
            estrellas: repo.stargazers_count,
            forks: repo.forks_count,
            issues: repo.open_issues_count,
            lenguaje: repo.language,
            enlace: repo.html_url,
            tamaño: formatSize(repo.size)
        };

        const mensaje = `╭ ✦ *</ZyphorAI - Bot>*\n╵Creación: \`${info.fechaCreacion}\`\n╵Actualización: \`${info.fechaActualizacion}\`\n╵Estrellas: \`${info.estrellas}\`\n╵Forks: \`${info.forks}\`\n╵Issues abiertas: \`${info.issues}\`\n╵Lenguaje: ${info.lenguaje}\n╵Tamaño: \`${info.tamaño}\`\n╰╶╴──────╶╴─╶╴◯`;

        const RepoImg = 'https://files.catbox.moe/352d9n.jpg';
        await conn.sendMessage(m.chat.id, { image: { url: RepoImg }, caption: mensaje, mentions: [m.sender], contextInfo: { externalAdReply: { showAdAttribution: true, title: `${info.nombre}`, body: `${info.descripcion}`, mediaUrl: `${info.enlace}`, sourceUrl: `${info.enlace}`, thumbnail: icon, mediaType: 1 } } }, { quoted: m });
    } catch (error) { console.error('Error al obtener datos del repositorio:', error.message || error); m.reply(`Hubo un error al obtener la información del repositorio: ${error.message || error}`); }
}

export default command
