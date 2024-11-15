import fs from 'fs/promises';
import { sizeFormatter } from 'human-readable';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { cpus as _cpus, hostname, totalmem, type } from 'os';
import path from 'path';
import { performance } from 'perf_hooks';

const command = {
    command: ['getinfo', 'geti', 'getinformacion'],
    categoria: ['grupos']
}

command.script = async (m, { conn }) => {
    const findCmd = (array) => array.includes(m.command);
    if (findCmd(command.command)) {
        try {
            const getINFO = async (mde) => {
                if (typeof mde !== 'string') return;

                if (mde === 'chat') {
                    const image = await m.chat.photo()
                    const calculePart = await CalculeGrupo(m);
                    const Admins = (m.chat.participants.filter(p => p.admin)).map(v => `• @${v.id.split('@')[0]}`);

                    let text = `*Grupo* "${m.chat.name}", *creado por* @${m.chat.owner.split('@')[0]} el *${formatDate(m.chat.metaData.creation * 1000)}*. ` + `Cuenta con \`${m.chat.participants.length}\` *participantes* y \`${Admins.length}\` *administradores*.\n\n` + `*Administradores* del grupo\n\n${Admins.join('\n')}\n\n`
                    if (conn.store) {
                        const arrayMessages = conn.store.messages[m.chat.id].array
                        text += `*Conteo de mensajes:* \`${arrayMessages.length}\``
                        text += `\n\n*Usuarios con mayor cantidad de mensajes*\n\n${Object.entries(arrayMessages.reduce((acc, msg) => {
                            const userId = msg.key?.participant;
                            if (userId) acc[userId] = (acc[userId] || 0) + 1;
                            return acc;
                        }, {})).sort(([, a], [, b]) => b - a).slice(0, 5).map(([userId, count]) => `- @${userId.split('@')[0]} (\`${count}\` • *${((count / arrayMessages.length) * 100).toFixed(2)}%*)`).join('\n')}`
                    }

                    text += `\n\n*Países con mayor cantidad de participantes*\n\n${(calculePart.top).map(o => `• *${o.porcentaje}%* ${o.pais} (\`${o.cantidad}\` participantes)`).join('\n')}`;

                    if (calculePart.otros.length > 0) {
                        text += `\n\n*Otros Países con participación*\n\n${calculePart.otros.map(o => `• *${o.porcentaje}%* ${o.pais} (\`${o.cantidad}\` participantes)`).join('\n')}`;
                    }

                    await conn.sendMessage(m.chat.id, {
                        image: { url: image },
                        caption: text,
                        contextInfo: {
                            mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
                            externalAdReply: {
                                title: `${m.chat.name}`,
                                body: 'WhatsApp grupo',
                                thumbnailUrl: await conn.profilePictureUrl(m.chat.owner, 'image').catch(() => image),
                                mediaType: 1
                            }
                        }
                    }, { quoted: m });
                } else {
                    let format = sizeFormatter({
                        std: 'JEDEC',
                        decimalPlaces: 2,
                        keepTrailingZeroes: false,
                        render: (literal, symbol) => `${literal} ${symbol}B`
                    });

                    const used = process.memoryUsage();
                    const cpus = _cpus().map(cpu => {
                        cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0);
                        return cpu;
                    });

                    const cpu = cpus.reduce((last, cpu, _, { length }) => {
                        last.total += cpu.total;
                        last.speed += cpu.speed / length;
                        last.times.user += cpu.times.user;
                        last.times.nice += cpu.times.nice;
                        last.times.sys += cpu.times.sys;
                        last.times.idle += cpu.times.idle;
                        last.times.irq += cpu.times.irq;
                        return last;
                    }, { speed: 0, total: 0, times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 } });

                    let old = performance.now();
                    let neww = performance.now();
                    let speed = neww - old;

                    let texto = (`*Información del sistema*
${readMore}
*Memoria RAM:* ${format(totalmem())}
*Núcleos de CPU:* ${cpus.length}
*Modelo de CPU:* ${cpus[0]?.model.trim() || 'Desconocido'}
*Tiempo de procesamiento:* ${speed.toFixed(4)} milisegundos
*Tiempo activo:* [ ${timeString(process.uptime())} ]
*Sistema operativo base:* ${type()}
*Nombre del host:* ${hostname()}
                                        
• *Uso de memoria:*
${Object.keys(used).map((key) => `\`\`\`${key.padEnd(15, ' ')}:\`\`\` \`${format(used[key])}\``).join('\n')}
                    
${cpus[0] ? `• *Uso de CPU:*\n${Object.keys(cpu.times).map(type => `\`\`\`${(type.charAt(0).toUpperCase() + type.slice(1)).padEnd(6)}:\`\`\` \`${(100 * cpu.times[type] / cpu.total).toFixed(3)}%\``).join('\n')}` : ''}`);

                    await conn.sendMessage(m.chat.id, {
                        text: texto,
                        contextInfo: {
                            externalAdReply: {
                                title: 'Zyphor AI',
                                body: `Activo: ${timeString(process.uptime())}`,
                                thumbnailUrl: await m.bot.photo(),
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, { quoted: m });
                }
            }

            if (['grupo', 'group', 'chat', 'g'].includes(m.args[0])) {
                if (!m.chat.group) return m.sms('group');
                if (!m.sender.admin) return m.sms('admin');
                if (!m.bot.admin) return m.sms('botAdmin');
                await getINFO('chat');
            } else if (['bot', 'Bot', 'b', 'robot'].includes(m.args[0])) {
                await getINFO('bot');
            } else if (!m.args[0]) {
                if (m.chat.group) {
                    if (!m.sender.admin) return m.sms('admin');
                    if (!m.bot.admin) return m.sms('botAdmin');
                    await getINFO('chat');
                } else {
                    await getINFO('bot');
                }
            }
        } catch (err) {
            console.error('Error ejecutando el comando getinfo:', err);
        }
    }
}

export default command;

function formatDate(n, locale = 'es') {
    return new Date(n).toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
}

function timeString(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d ? d + ':' : ''}${h ? h + ':' : ''}${m ? m + ':' : ''}${s}`;
}

async function CalculeGrupo(m) {
    try {
        const countries = JSON.parse(await fs.readFile(path.resolve('./modules/lib/countries.json'), 'utf8'));
        const participants = m.chat.participants.map(p => '+' + p.id.split('@')[0]);
        const countryData = participants.reduce((acc, num) => {
            const { country } = parsePhoneNumberFromString(num) || {};
            if (country) acc[country] = (acc[country] || 0) + 1;
            return acc;
        }, {});

        const top = Object.entries(countryData)
            .map(([code, count]) => ({ pais: countries.countries[code], cantidad: count, porcentaje: ((count / participants.length) * 100).toFixed(2) }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5);

        const otros = Object.entries(countryData)
            .filter(([code]) => !top.some(t => t.pais === countries.countries[code]))
            .map(([code, count]) => ({ pais: countries.countries[code], cantidad: count, porcentaje: ((count / participants.length) * 100).toFixed(2) }))
            .sort((a, b) => b.cantidad - a.cantidad);

        return { top, otros };
    } catch (err) {
        console.error('Error calculando los datos del grupo:', err);
    }
}
