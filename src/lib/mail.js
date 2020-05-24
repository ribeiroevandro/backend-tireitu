import nodemailer from 'nodemailer';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';

import emailConfig from '../config/nodemailer';

class Mail {
  constructor() {
    const { host, port, secure, auth } = emailConfig;
    this.transporter = nodemailer.createTransport({
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
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
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
      ...emailConfig.default,
      ...mensagem,
    });
  }
}

export default new Mail();
