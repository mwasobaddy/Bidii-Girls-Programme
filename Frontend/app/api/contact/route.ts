import { NextResponse } from "next/server";

let nodemailer: any;
try {
  nodemailer = require("nodemailer");
} catch (error) {
  console.warn("Nodemailer not installed. Email sending will not work.");
  nodemailer = null;
}

// Check if environment variables are set
const hasEnvVars =
  process.env.CONTACT_EMAIL_ADDRESS && process.env.CONTACT_EMAIL_PASSWORD;
if (!hasEnvVars) {
  console.warn(
    "Environment variables for email not set. Email sending will not work."
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if nodemailer is available
    if (!nodemailer) {
      console.error(
        "Nodemailer is not installed. Please install it with: npm install nodemailer"
      );
      return NextResponse.json(
        {
          error:
            "Email service not available. Please contact the administrator.",
        },
        { status: 500 }
      );
    }

    // Check if environment variables are set
    if (!hasEnvVars) {
      console.error(
        "Environment variables not set. Please check your .env.local file."
      );
      return NextResponse.json(
        {
          error:
            "Email service not configured. Please contact the administrator.",
        },
        { status: 500 }
      );
    }

    // Create transporter using environment variables
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL_ADDRESS,
        pass: process.env.CONTACT_EMAIL_PASSWORD,
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.CONTACT_EMAIL_ADDRESS,
      to: "support@bidiigirlsprogramme.org",
      subject: `Contact Form Submission: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
      `,
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        error: "Failed to send message: " + (error.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}
