'use strict';
const nodemailer = require("nodemailer");

exports.main_handler = async (event, context, callback) => {
  console.log(event);
  let user_name = event["pathParameters"]["user_name"];
  let user_email = event["pathParameters"]["user_email"];
  let user_feedback = event["pathParameters"]["user_feedback"];
  console.log(user_name, user_email, user_feedback);
  // Put the white spaces back
  user_name = user_name.replace(/%20/g, ' ');
  user_feedback = user_feedback.replace(/%20/g, ' ');

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: 'gmail',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'jahchuen2@gmail.com', // REPLACE WITH ACTUAL ACCOUNT
      pass: '' // The authorization code 邮箱授权码
    }
  })

  // This is just a default testing script. Change to event data
  //let cmqInfo = {publishTime: "9:00am", topicName: "Testing", msgBody: "Test script"}

  const mailOptions = {
    from: 'jahchuen2@gmail.com',
    to: 'jahchuen2@gmail.com',
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
  return [user_name, feedback]
}
