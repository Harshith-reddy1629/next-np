import nodemailer from "nodemailer";

type mailTypes = "Verify" | "Resend" | "ForgotPassword";

const transporter = nodemailer.createTransport({
  host: "SMTPConnection.gmail.com",
  service: "gmail",
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASS,
  },
});

const baseUrl = "http://localhost:3000/api";

const mailData = (mailType: mailTypes, name: string, id: string) => {
  if (mailType === "ForgotPassword") {
    return {
      subject: "Reset Password",
      message: `Hi ${name}, Click on this link to reset your password ${
        baseUrl + id
      }`,
    };
  } else {
    return {
      subject: "Please verify your email address",
      message: `Hi ${name}, Click on this link to verify your mail ${
        baseUrl + "/verify/" + id
      }`,
    };
  }
};

const sendMail = async (user: any, mailType: mailTypes) => {
  try {
    const { subject, message } = mailData(
      mailType,
      user.name,
      user.verificationId
    );

    await transporter.sendMail({
      from: process.env.MY_EMAIL,
      to: user.email,
      subject: subject,
      text: message,
    });

    return;
  } catch (error: any) {
    throw { error: error.message };
  }
};

export default sendMail;
