const command = {
    command: ['menu', 'menú', 'help', 'cmd', 'cmds', 'comandos', 'funciones'],
    categoria: ['main']
}

command.script = async (m, { conn }) => {
    const image = await conn.resizePhoto({ image: await m.chat.photo(), scale: 360, result: 'base64' })
    const imagechat = await m.chat.photo()
    const SabiasQue = SabiasQueData[Math.floor(Math.random() * SabiasQueData.length)];
    const menu = `╭ ✦ \`\`\`Zyphor - Bot\`\`\`
│ *User:* @${m.sender.number}
│ *Activo:* ${timeString(process.uptime())}
│ *Versión:* undefined
│ *Type:* plugin
│ *Creador:* @Syllkom
╰─────────────◯

*● ¿Sabías qué?* ${SabiasQue}
${readMore}
*☲ Menu de comandos:*

╭ ✦ *</Grupos>*
╵/getinfo
╵/hidetag
╵/invocar
╵/ban
╵/allban (❗)
╰╶╴──────╶╴─╶╴◯

╭ ✦ *</Conversor>*
╵/sticker
╵/hd (image)
╵/hdvid (video)
╵/voz
╵/translate
╵/tinyurl
╵/tourl
╰╶╴──────╶╴─╶╴◯

╭ ✦ *</Downloader>*
╵/play
╵/ytmp3
╵/ytmp4
╵/tiktok
╵/tthd (tiktok HD)
╵/pinterest
╵/x (twitter)
╵/Instagram
╵/gitclone
╵/mediafire
╵/mega
╵/gdrive
╰╶╴──────╶╴─╶╴◯

╭ ✦ *</Search>*
╵/ytsearch
╵/tiktoksearch
╵/gimage
╵/wallpaper
╵/wikipedia
╵/sound1 (1-161)
╰╶╴──────╶╴─╶╴◯

╭ ✦ *</Anime>*
╵/animes (🎌 Sub)
╵/animel (🇲🇽 Español)
╵/hentai
╵/edit <anime|phonk>
╵/couple
╰╶╴──────╶╴─╶╴◯

╭ ✦ *</Otros>*
╵/sc (script bot)
╵/ping
╵/creador
╵/gpt4
╵/txtimg
╰╶╴──────╶╴─╶╴◯

╭ ✦ *</Owner>*
╵/setpphoto
╵/setpphoto group
╵/setppname bot
╵/join
╰╶╴──────╶╴─╶╴◯`
    await m.react('wait');

    await conn.sendMessage(m.chat.id, { document: Buffer.alloc(5), fileName: 'Zyphor AI', mimetype: 'video/mp4', jpegThumbnail: image, caption: menu, contextInfo: { mentionedJid: [m.sender.id], externalAdReply: { title: author, body: desc, thumbnail: mylogo, renderLargerThumbnail: true, showAdAttribution: true, sourceUrl: CanalZp, mediaType: 1, } } });
    
    await m.react('done');
    
}

export default command

