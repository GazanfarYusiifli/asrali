import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Check if credentials exist
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json({ 
        success: false, 
        message: 'E-poçt göndərilməsi üçün arxa planda SMTP parametrləri (.env.local) quraşdırılmayıb.' 
      }, { status: 500 });
    }

    // Configure the transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465', 
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS, 
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="text-align: center; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Üzləşmə Tələbi</h2>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: bold; color: #1e293b;">
          <span>Hörmətli ${data.hesapAdi},</span>
          <span>Tarix: ${data.gonderildigiTarih}</span>
        </div>
        
        <p style="line-height: 1.6; color: #334155;">
          <strong>${data.donem}</strong> dövrü üzrə üzləşmə rəqəmləri aşağıda təqdim edilmişdir. 
          Üzləşib-üzləşmədiyimizi bildirməyinizi, üzləşmədiyimiz təqdirdə cari hesab çıxarışınızı bizə göndərməyinizi xahiş edirik.
        </p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #cbd5e1; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #475569; font-size: 16px;">Maliyyə Rəqəmləri</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 5px 0; border-bottom: 1px dashed #cbd5e1;"><strong>Alış:</strong> ${data.alis?.kdvD} AZN (ƏDV Daxil) / ${data.alis?.adet} Ədəd</li>
            <li style="padding: 5px 0; border-bottom: 1px dashed #cbd5e1;"><strong>Alış Qaytarma:</strong> ${data.alisIade?.kdvD} AZN (ƏDV Daxil) / ${data.alisIade?.adet} Ədəd</li>
            <li style="padding: 5px 0; border-bottom: 1px dashed #cbd5e1;"><strong>Satış:</strong> ${data.satis?.kdvD} AZN (ƏDV Daxil) / ${data.satis?.adet} Ədəd</li>
            <li style="padding: 5px 0;"><strong>Satış Qaytarma:</strong> ${data.satisIade?.kdvD} AZN (ƏDV Daxil) / ${data.satisIade?.adet} Ədəd</li>
          </ul>
        </div>

        ${data.notlar ? `
        <div style="background-color: #fffbeb; padding: 15px; border-radius: 6px; border: 1px solid #fde68a; margin-bottom: 20px;">
          <strong>Qeyd:</strong> ${data.notlar}
        </div>
        ` : ''}

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 30px;" />
        <p style="font-size: 12px; color: #64748b; line-height: 1.5; text-align: justify;">
          Üzləşmə barədə bir ay ərzində məlumat vermədiyiniz təqdirdə qanunvericiliyə əsasən üzləşmiş sayılacağımızı xatırladırıq.<br/>
          Səhvlər və unudulmuş hallar istisnadır.<br/>
          Bu üzləşmə məktubu elektron formada avtomatik olaraq göndərilmişdir.
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"ERP Sistemi" <${process.env.SMTP_USER}>`, 
      to: data.mailAdresi,
      subject: `Üzləşmə Tələbi - ${data.donem}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Email gonderilmedi:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
