const EventosController = require('../controllers/eventosController');
const passport = require('passport');

module.exports = (app, upload) => {

    app.post('/api/eventos/create', passport.authenticate('jwt', {session: false}), upload.array('image', 3), EventosController.create);
    app.get('/api/eventos/findByCategory/:id_category', passport.authenticate('jwt', {session: false}), EventosController.findByCategory);
    app.get('/api/eventos/findByCategoryAndName/:id_category/:name', passport.authenticate('jwt', {session: false}), EventosController.findByCategoryAndName);
}