function timeString(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d ? d + ':' : ''}${h ? h + ':' : ''}${m ? m + ':' : ''}${s}`;
}

const SabiasQueData = [
    "El 16% de las mujeres nacen rubias, y 33% de las mujeres son rubias.",
    "El sol libera más energía en un segundo que toda la energía consumida por la humanidad desde su inicio.",
    "Napoleón Bonaparte calculó que las piedras de las pirámides de Egipto serían suficientes para construir un muro alrededor de Francia.",
    "La letra 'J' es la única letra que no aparece en la tabla periódica.",
    "Una persona parpadea aproximadamente 25 mil veces por semana.",
    "El elefante es el único animal con 4 rodillas.",
    "El material más resistente creado por la naturaleza es la tela de araña.",
    "Los rusos atienden el teléfono diciendo 'Estoy oyendo'.",
    "La hija de Shakespeare era analfabeta.",
    "Einstein nunca fue un buen alumno, y ni siquiera hablaba bien a los 9 años, sus padres creían que era retrasado mental.",
    "Los CDs fueron diseñados para recibir 72 minutos de música porque esa es la duración de la Novena Sinfonía de Beethoven.",
    "Las caricaturas del Pato Donald fueron vetadas en Finlandia porque éste no usaba pantalón.",
    "Un kilo de papas fritas cuesta 200 veces lo que vale un kilo de patatas.",
    "En la ciudad de Los Ángeles hay más automóviles que gente.",
    "El nombre más común del mundo es Mohammed.",
    "Los perezosos pueden aguantar más tiempo el aliento que los delfines.",
    "Los Froot Loops son todos del mismo sabor.",
    "Las manzanas en el supermercado pueden tener hasta un año.",
    "Los pulpos tienen 3 corazones.",
    "En las Filipinas, McDonald's vende spaghetti.",
    "Hitler fue nominado a un Nobel de la Paz.",
    "Las langostas saborean con los pies.",
    "El Empire State tiene su propio código postal.",
    "Las sombras son más oscuras en la luna.",
    "La Estatua de la Libertad solía ser un faro.",
    "Las ManhattAnts son una especie de hormigas únicas de Nueva York.",
    "Los tanques británicos están equipados para hacer té.",
    "Los aguacates son una fruta, no una verdura. Técnicamente se consideran una baya de una sola semilla.",
    "La Torre Eiffel puede ser 15 cm más alta durante el verano. Se debe a la expansión térmica.",
    "La tripofobia es el miedo a los agujeros muy juntos.",
    "Australia es más ancha que la Luna. La Luna tiene 3400 km de diámetro, mientras que el diámetro de Australia es de casi 4000 km.",
    "'Melifluo' es un sonido que resulta agradablemente suave y musical al escucharlo.",
    "Las Spice Girls se llamaban originalmente Touch.",
    "Los dientes humanos son la única parte del cuerpo que no puede curarse por sí misma.",
    "En Suiza es ilegal tener una sola cobaya.",
    "Los antiguos romanos solían echar un trozo de pan tostado en el vino para tener buena salud, de ahí que brindemos.",
    "El corazón de las gambas se encuentra en la cabeza.",
    "Amy Poehler sólo tenía siete años más que Rachel McAdams cuando asumió el papel de mamá guay en Chicas malas.",
    "La gente es más creativa en la ducha.",
    "Los conejos bebé se llaman gazapos.",
    "El unicornio es el animal nacional de Escocia.",
    "El primer avión voló el 17 de diciembre de 1903.",
    "Venus es el único planeta que gira en el sentido de las agujas del reloj.",
    "La nuez moscada es un alucinógeno.",
    "Las artes solían ser un deporte olímpico.",
    "El gorro de cocinero tiene 100 pliegues.",
    "En 2014, hubo un 'match' de Tinder en la Antártida.",
    "El himno nacional español no tiene letra.",
    "La palabra japonesa 'Kuchi zamishi' es el acto de comer cuando no se tiene hambre porque la boca se siente sola.",
    "La probabilidad de que exista una langosta azul es de una entre dos millones.",
    "Sólo hay una letra que no aparece en el nombre de ningún estado americano: la Q.",
    "Las icónicas suelas rojas de los zapatos Louboutin se inspiraron en Andy Warhol.",
    "El libro 'A la recherche du temps perdu', de Marcel Proust, contiene unos 9.609.000 caracteres, lo que lo convierte en el libro más largo del mundo.",
    "Google Images se creó después de que Jennifer López llevara ese famoso vestido en los Grammy del año 2000.",
    "El reloj del Big Ben se detuvo a las 22:07 horas del 27 de mayo de 2005.",
    "Walt Disney es actualmente el que más premios de la Academia tiene.",
    "Hay una fruta que sabe a budín de chocolate: el zapote negro.",
    "La Reina Isabel II tenía formación en mecánica.",
    "Las cabezas de la Isla de Pascua tienen cuerpo.",
    "Las palomas pueden distinguir entre Picasso y Monet.",
    "Los actores que ponen voz a Mickey y Minnie se han casado en la vida real.",
    "El ojo humano puede distinguir alrededor de 10 millones de colores.",
    "La miel nunca se echa a perder. Se han encontrado frascos de miel de hace miles de años en tumbas egipcias y aún son comestibles.",
    "El cerebro humano tiene aproximadamente 86 mil millones de neuronas.",
    "La Gran Muralla China no es visible desde el espacio a simple vista.",
    "El Monte Everest crece aproximadamente 4 milímetros al año debido al movimiento tectónico.",
    "El ser humano comparte aproximadamente el 60% de su ADN con los plátanos.",
    "El corazón de una ballena azul es tan grande que un ser humano podría nadar a través de sus arterias.",
    "Un rayo puede alcanzar temperaturas de aproximadamente 30,000 grados Celsius, cinco veces más caliente que la superficie del sol.",
    "El tiburón de Groenlandia puede vivir hasta 400 años, siendo uno de los vertebrados más longevos.",
    "El agua caliente se congela más rápido que el agua fría en ciertas condiciones, un fenómeno conocido como efecto Mpemba.",
    "Las mariposas tienen sensores de sabor en sus pies para encontrar plantas adecuadas donde poner sus huevos.",
    "El cerebro de un pulpo está distribuido en sus tentáculos, lo que le permite realizar tareas complejas con cada uno de ellos.",
    "El Koala tiene huellas dactilares muy similares a las humanas, lo que puede confundir a los investigadores en escenas de crimen.",
    "El pez luna puede poner hasta 300 millones de huevos a la vez.",
    "Las hormigas no duermen. Sin embargo, tienen ciclos de reposo cortos.",
    "El agua constituye aproximadamente el 70% del cuerpo humano.",
    "El sonido viaja 4.3 veces más rápido en el agua que en el aire.",
    "La Tierra recibe más energía del sol en una hora que toda la energía consumida por la humanidad en un año.",
    "La luz del sol tarda aproximadamente 8 minutos y 20 segundos en llegar a la Tierra.",
    "La Torre Eiffel fue construida para ser una estructura temporal para la Exposición Universal de 1889.",
    "El primer teléfono móvil pesaba 1.1 kilogramos y tenía una duración de batería de 30 minutos en conversación.",
    "El dragón de Komodo tiene una mordedura venenosa que puede causar la muerte por envenenamiento y pérdida de sangre.",
    "Las estrellas de mar pueden regenerar partes perdidas de su cuerpo, incluso brazos completos.",
    "El primer ser vivo enviado al espacio fue una mosca de la fruta en 1947.",
    "El planeta más caliente en el sistema solar es Venus, con temperaturas que alcanzan los 462 grados Celsius.",
    "Las ballenas jorobadas son conocidas por sus complejas canciones que pueden durar hasta 20 minutos y se repiten durante horas.",
    "El tigre es el felino más grande del mundo, pudiendo alcanzar hasta 3.3 metros de longitud y pesar más de 300 kilogramos.",
    "La ciudad de Venecia en Italia se compone de 118 pequeñas islas conectadas por más de 400 puentes.",
    "La primera calculadora mecánica fue inventada por Blaise Pascal en 1642.",
    "El oro es comestible y se utiliza en pequeñas cantidades para decorar alimentos gourmet y bebidas.",
    "El músculo más fuerte en relación a su tamaño en el cuerpo humano es el masetero, que se encuentra en la mandíbula.",
    "El colibrí es el único ave que puede volar hacia atrás.",
    "El pez globo contiene una toxina mortal que es 1,200 veces más venenosa que el cianuro.",
    "La luna se está alejando de la Tierra a un ritmo de aproximadamente 3.8 centímetros por año.",
    "El bambú puede crecer hasta 91 centímetros en un solo día.",
    "El cerebro humano es más activo durante la noche que durante el día.",
    "El veneno de la medusa avispa de mar es uno de los más mortales del mundo y puede matar a una persona en minutos.",
    "El kiwi es el único ave sin alas que pone huevos proporcionalmente grandes para su tamaño.",
    "El fósforo fue descubierto por accidente en 1669 por el alquimista alemán Hennig Brand.",
    "La biblioteca más grande del mundo es la Biblioteca del Congreso en Washington, D.C., con más de 170 millones de ítems.",
    "El nombre 'Canadá' proviene de la palabra iroquesa 'kanata', que significa 'aldea' o 'asentamiento'.",
    "El idioma japonés tiene tres sistemas de escritura: hiragana, katakana y kanji.",
    "El sushi es uno de los platillos más conocidos de la gastronomía japonesa, pero su origen data de un método de conservación de pescado en arroz fermentado.",
    "Japón cuenta con más de 6,800 islas, pero solo 430 de ellas están habitadas.",
    "El Monte Fuji es la montaña más alta de Japón, con 3,776 metros de altura.",
    "La ceremonia del té, o 'chanoyu', es una de las tradiciones más refinadas de la cultura japonesa.",
    "El tren bala japonés, o 'Shinkansen', es famoso por su velocidad, alcanzando hasta 320 km/h.",
    "En Japón, es común ver máquinas expendedoras que venden de todo, desde bebidas hasta ropa interior.",
    "El anime y el manga son una parte importante de la cultura popular japonesa y han ganado popularidad en todo el mundo.",
    "Tokio, la capital de Japón, es la ciudad más grande del mundo, con más de 37 millones de habitantes en su área metropolitana.",
    "Los japoneses celebran un festival anual de los cerezos en flor llamado 'hanami', donde se reúnen para admirar las flores de cerezo ('sakura').",
    "En Japón, es de mala educación dejar propina. El servicio excepcional es una expectativa estándar.",
    "El arte del bonsái se originó en China, pero fue perfeccionado y popularizado por los japoneses.",
    "La religión predominante en Japón es una mezcla de sintoísmo y budismo.",
    "El teatro Kabuki es una forma de teatro japonés tradicional conocido por su maquillaje elaborado y actuaciones dramáticas.",
    "El pescado crudo es un ingrediente principal en el sushi, pero en Japón también se consume con frecuencia el 'sashimi', que es simplemente pescado crudo sin arroz.",
    "Los japoneses tienen una esperanza de vida promedio muy alta, con mujeres que viven hasta 87 años y hombres hasta 81 años.",
    "El karaoké, una forma de entretenimiento en la que las personas cantan sobre pistas musicales, fue inventado en Japón en la década de 1970.",
    "Japón es uno de los países más seguros del mundo, con tasas de criminalidad muy bajas.",
    "Las fuentes termales, o 'onsen', son muy populares en Japón y se consideran una forma de relajación y terapia.",
    "El Código Bushido era el código de los samuráis, guerreros nobles que valoraban el honor y la lealtad por encima de todo.",
    "El monte Fuji ha inspirado a muchos artistas japoneses, incluyendo las famosas impresiones de Hokusai, como 'La Gran Ola de Kanagawa'.",
    "En Japón, es común quitarse los zapatos al entrar en una casa. Esto se debe a la importancia de mantener el espacio interior limpio.",
    "El sake es una bebida alcohólica tradicional japonesa hecha a partir de arroz fermentado.",
    "El primer anime comercialmente exitoso fue 'Astro Boy' (1963), creado por Osamu Tezuka, conocido como el 'Dios del Manga'.",
    "El anime más largo de la historia es 'Sazae-san', que ha estado en emisión desde 1969 y cuenta con más de 7,000 episodios.",
    "Studio Ghibli, fundado por Hayao Miyazaki e Isao Takahata, es uno de los estudios de animación más conocidos y aclamados a nivel mundial.",
    "La película 'El viaje de Chihiro' (2001) es la única película de anime que ha ganado un Premio Óscar.",
    "El término 'otaku' se refiere a las personas con una fuerte pasión por el anime, el manga o los videojuegos, pero en Japón tiene una connotación más negativa que en otros países.",
    "La convención de anime más grande del mundo es el 'Comiket' en Japón, donde se venden doujinshi (manga hecho por aficionados) y atrae a cientos de miles de fanáticos cada año.",
    "Neon Genesis Evangelion revolucionó la industria del anime al introducir elementos psicológicos y filosóficos en una serie de mechas.",
    "One Piece, de Eiichiro Oda, es el manga más vendido de la historia, con más de 500 millones de copias distribuidas a nivel mundial.",
    "Akira (1988) es una de las películas más influyentes en la historia del anime, conocida por su animación detallada y temas post-apocalípticos.",
    "El término 'anime' en Japón se refiere a cualquier tipo de animación, ya sea nacional o internacional.",
    "Dragon Ball Z es considerado uno de los animes más influyentes a nivel mundial y ha sido un fenómeno cultural en muchos países fuera de Japón.",
    "En Japón, es común que los animes se emitan en bloques de 12 o 24 episodios, conocidos como 'cursos', y las series que duran más de un curso son excepcionales.",
    "El 'fandub' es una práctica en la que los fanáticos de anime doblan las series por su cuenta y las comparten en línea, ayudando a que el anime llegue a más personas fuera de Japón.",
    "Naruto y Naruto Shippuden son animes basados en el manga de Masashi Kishimoto y son considerados íconos de la cultura popular, especialmente en el género shonen.",
    "El anime de 'Attack on Titan' (Shingeki no Kyojin) es conocido por sus escenas de acción intensas y su intrincada trama, y ha atraído a millones de fanáticos en todo el mundo.",
    "Los temas de apertura de anime, o 'openings', a menudo son interpretados por bandas populares en Japón y a veces se vuelven tan famosos como las series mismas.",
    "El género 'isekai' de anime, que trata sobre personajes que son transportados a mundos paralelos, ha ganado una enorme popularidad en la última década.",
    "El anime 'Your Name' (Kimi no Na wa) de Makoto Shinkai se convirtió en un éxito internacional y es una de las películas de anime más taquilleras de todos los tiempos.",
    "El fenómeno de los 'waifus' y 'husbandos' es común entre los fanáticos del anime, donde las personas se sienten especialmente apegadas a ciertos personajes de ficción.",
    "Anime Expo en Los Ángeles es una de las convenciones de anime más grandes fuera de Japón, atrayendo a fanáticos de todo el mundo.",
    "El anime de 'Sword Art Online' ayudó a popularizar el subgénero de ciencia ficción basado en mundos virtuales o videojuegos.",
    "El término 'cosplay' proviene de la combinación de las palabras 'costume' (disfraz) y 'play' (actuación), y fue acuñado por el periodista japonés Nobuyuki Takahashi en 1984.",
    "El primer evento conocido de cosplay se remonta a 1939, cuando los asistentes a la primera World Science Fiction Convention (Worldcon) en Nueva York usaron disfraces basados en personajes de ciencia ficción.",
    "Los eventos de cosplay son especialmente populares en convenciones de anime y videojuegos, como la Comic-Con en Estados Unidos y el Comiket en Japón.",
    "El cosplay de personajes de videojuegos es tan popular como el de anime, con personajes icónicos como Link de 'The Legend of Zelda', Lara Croft de 'Tomb Raider' y Cloud Strife de 'Final Fantasy'.",
    "El cosplay no es solo sobre vestirse como un personaje, sino también sobre interpretar su personalidad y comportamiento.",
    "Japón es considerado el centro mundial del cosplay, y distritos como Akihabara en Tokio son famosos por ser zonas de encuentro para cosplayers.",
    "Muchos cosplayers dedican meses a crear sus disfraces, algunos incluso confeccionándolos a mano y personalizando cada detalle para lograr la máxima precisión.",
    "El 'World Cosplay Summit' es una competencia internacional de cosplay que se celebra cada año en Japón y reúne a los mejores cosplayers del mundo.",
    "El cosplay ha ganado tanta popularidad que hay cosplayers profesionales que hacen de esta actividad su carrera, asistiendo a eventos y patrocinados por marcas.",
    "Uno de los cosplays más icónicos es el de Sailor Moon, el cual sigue siendo un favorito entre los fans de la serie y cosplayers de todas las edades.",
    "El 'crossplay' es una variante del cosplay donde los participantes se disfrazan de personajes de otro género, algo que se ha vuelto muy común y apreciado en la comunidad.",
    "Los cosplayers no solo se disfrazan de personajes de anime y videojuegos, sino también de películas, cómics, y series de televisión como Marvel, DC, y Star Wars.",
    "La cultura del cosplay ha influido en el mundo de los videojuegos, y algunos desarrolladores incluyen trajes de personajes famosos como opciones de personalización en los juegos.",
    "En Corea del Sur, el cosplay también está muy ligado a la cultura de los eSports, y es común ver cosplayers de juegos como 'League of Legends' en torneos internacionales.",
    "Muchos cosplayers utilizan técnicas avanzadas de maquillaje, prótesis, y efectos especiales para lograr una apariencia más realista o acorde con personajes fantásticos.",
    "El cosplay grupal es una práctica común en la que varios cosplayers se visten como personajes de una misma serie, creando representaciones en equipo.",
    "Los concursos de cosplay en convenciones suelen tener diferentes categorías, como mejor disfraz, mejor actuación, y mejor construcción de armadura o props.",
    "El uso de materiales como espuma EVA, resina y plástico es común en la construcción de armas, armaduras y otros accesorios complejos para cosplay.",
    "Algunos cosplayers logran tal nivel de detalle en sus trajes que son contratados por compañías de videojuegos o de anime para representarlos en eventos oficiales.",
    "Aunque el cosplay se originó en Japón, ha ganado una enorme popularidad a nivel mundial, con comunidades activas en países como Estados Unidos, Brasil, Francia, y México."
]