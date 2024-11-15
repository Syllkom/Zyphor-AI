import fs from 'fs';
import path from 'path';
import { fork, setupPrimary } from 'cluster';
import { createInterface } from 'readline/promises';

const config = JSON.parse(fs.readFileSync(path.resolve('./config.json')));
const readline = createInterface({ input: process.stdin, output: process.stdout });
const { schema } = await import(`./${config.directorySetup.system}/utils/schema.js`)
const { logger } = await import(`./${config.directorySetup.system}/utils/Simple.js`)
const creds = fs.existsSync(`./${config.directorySetup.system}/creds/creds.json`)
let menu = `\n\x1b[1;31m╭╼◯\x1b[1;37m \x1b[1;32mZyphor Bot - MD / Conexión\x1b[0m\n\x1b[1;31m╷\x1b[1;37m Como desea conectarse:\n\x1b[1;31m├╶╶╶✦\x1b[1;37m\n\x1b[1;31m╵⌬\x1b[1;37m \x1b[1;32m1. Por QR\x1b[0m\n\x1b[1;31m╵⌬\x1b[1;37m \x1b[1;32m2. Código por 8 dígitos\x1b[0m\n\x1b[1;31m╰────────────────────────────◯\x1b[1;37m\n`;
global.botName = config.botConfig.nameBot;
global['@config'] = config;
let running = false;
let objeto;

try {
    const Schema = schema.config.validate(config, { abortEarly: false });
    if (Schema.error) { Schema.error.details.forEach(err => { logger.error(`config.json: ${err.path.join('.')}`), logger.info(err.message) }), process.exit(1) }
} catch (error) {
    logger.error(error);
}

if (config.botConfig.numeroBot && !creds) {
    while (true) {
        const opcion = (await new Promise(async resolve => resolve(await readline.question(`\n\x1b[1;31m~\x1b[1;37m> ¿Quieres usar el número existente: ${config.botConfig.numeroBot}?\n\n\x1b[1;31m~\x1b[1;37m> (Y/N): `)))).trim()
        if ((opcion.toLowerCase()).includes('n')) { break }
        else if ((opcion.toLowerCase()).includes('y')) {
            objeto = {
                connectType: 'pin-code',
                phoneNumber: config.botConfig.numeroBot
            }
            readline.close()
            break
        }
    }
}

if (!objeto && !creds) {
    let _opcion
    while (true) {
        const opcion = (await new Promise(async resolve => resolve(await readline.question(menu)))).trim()
        if (_opcion || opcion == '1') { _opcion = opcion, objeto = { connectType: 'qr-code', phoneNumber: '' }; break }
        else if (_opcion || opcion == '2') {
            let numero
            _opcion = opcion
            while (!numero) {
                numero = (await new Promise(async resolve => resolve(await readline.question('\n\x1b[1;31m●\x1b[1;37m \x1b[1;32m¿Cual es el numero que desea asignar como Bot?\x1b[0m\n: ')))).trim()
                if (!numero) { console.log("\n\n\x1b[1;31m●\x1b[1;37m \x1b[1;33mEl número es obligatorio. Por favor ingrese un número válido.\x1b[0m") }
            }
            objeto = { connectType: 'pin-code', phoneNumber: numero }
            break
        }
    }
    readline.close()
}

async function startBot(file) {
    if (running) return;
    const File = path.resolve(file);
    setupPrimary({ exec: File, args: [JSON.stringify(objeto || {})] });
    logger.log('Start()...')
    const Worker = fork();
    running = true;
    Worker.on('exit', async (code, signal) => {
        running = false;
        logger.error(`Code:${code}|Signal:${signal}`)
        Worker.process.kill();
        logger.log(`Restarting()...`)
        await new Promise(resolve => setTimeout(resolve, 2000));
        await startBot(file);
    });
}

await startBot('./main.js');
