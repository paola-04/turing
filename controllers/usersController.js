const User = require('../models/user');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');

module.exports = {
    async getAll(req, res, next){
        try {
            const data = await User.getAll();
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener usuarios'
            });
        }
    },

    async findById(req, res, next){
        try {
            const id = req.params.id;
            const data = await User.findByUserId(id);
            console.log(`Usuario: ${data}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los datos del usuario'
            });
        }
    },

    async registerWithImage(req, res, next){
        try {
            const user = JSON.parse(req.body.user);
            
            const files = req.files;
            if(files.length > 0){
                const pathImage = `image_${Date.now()}`;
                const url = await storage(files[0], pathImage);
                console.log(url)
                if(url != undefined && url != null){
                    user.image = url;
                    console.log(user.image)
                }
            }
            const data = await User.create(user);
            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente, ahora inicia sesion',
                data: data.id
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al registrar el usuario',
                error: error
            });
        }
    },

    async register(req, res, next){
        try {
            const user = req.body;

            const data = await User.create(user);
            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente, ahora inicia sesion',
                data: data.id
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al registrar el usuario',
                error: error
            });
        }
    },

    async update(req, res, next){
        try {
            const user = JSON.parse(req.body.user);
            const files = req.files;
            if(files.length > 0){
                const pathImage = `image_${Date.now()}`;
                const url = await storage(files[0], pathImage);
                console.log(url)
                if(url != undefined && url != null){
                    user.image = url;
                    console.log(user.image)
                }
            }
            await User.update(user);
            return res.status(201).json({
                success: true,
                message: 'Actualización de datos exitosa',
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al actualizar los datos',
                error: error
            });
        }
    },

    async login(req, res, next) {
        try {
            const matricula = req.body.matricula;
            const password = req.body.password;
            const user = await User.findByMatricula(matricula);
            if(!user){
                return res.status(401).json({
                    success: false,
                    message: 'La matricula aun no se a registrado'
                });
            }
            if(User.isPasswordMatched(password, user.password)){
                const token = jwt.sign({id: user.id, matricula: user.matricula}, keys.secretOrKey, {
                    expiresIn: (60*60)
                });
                const data = {
                    id: user.id,
                    id_rol: user.id_rol,
                    name: user.name,
                    lastname: user.lastname,
                    matricula: user.matricula,
                    phone: user.phone,
                    image: user.image,
                    session_token: `JWT ${token}`,
                    identifier: user.identifier,
                    roles: user.roles
                }

                await User.updateToken(user.id, `JWT ${token}`);

                return res.status(201).json({
                    success: true,
                    data: data,
                    message: 'Login exitoso'
                });
            } else{
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña es incorrecta'
                });
            }
            
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al momento del login',
                error: error
            });
        }
    },

    async logout(req, res, next){
        try {
            const id = req.body.id;
            await User.updateToken(id, null);
            return res.status(201).json({
                success: true,
                message: 'Cierre de sessión exitoso'
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al momento cerrar sessión',
                error: error
            });
        }
    }

};