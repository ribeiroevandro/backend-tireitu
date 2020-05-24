import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import dbConfig from '../config/database';

import Usuarios from '../app/models/usuarios';
import Grupos from '../app/models/grupos';
import Membros_grupos from '../app/models/membros_grupo';
import Lista_presentes from '../app/models/lista_presentes';
import Convites from '../app/models/convites';
import Arquivos from '../app/models/arquivos';

const models = [
  Usuarios,
  Grupos,
  Membros_grupos,
  Lista_presentes,
  Convites,
  Arquivos,
];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(dbConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
