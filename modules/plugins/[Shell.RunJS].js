import { exec } from 'child_process'
import util from 'util'

const command = {
    command: ['>', '$'],
    usePrefix: false
}

command.script = async (m, { conn }) => {
    if (m.budy.startsWith('>')) {
        if (!m.sender.role(['rowner', 'owner'])) return;
        try {
            let evaled = await eval(m.budy.slice(2))
            if (typeof evaled !== 'string') evaled = util.inspect(evaled)
            if (evaled !== 'undefined') return await m.reply(evaled)
        } catch (err) { if (err !== 'undefined') return await m.reply(String(err)) }
    }
    else if (m.budy.startsWith('$')) {
        if (!m.sender.role(['rowner', 'owner'])) return;
        exec(m.budy.slice(2), async (err, stdout) => {
            if (err) return await m.reply(err)
            if (stdout) return await m.reply(stdout)
        })
    }
    else return;
}

export default command