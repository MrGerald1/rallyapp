import nodemailer from "nodemailer"

interface WelcomeEmailParams {
  name: string
  email: string
  whatsappLink: string
  blueprintTitle: string
}

export async function sendWelcomeEmail({ name, email, whatsappLink, blueprintTitle }: WelcomeEmailParams) {
  // In a production environment, you would use a proper email service
  // For this MVP, we'll use a test account from Ethereal
  const testAccount = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })

  const mailOptions = {
    from: '"Rally Team" <team@startrally.xyz>',
    to: email,
    subject: `Welcome to the ${blueprintTitle} - Your 26-Day Journey Begins!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #002b5c;">Welcome to Rally's ${blueprintTitle}!</h1>
        <p>Hi ${name},</p>
        <p>We're excited to have you join our 26-Day Idea Launch Blueprint program! You're about to embark on an exciting journey to bring your idea to life.</p>
        
        <h2 style="color: #002b5c;">Next Steps:</h2>
        <ol>
          <li>Join our community group: <a href="${whatsappLink}" target="_blank">Click here to join</a></li>
          <li>Log in to Rally daily to complete your tasks</li>
          <li>Share your progress with the community</li>
          <li>Prepare for weekly check-ins and the final Demo Day</li>
        </ol>
        
        <p>Your first task will be available tomorrow. Get ready to start your journey!</p>
        
        <p>If you have any questions, feel free to reach out to us in the WhatsApp group.</p>
        
        <p>Best regards,<br>The Rally Team</p>
      </div>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Message sent: %s", info.messageId)

    // Use the WHATWG URL API instead of nodemailer.getTestMessageUrl
    // This is where the url.parse() warning was coming from
    const testMessageUrl = new URL(`/message/${info.messageId}`, `https://ethereal.email/message`).toString()

    console.log("Preview URL: %s", testMessageUrl)
    return info
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}
