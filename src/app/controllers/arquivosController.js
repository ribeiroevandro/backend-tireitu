import Arquivos from '../models/arquivos';

class ArquivosController {
  async store(req, res) {
    const { originalname: nome, filename: arquivo } = req.file;

    const file = await Arquivos.create({
      nome,
      arquivo,
    });

    return res.json(file);
  }
}
export default new ArquivosController();
