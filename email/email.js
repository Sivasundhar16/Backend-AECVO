import { createTransport } from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
  const transport = createTransport({
    host: process.env.TEST_EMAIL_HOST,
    port: process.env.TEST_EMAIL_POST,
    auth: {
      user: process.env.TEST_EMAIL_USERNAME,
      pass: process.env.TEST_PASSWORD,
    },

    // host: process.env.HOST,
    // port: process.env.PORT || 587,
    // auth: {
    //   user: process.env.USER,
    //   pass: process.env.PASSWORD,
    // },
  });

  const mailOptions = {
    from: '"Hi" <aevoc@gmail.com>',
    to: email,
    subject: subject,
    text: message,
  };

  await transport.sendMail(mailOptions);
  console.log("message sent");
};

export default sendEmail;

// import dotenv from "dotenv";
// dotenv.config();

// const transporter = createTransport({
//   host: "smtp.resend.com",
//   port: parseInt(465, 10),
//   secure: false,
//   auth: {
//     user: "resend",
//     pass: "re_gR4kFRkf_M5vswBL8SkjDZEKyKGNRgCLF",
//   },
// });

// async function main() {
//   try {
//     const info = await transporter.sendMail({
//       from: '"Test" <your-email@gmail.com>',
//       to: "recipient-email@gmail.com",
//       subject: "Hello",
//       text: "Hello World?",
//       html: "<h1>FOR TESTING</h1>",
//     });
//     console.log("Message sent:", info.messageId);
//   } catch (error) {
//     console.error("Error occurred:", error);
//   }
// }

// main();

//transpoter
//email option
//actual send email
