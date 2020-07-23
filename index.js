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
      user: 'jahchuen2@outlook.com', // REPLACE WITH ACTUAL ACCOUNT
      pass: 'testing12345' // The authorization code 邮箱授权码
    }
  })

  const mailOptions = {
    from: 'jahchuen2@outlook.com', // REPLACE WITH ACTUAL ACCOUNT
    to: 'jahchuen2@outlook.com', // REPLACE WITH ACTUAL ACCOUNT
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
