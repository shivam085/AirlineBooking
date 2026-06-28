const Mailgen = require('mailgen');
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'SkyBook',
      link: 'http://localhost:5173',
      // Optional logo:
      // logo: 'https://mailgen.js/img/logo.png'
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mail = {
    from: `"SkyBook" <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
    console.log(`Email successfully sent to ${options.email}`);
  } catch (error) {
    console.error('Email service failed silently. Make sure that you have provided your MAILTRAP credentials in the .env file');
    console.error('Error: ', error);
  }
};

const bookingConfirmationMailgenContent = (username, bookingDetails) => {
  return {
    body: {
      name: username,
      intro: 'Your flight booking has been confirmed! Thank you for choosing SkyBook.',
      table: {
        data: [
          {
            Flight: `${bookingDetails.airline} (${bookingDetails.flightNumber})`,
            Route: `${bookingDetails.departure} to ${bookingDetails.arrival}`,
            Date: new Date(bookingDetails.departureTime).toLocaleString(),
            Seats: bookingDetails.seats,
            Amount: `₹${bookingDetails.amount.toLocaleString()}`
          }
        ],
        columns: {
          customWidth: {
            Flight: '20%',
            Route: '20%',
            Date: '25%',
            Seats: '15%',
            Amount: '20%'
          },
          customAlignment: {
            Amount: 'right'
          }
        }
      },
      action: {
        instructions: 'You can view your booking details or manage your trip by visiting your dashboard.',
        button: {
          color: '#3B82F6', // Tailwind blue-500
          text: 'View My Bookings',
          link: 'http://localhost:5173/bookings',
        },
      },
      outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

module.exports = {
  sendEmail,
  bookingConfirmationMailgenContent
};
