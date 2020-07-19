'use strict';
const nodemailer = require("nodemailer");

exports.main_handler = async (event, context, callback) => {

  let user_name = JSON.parse(event.body).name
	let user_email = JSON.parse(event.body).email
	let user_feedback = JSON.parse(event.body).feedback

  //let user_name = event["pathParameters"]["user_name"];
  //let user_email = event["pathParameters"]["user_email"];
  //let user_feedback = event["pathParameters"]["user_feedback"];
  console.log(user_name, user_email, user_feedback);

  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    //service: 'gmail',
    port: 587,
    tls: {
       ciphers:'SSLv3'
    },
    secure: false, // true for 465, false for other ports
    auth: {
      user: '', // REPLACE WITH ACTUAL ACCOUNT
      pass: '' // The authorization code 邮箱授权码
    }
  })

  const mailOptions = {
    from: '', // REPLACE WITH ACTUAL ACCOUNT
    to: '', // REPLACE WITH ACTUAL ACCOUNT
    subject: 'Customer Feedback Collection',
    html: `<p> New feedback sent from customer: ${user_name}. </p><br>\
    <p>Feedback: ${user_feedback}</p><br>\
    <p>Customer's email address: ${user_email}<p><br>`
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Message sent: ' + info.response)
    return info.response
  } catch (e) {
    console.log(e)
  }
  return [user_name, user_feedback]
}
