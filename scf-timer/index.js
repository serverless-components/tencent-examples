'use strict';
const nodemailer = require("nodemailer");

exports.main_handler = async (event, context, callback) => {
  //let message = event["Message"];
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    tls: { // add tls param when using Outlook
       ciphers:'SSLv3'
    },
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_ADDRESS, // REPLACE WITH ACTUAL ACCOUNT
      pass: process.env.EMAIL_ADDRESS_PASSWORD // The authorization code 邮箱授权码
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS, // REPLACE WITH ACTUAL ACCOUNT
    to: process.env.EMAIL_ADDRESS, // REPLACE WITH ACTUAL ACCOUNT
    subject: 'Dishes reminder',
    //html: `<p> Event message is: ${message}. </p><br>`
    html: `<p> Don't forget to do your dishes before going to bed </p><br>`
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Message sent: ' + info.response)
    return info.response
  } catch (e) {
    console.log(e)
  }
  return info.response;
};
