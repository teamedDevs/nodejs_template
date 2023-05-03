const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email,
    pass: process.env.email_password
  },
 port: 465,
  secure: true,
  tls: {
    rejectUnauthorized: false
  }
});

exports.sendEmails = async(req,res)=>{
    try{
        const mailOptions = {
            from: process.env.email,
            to: req.body.emails,
            subject: req.body.title,
            html: `<h1>${req.body.title}</h1><p style='font-size: 16px;'>${req.body.message}</p>
            <div style='position: relative; top: 15px;text-align: center;'>
            <button onclick='window.open('#')' style='color: white; background-color: dodgerblue;outline: none; cursor: pointer; padding: 7px 30px; border-radius: 30px;border: none;text-align: center;'>View the venue</button>
            </div>
            `
          };
          
          transporter.sendMail(mailOptions, async function(error, info){
            if (error) {
              console.log(error);
            } else {
      
              console.log('Email sent: ' + info.response);
      
              return res.status(200).send({messageSuccess: "Email sent"})
            }
          });
    }
    catch(error){
        console.log(error);
    }
}