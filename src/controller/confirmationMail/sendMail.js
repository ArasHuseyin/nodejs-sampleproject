import nodemailer from 'nodemailer';
import mail from './mailContent.js'

export default function sendmail(sendTo, code) {
  let mailbody = mail(code);

  let transport = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
      user: 'savechat.mail@gmx.at',
      pass: 'Ta0C8QhWYZxAv3O2'
      //'tFQHWX8Tw47NhGzK'
    }
  });

  const message = {
    from: 'savechat.mail@gmx.at',
    to: sendTo,
    subject: 'Registration - SaveChat',
    html: mailbody
  };
  transport.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}


