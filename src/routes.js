import { Router } from 'express';
import multer from 'multer';

import UsuarioController from './app/controllers/usuarioController';
import GrupoController from './app/controllers/grupoController';
import Lista_presentesController from './app/controllers/lista_presentesController';
import Membros_grupoController from './app/controllers/membros_grupoController';
import ConviteController from './app/controllers/conviteController';
import NotificationController from './app/controllers/notificationController';
import SessaoController from './app/controllers/sessaoController';
import SorteioController from './app/controllers/sorteioController';
import ArquivosController from './app/controllers/arquivosController';

import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/usuarios', UsuarioController.store);

routes.post('/sessoes', SessaoController.store);

routes.use(authMiddleware);

routes.get('/usuarios', UsuarioController.index);
routes.put('/usuarios', UsuarioController.update);
routes.post('/files', upload.single('file'), ArquivosController.store);

routes.get('/grupos', GrupoController.index);
routes.get('/grupos/:grupo_id', GrupoController.show);
routes.post('/grupos', GrupoController.store);
routes.put('/grupos/:grupo_id', GrupoController.update);
routes.delete('/grupos/:grupo_id', GrupoController.delete);

routes.get('/grupos/:grupo_id/membros', Membros_grupoController.index);
routes.post('/grupos/:convidado_id/convites', Membros_grupoController.store);
routes.put('/grupos/:grupo_id/sorteio', SorteioController.update);

routes.get('/notificacoes/', NotificationController.index);

routes.post('/convites/:grupo_id', ConviteController.store);

routes.get('/presentes', Lista_presentesController.index);
routes.get('/presentes/:usuario_id', Lista_presentesController.show);
routes.post('/presentes', Lista_presentesController.store);
routes.put('/presentes/:presente_id', Lista_presentesController.update);

export default routes;
