"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);

var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);

var _usuarios = require('../app/models/usuarios'); var _usuarios2 = _interopRequireDefault(_usuarios);
var _grupos = require('../app/models/grupos'); var _grupos2 = _interopRequireDefault(_grupos);
var _membros_grupo = require('../app/models/membros_grupo'); var _membros_grupo2 = _interopRequireDefault(_membros_grupo);
var _lista_presentes = require('../app/models/lista_presentes'); var _lista_presentes2 = _interopRequireDefault(_lista_presentes);
var _convites = require('../app/models/convites'); var _convites2 = _interopRequireDefault(_convites);
var _arquivos = require('../app/models/arquivos'); var _arquivos2 = _interopRequireDefault(_arquivos);

const models = [
  _usuarios2.default,
  _grupos2.default,
  _membros_grupo2.default,
  _lista_presentes2.default,
  _convites2.default,
  _arquivos2.default,
];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new (0, _sequelize2.default)(_database2.default);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = _mongoose2.default.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

exports. default = new Database();
