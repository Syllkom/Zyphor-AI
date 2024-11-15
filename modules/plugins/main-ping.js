import speed from 'performance-now';
import { exec } from 'child_process';

const command = {
    command: ['ping', 'speed', 'p'],
    categoria: ['main']
};

command.script = async (m, { conn }) => {
    let timestamp = speed();
    let latencia = speed() - timestamp;

    exec(`uname -sr && cat /proc/meminfo | grep MemTotal`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ejecutando comandos del sistema: ${error.message}`);
            return conn.sendMessage(m.chat.id, { text: '❌ Error al ejecutar el comando.' });
        }

        let systemInfo = stdout.toString("utf-8");

        
          const text = `*» Velocidad:* ${latencia.toFixed(4)} _ms_\n\n${systemInfo}`;
          m.reply(text);
    });
};

export default command;
