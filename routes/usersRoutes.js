const UsersController = require('../controllers/usersController');
const passport = require('passport');

module.exports = (app, upload) => {
    //traer datos
    app.get('/api/users/findById/:id', passport.authenticate('jwt', {session: false}), UsersController.findById);
    app.get('/api/users/getAll', UsersController.getAll);
    //Guardado de datos
    app.post('/api/users/createImage', upload.array('image', 1), UsersController.registerWithImage);
    app.post('/api/users/create', UsersController.register);
    app.post('/api/users/login', UsersController.login);
    app.post('/api/users/logout', UsersController.logout);
    //actualización de datos
    app.put('/api/users/update', passport.authenticate('jwt', {session: false}), upload.array('image', 1), UsersController.update);
}