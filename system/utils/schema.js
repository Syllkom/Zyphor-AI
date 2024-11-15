import Joi from 'joi'

export const schema = {
    config: Joi.object({
        dataStorage: Joi.object({
            database: Joi.object({
                active: Joi.boolean().required(),
                fileName: Joi.string().required(),
                interval: Joi.number().integer().positive().required()
            }).required(),
            store: Joi.object({
                active: Joi.boolean().required(),
                fileName: Joi.string().required(),
                interval: Joi.number().integer().positive().required()
            }).required()
        }).required(),
        botConfig: Joi.object({
            owner: Joi.string().pattern(/^\d+$/).required(),
            nameBot: Joi.string().required(),
            prefix: Joi.string().required(),
            tmpClear: Joi.number().integer().positive().required(),
            autoRead: Joi.boolean().required(),
            botModules: Joi.object({
                coreDir: Joi.string().required(),
                pluginsDir: Joi.string().required(),
                logicDir: Joi.string().required(),
                evalScripts: Joi.object({
                    setupScript: Joi.string().required(),
                    preScript: Joi.string().required(),
                    postScript: Joi.string().required()
                }).required()
            }).required().unknown(true),
            reactions: Joi.object({
                waiting: Joi.string().required(),
                success: Joi.string().required(),
                failure: Joi.string().required()
            }).required().unknown(true),
            trustedUsers: Joi.object().pattern(
                Joi.string().pattern(/^\d+$/),
                Joi.object({
                    rowner: Joi.boolean().required(),
                    owner: Joi.boolean().required(),
                    modr: Joi.boolean().required(),
                    prem: Joi.boolean().required()
                }).unknown(true)).required()
        }).required().unknown(true),
        directorySetup: Joi.object({
            system: Joi.string().required(),
            foldersToCreate: Joi.array().items(Joi.object({
                baseDir: Joi.string().required(),
                subfolders: Joi.array().items(Joi.string()).required()
            }).unknown(true)).required()
        }).required().unknown(true)
    }).unknown(true),
    plugins: Joi.object({
        command: Joi.array().items(Joi.string()).required(),
        categoria: Joi.array().items(Joi.string()).required(),
        script: Joi.func().required()
    }).unknown(true),
    stubtype: Joi.object({
        stubtype: Joi.array().items(Joi.string()).required(),
        script: Joi.func().required()
    }).unknown(true)
}

/*
const validationResult = schema.validate(configObject, { abortEarly: false })
if (validationResult.error) {
    validationResult.error.details.forEach(err => {
        console.log(`Error en la propiedad: ${err.path.join('.')}`);
        console.log(`Mensaje: ${err.message}`);
    });
} else {
    console.log("Configuración válida");
}*/