"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _express = require('express');
var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);

var _usuarioController = require('./app/controllers/usuarioController'); var _usuarioController2 = _interopRequireDefault(_usuarioController);
var _grupoController = require('./app/controllers/grupoController'); var _grupoController2 = _interopRequireDefault(_grupoController);
var _lista_presentesController = require('./app/controllers/lista_presentesController'); var _lista_presentesController2 = _interopRequireDefault(_lista_presentesController);
var _membros_grupoController = require('./app/controllers/membros_grupoController'); var _membros_grupoController2 = _interopRequireDefault(_membros_grupoController);
var _conviteController = require('./app/controllers/conviteController'); var _conviteController2 = _interopRequireDefault(_conviteController);
var _notificationController = require('./app/controllers/notificationController'); var _notificationController2 = _interopRequireDefault(_notificationController);
var _sessaoController = require('./app/controllers/sessaoController'); var _sessaoController2 = _interopRequireDefault(_sessaoController);
var _sorteioController = require('./app/controllers/sorteioController'); var _sorteioController2 = _interopRequireDefault(_sorteioController);
var _arquivosController = require('./app/controllers/arquivosController'); var _arquivosController2 = _interopRequireDefault(_arquivosController);

var _auth = require('./app/middlewares/auth'); var _auth2 = _interopRequireDefault(_auth);
var _multer3 = require('./config/multer'); var _multer4 = _interopRequireDefault(_multer3);

const routes = new (0, _express.Router)();
const upload = _multer2.default.call(void 0, _multer4.default);

routes.post('/usuarios', _usuarioController2.default.store);

routes.post('/sessoes', _sessaoController2.default.store);

routes.use(_auth2.default);

routes.get('/usuarios', _usuarioController2.default.index);
routes.put('/usuarios', _usuarioController2.default.update);
routes.post('/files', upload.single('file'), _arquivosController2.default.store);

routes.get('/grupos', _grupoController2.default.index);
routes.get('/grupos/:grupo_id', _grupoController2.default.show);
routes.post('/grupos', _grupoController2.default.store);
routes.put('/grupos/:grupo_id', _grupoController2.default.update);
routes.delete('/grupos/:grupo_id', _grupoController2.default.delete);

routes.get('/grupos/:grupo_id/membros', _membros_grupoController2.default.index);
routes.post('/grupos/:convidado_id/convites', _membros_grupoController2.default.store);
routes.put('/grupos/:grupo_id/sorteio', _sorteioController2.default.update);

routes.get('/notificacoes/', _notificationController2.default.index);

routes.post('/convites/:grupo_id', _conviteController2.default.store);

routes.get('/presentes', _lista_presentesController2.default.index);
routes.get('/presentes/:usuario_id', _lista_presentesController2.default.show);
routes.post('/presentes', _lista_presentesController2.default.store);
routes.put('/presentes/:presente_id', _lista_presentesController2.default.update);

exports. default = routes;
