import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orgType, orgName, contactName, phone, email, subdomain, notes } = body;

    // To send emails with Gmail, the user needs to provide their App Password in .env.local
    // EMAIL_USER=yusifliqezenfer90@gmail.com
    // EMAIL_PASS=your_app_password
    
    const user = process.env.EMAIL_USER || 'yusifliqezenfer90@gmail.com';
    const pass = process.env.EMAIL_PASS;

    if (!pass) {
      console.warn("EMAIL_PASS is not set in environment variables. Email simulation: Data received successfully:", body);
      // Return success anyway so the frontend flow continues during development
      return NextResponse.json({ success: true, simulated: true });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass,
      },
    });

    const mailOptions = {
      from: user,
      to: 'yusifliqezenfer90@gmail.com', // Always send to this email
      subject: `Yeni Qeydiyyat: ${orgName}`,
      html: `
        <h2>ASHRALI - Yeni Müştəri Qeydiyyatı</h2>
        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td style="background-color: #f1f5f9; font-weight: bold;">Təşkilat Tipi</td>
            <td>${orgType}</td>
          </tr>
          <tr>
            <td style="background-color: #f1f5f9; font-weight: bold;">Təşkilatın Adı</td>
            <td>${orgName}</td>
          </tr>
          <tr>
            <td style="background-color: #f1f5f9; font-weight: bold;">Əlaqəli Şəxs</td>
            <td>${contactName}</td>
          </tr>
          <tr>
            <td style="background-color: #f1f5f9; font-weight: bold;">Telefon Nömrəsi</td>
            <td>${phone}</td>
          </tr>
          <tr>
            <td style="background-color: #f1f5f9; font-weight: bold;">Müştəri Email</td>
            <td>${email}</td>
          </tr>
          <tr>
            <td style="background-color: #f1f5f9; font-weight: bold;">İstənilən Subdomain</td>
            <td>${subdomain}.ashrali.az</td>
          </tr>
          <tr>
            <td style="background-color: #f1f5f9; font-weight: bold;">Əlavə Qeyd</td>
            <td>${notes || '-'}</td>
          </tr>
        </table>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: error.message || 'Email failed to send' }, { status: 500 });
  }
}
