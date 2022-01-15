const nodemailer = require('nodemailer');


module.exports =  nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1a4b8a0235a5f2",
      pass: "dba258476bdf4d"
    }
});

//module.exports = transport;