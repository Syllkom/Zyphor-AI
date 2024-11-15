const command = {
    command: ['bot'],
    categoria: ['main']
};

command.script = async (m, { conn }) => {
    const bot = `Hola, soy KazeBot, para ver la lista de comandos utiliza *#menu*, si desea interactuar con mi creador: *#owner*`;
    m.reply(bot)
}
    
export default command;