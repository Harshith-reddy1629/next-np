import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "SMTPConnection.gmail.com",
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASS,
    },
  });
  
  const sendMail = async (email: string, subject: string, message: string) => {
    try {
      await transporter.sendMail({
        from: process.env.MY_EMAIL,
        to: email,
        subject: subject,
        text: message,
      });
  
      return true;
    } catch (error) {
      return false;
    }
  };


  export default sendMail
  