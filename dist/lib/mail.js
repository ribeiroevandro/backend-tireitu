"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _nodemailer = require('nodemailer'); var _nodemailer2 = _interopRequireDefault(_nodemailer);
var _expresshandlebars = require('express-handlebars'); var _expresshandlebars2 = _interopRequireDefault(_expresshandlebars);
var _nodemailerexpresshandlebars = require('nodemailer-express-handlebars'); var _nodemailerexpresshandlebars2 = _interopRequireDefault(_nodemailerexpresshandlebars);
var _path = require('path');

var _nodemailer3 = require('../config/nodemailer'); var _nodemailer4 = _interopRequireDefault(_nodemailer3);

class Mail {
  constructor() {
    const { host, port, secure, auth } = _nodemailer4.default;
    this.transporter = _nodemailer2.default.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
      pool: true,
      // maxConnections: 20,
      // maxMessages: 10,
    });

    this.configTemplate();
  }

  configTemplate() {
    const viewPath = _path.resolve.call(void 0, __dirname, '..', 'app', 'views', 'emails');
    this.transporter.use(
      'compile',
      _nodemailerexpresshandlebars2.default.call(void 0, {
        viewEngine: _expresshandlebars2.default.create({
          layoutsDir: _path.resolve.call(void 0, viewPath, 'layouts'),
          partialsDir: _path.resolve.call(void 0, viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendEmail(mensagem) {
    return this.transporter.sendMail({
      ..._nodemailer4.default.default,
      ...mensagem,
    });
  }
}

exports. default = new Mail();
