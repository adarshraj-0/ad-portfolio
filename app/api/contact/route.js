import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { isValidEmail } from '@/utils/check-email';

// Helper function to send an optional notification via Telegram if configured
async function sendTelegramMessage(token, chat_id, message) {
  if (!token || !chat_id) return false;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await axios.post(url, {
      text: message,
      chat_id,
    });
    return res.data?.ok;
  } catch (error) {
    console.warn('Telegram notification skipped or failed:', error.response?.data?.description || error.message);
    return false;
  }
}

// HTML email template
const generateEmailTemplate = (name, email, userMessage) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 24px; background-color: #f4f4f7;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 28px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #0f172a; margin-top: 0; padding-bottom: 12px; border-bottom: 2px solid #16f2b3;">New Portfolio Contact Message</h2>
      <p style="margin: 12px 0;"><strong>Sender Name:</strong> ${name}</p>
      <p style="margin: 12px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
      <p style="margin: 16px 0 8px;"><strong>Message:</strong></p>
      <div style="background-color: #f8fafc; border-left: 4px solid #16f2b3; padding: 14px; margin: 8px 0; border-radius: 4px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #1e293b;">${userMessage}</div>
      <p style="font-size: 12px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
        This email was sent from your developer portfolio contact form. You can reply directly to this email to contact <strong>${name}</strong> (${email}).
      </p>
    </div>
  </div>
`;

export async function POST(request) {
  try {
    const payload = await request.json();
    const { name, email, message: userMessage } = payload || {};

    // 1. Validation of inputs
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Name is required.',
      }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email.trim())) {
      return NextResponse.json({
        success: false,
        message: 'A valid email address is required.',
      }, { status: 400 });
    }

    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Message content is required.',
      }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = userMessage.trim();

    // 2. Validate environment configuration
    const emailAddress = process.env.EMAIL_ADDRESS || 'adarshraj8849@gmail.com';
    const emailPassword = process.env.GMAIL_PASSKEY;

    if (!emailAddress || !emailPassword) {
      console.error('SMTP Error: EMAIL_ADDRESS or GMAIL_PASSKEY is not configured in environment variables.');
      return NextResponse.json({
        success: false,
        message: 'Email service is currently unconfigured. Please configure EMAIL_ADDRESS and GMAIL_PASSKEY in your environment variables.',
      }, { status: 500 });
    }

    // 3. Configure Nodemailer with Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailAddress,
        pass: emailPassword,
      },
    });

    // 4. Setup mail options with visitor's email as replyTo
    const mailOptions = {
      from: `"${trimmedName} (via Portfolio)" <${emailAddress}>`,
      to: 'adarshraj8849@gmail.com',
      replyTo: trimmedEmail,
      subject: `New Message from ${trimmedName} - Developer Portfolio`,
      text: `New message from ${trimmedName}\nEmail: ${trimmedEmail}\n\nMessage:\n${trimmedMessage}\n\n(Reply directly to this email to respond to ${trimmedEmail})`,
      html: generateEmailTemplate(trimmedName, trimmedEmail, trimmedMessage),
    };

    // 5. Send email and verify confirmation from SMTP server
    const info = await transporter.sendMail(mailOptions);

    if (!info || !info.messageId) {
      return NextResponse.json({
        success: false,
        message: 'Email delivery could not be confirmed by the mail server.',
      }, { status: 502 });
    }

    // 6. Optional: Send Telegram notification if configured (non-blocking)
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    if (telegramToken && telegramChatId) {
      const telegramText = `📬 New Portfolio Message\n\nFrom: ${trimmedName}\nEmail: ${trimmedEmail}\n\nMessage:\n${trimmedMessage}`;
      sendTelegramMessage(telegramToken, telegramChatId, telegramText).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully! I will get back to you soon.',
      messageId: info.messageId,
    }, { status: 200 });

  } catch (error) {
    console.error('Contact API Error:', error);

    // Provide friendly error messages for common Gmail authentication issues
    let clientMessage = 'Failed to send message. Please try again later.';
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      clientMessage = 'Email authentication failed. Please verify your Gmail address and 16-character App Password.';
    } else if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT') {
      clientMessage = 'Connection to mail server timed out. Please try again.';
    }

    return NextResponse.json({
      success: false,
      message: clientMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}
