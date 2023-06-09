const Evento = require('../models/evento');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');
const { asistencia_alumno } = require('../models/evento');

module.exports = {

    async findByCategory(req, res, next){
        try {
            const id_category = req.params.id_category;
            const data = await Evento.findByCategory(id_category);

            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error ${error}`);
                return res.status(501).json({
                    message: `Hubo un error al obtener los eventos ${error}`,
                    success: false,
                    error: error
                });
        }
    },

    async findByCategoryAndName(req, res, next){
        try {
            const id_category = req.params.id_category;
            const name = req.params.name;
            const data = await Evento.findByCategoryAndName(id_category, name);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error ${error}`);
                return res.status(501).json({
                    message: `Hubo un error al obtener los eventos ${error}`,
                    success: false,
                    error: error
                });
        }
    },

    async create(req, res, next){
        let evento = JSON.parse(req.body.evento);

        const files = req.files;

        let insert = 0;

        if(files.length === 0){
            return res.status(501).json({
                message: 'Error al registra el evento, no tiene imagen',
                success: false
            });
        } else{
            try {

                const data = await Evento.create(evento);
                evento.id = data.id;
                const start = async () => {
                    await asyncForEach(files, async (file) => {
                        const pathImage = `image_${Date.now()}`;
                        const url = await storage(file, pathImage);
                        if(url !== undefined && url !== null){
                            if(insert == 0){
                                evento.image1 = url;
                            } else if(insert == 1){
                                evento.image2 = url;
                            } else if(insert == 2){
                                evento.image3 = url;
                            }
                        }
                        await Evento.update(evento);
                        insert = insert + 1;
                        if(insert == files.length){
                            return res.status(201).json({
                                success: true,
                                message: 'El evento se a creado exitosamente'
                            });
                        }
                    });
                }
                start();
                
            } catch (error) {
                console.log(`Error ${error}`);
                return res.status(501).json({
                    message: `Hubo un error al registrar el evento ${error}`,
                    success: false,
                    error: error
                });
            }
        }
    }
}