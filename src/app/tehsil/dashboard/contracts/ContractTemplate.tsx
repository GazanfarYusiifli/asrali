import React from 'react';

type ContractData = {
  id: string;
  date: string;
  studentName: string;
  parentName: string;
  templateType: string;
  amount: string;
  
  // Təşkilat
  companyName?: string;
  companyVoen?: string;
  companyHH?: string;
  companyMH?: string;
  
  // Rəsmi Təsdiq (Sağ yuxarı)
  approvedByRole?: string;
  orderDate?: string;
  orderNumber?: string;
  
  // Valideyn/Şagird
  parentIDCard?: string;
  parentFIN?: string;
  parentPhone?: string;
  parentAddress?: string;
};

// Ay adlarını çevirmək üçün köməkçi funksiya
const formatDateAz = (dateString: string) => {
  if (!dateString) return { day: '____', month: '____________', year: '202__' };
  
  // Əgər format "12 İyun 2026" kimidirsə
  if (dateString.includes(' ')) {
    const parts = dateString.split(' ');
    return { day: parts[0], month: parts[1], year: parts[2]?.replace('-cu', '').replace('-ci', '').replace('il', '').trim() };
  }

  // Əgər format "YYYY-MM-DD" kimidirsə (HTML5 Date Input)
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) throw new Error();
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
    return {
      day: d.getDate().toString().padStart(2, '0'),
      month: months[d.getMonth()],
      year: d.getFullYear().toString()
    };
  } catch (e) {
    return { day: '____', month: '____________', year: '202__' };
  }
};

export default function ContractTemplate({ data, onClose }: { data: ContractData, onClose: () => void }) {
  const companyName = data.companyName || '__________________';
  const companyVoen = data.companyVoen || '__________________';
  const companyHH = data.companyHH || '__________________';
  const companyMH = data.companyMH || '__________________';
  
  const approvedByRole = data.approvedByRole || 'Təhsil Müəssisəsinin Rəhbərliyinin';
  const orderNum = data.orderNumber || '_______';
  
  const parentID = data.parentIDCard || '______________';
  const parentFIN = data.parentFIN || '______________';
  const parentPhone = data.parentPhone || '______________';
  const parentAddress = data.parentAddress || '___________________________';

  const contractDateObj = formatDateAz(data.date);
  const orderDateObj = formatDateAz(data.orderDate || data.date);

  const handlePerfectPrint = () => {
    const content = document.getElementById('printable-contract')?.innerHTML;
    if (!content) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Müqavilə_${data.id}</title>
            <style>
              @page { size: A4; margin: 15mm; }
              body { background-color: white !important; color: black !important; font-family: "Times New Roman", Times, serif; font-size: 11pt; line-height: 1.4; margin: 0; padding: 0; }
              h2 { font-size: 12pt; font-weight: bold; text-align: center; margin-top: 15px; margin-bottom: 10px; }
              p, div, ul, li { margin: 0; padding: 0; }
              .text-justify { text-align: justify; }
              .indent { text-indent: 10mm; }
              .list-container { padding-left: 10mm; margin-bottom: 10mm; list-style-type: none; }
              .list-container li { margin-bottom: 2mm; }
              .bold { font-weight: bold; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }, 250);
    }
  };

  return (
    <div className="contract-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '2rem', overflowY: 'auto'
    }}>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', width: '100%', maxWidth: '210mm', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>📄 Tam Dinamik Müqavilə</div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handlePerfectPrint} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Çap Et (Print)
          </button>
          <button onClick={onClose} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Bağla</button>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white', width: '210mm', minHeight: '297mm', padding: '15mm 20mm',          
        boxSizing: 'border-box', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', color: '#000',
        fontFamily: '"Times New Roman", Times, serif', lineHeight: 1.4, fontSize: '11pt', margin: '0 auto'
      }}>
        
        <div id="printable-contract">
          {/* TƏSDİQ BLOKU - TAM DİNAMİK */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10mm' }}>
            <div style={{ width: '55%', textAlign: 'left', lineHeight: 1.4 }}>
              {approvedByRole}<br/>
              "{orderDateObj.day}" &nbsp;&nbsp;&nbsp;&nbsp;{orderDateObj.month}&nbsp;&nbsp;&nbsp;&nbsp; {orderDateObj.year}-ci il<br/>
              tarixli {orderNum} №-li əmri ilə<br/>
              təsdiq edilmişdir.
            </div>
          </div>

          <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10mm', padding: '0 5mm' }}>
            Təhsil xidmətlərinin göstərilməsi məqsədilə {companyName} və şagirdin qanuni təmsilçisi arasında
            <br/><br/>
            <span style={{ fontSize: '13pt', textTransform: 'uppercase' }}>{data.templateType || 'MÜQAVİLƏ FORMASI'}</span>
            <br/><br/>
            № {data.id}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10mm' }}>
            <div>Bakı şəhəri</div>
            <div>"{contractDateObj.day}" &nbsp;&nbsp;&nbsp;&nbsp;{contractDateObj.month}&nbsp;&nbsp;&nbsp;&nbsp; {contractDateObj.year}-ci il</div>
          </div>

          <h2>1. MÜQAVİLƏNİN TƏRƏFLƏRİ</h2>
          
          <div style={{ textAlign: 'justify', marginBottom: '10mm', lineHeight: '1.8' }}>
            Bir tərəfdən Azərbaycan Respublikasının qanunvericiliyinə uyğun olaraq fəaliyyət göstərən <span className="bold">{companyName}</span> (bundan sonra - Müəssisə), 
            digər tərəfdən şagird <span className="bold">{data.studentName || '__________________'}</span>-ın qanuni təmsilçisi (valideyni/qəyyumu)
            
            <div style={{ textAlign: 'center', marginTop: '3mm', marginBottom: '3mm' }}>
              <div style={{ borderBottom: '1px solid black', display: 'inline-block', width: '80%', paddingBottom: '2px', fontWeight: 'bold' }}>
                {data.parentName || '_________________________________'}
              </div>
              <div style={{ fontSize: '9pt', marginTop: '2px' }}>(soyadı, adı, atasının adı)</div>
            </div>
            
            şəxsində təmsil olunan Valideyn arasında bu Müqavilə aşağıdakı şərtlərlə bağlandı.
          </div>

          <h2>2. MÜQAVİLƏNİN PREDMETİ</h2>
          <div className="text-justify indent" style={{ marginBottom: '10mm' }}>
            2.1. Bu müqaviləyə əsasən Müəssisə şagirdə mövcud tədris planlarına və proqramlarına uyğun olaraq müvafiq fənlər üzrə təhsil xidmətləri göstərməyi, Valideyn isə göstərilən xidmətlərin müqabilində müəyyən olunmuş <span className="bold">{data.amount || '_________'}</span> məbləğində təhsil haqqını tam və vaxtında ödəməyi öhdəsinə götürür.
          </div>

          <h2>3. TƏRƏFLƏRİN ÖHDƏLİKLƏRİ VƏ HÜQUQLARI</h2>
          
          <div className="bold" style={{ marginBottom: '2mm' }}>3.1. Müəssisənin hüquq və öhdəlikləri:</div>
          <ul className="text-justify list-container">
            <li>3.1.1. Tədris prosesini yüksək keyfiyyətlə, təsdiq olunmuş dövlət və daxili proqramlara uyğun təşkil etmək;</li>
            <li>3.1.2. Şagirdi zəruri tədris materialları və təhlükəsiz təhsil mühiti ilə təmin etmək;</li>
            <li>3.1.3. Şagirdin tədris nailiyyətləri barədə Valideyni mütəmadi məlumatlandırmaq;</li>
            <li>3.1.4. Şagird daxili qaydaları mütəmadi pozduqda tədris prosesindən kənarlaşdırmaq.</li>
          </ul>

          <div className="bold" style={{ marginBottom: '2mm' }}>3.2. Valideynin hüquq və öhdəlikləri:</div>
          <ul className="text-justify list-container">
            <li>3.2.1. Təhsil haqqını (<span className="bold">{data.amount || '_________'}</span>) tam ödəmək;</li>
            <li>3.2.2. Şagirdin nizam-intizam qaydalarına riayət etməsinə nəzarət etmək;</li>
            <li>3.2.3. Dərsdə iştirak edə bilməyəcəyi halda öncədən xəbərdarlıq etmək;</li>
            <li>3.2.4. Müəssisənin əmlakına zərər vurulduqda zərəri tam ödəmək.</li>
          </ul>

          <h2>4. ÖDƏNİŞ ŞƏRTLƏRİ VƏ QAYDALARI</h2>
          <div className="text-justify indent" style={{ marginBottom: '10mm' }}>
            4.1. Təhsil xidmətlərinin ümumi dəyəri <span className="bold">{data.amount || '_________'}</span> təşkil edir.<br/>
            4.2. Ödənişlər nağd kassa və ya bank hesabına köçürmə yolu ilə həyata keçirilir.<br/>
            4.3. Ödəniş tarixi 5 iş günündən çox gecikdirilərsə, dərslər dayandırıla bilər.<br/>
            4.4. <span className="bold">Geri Ödəniş (Refund):</span> Təhsil haqqı ödənildikdən sonra məbləğ geri qaytarılmır, yalnız transfer edilə bilər.
          </div>

          <h2>5. MÜQAVİLƏNİN QÜVVƏDƏ OLMA MÜDDƏTİ VƏ LƏĞVİ</h2>
          <div className="text-justify indent" style={{ marginBottom: '10mm' }}>
            5.1. Müqavilə imzalandığı gündən tədris dövrü bitənədək qüvvədə qalır.<br/>
            5.2. Müqaviləyə aşağıdakı hallarda xitam verilə bilər: Valideyn ödənişi 2 ay gecikdirdikdə; Şagird xəbərdarlıqsız 3 dərsdə iştirak etmədikdə; Şagird qaydaları kobud pozduqda.
          </div>

          <h2>6. FORS-MAJOR</h2>
          <div className="text-justify indent" style={{ marginBottom: '10mm' }}>
            6.1. Təbii fəlakətlər, müharibə və s. fors-major hallarda tərəflər məsuliyyətdən azad olunurlar.
          </div>

          <h2>7. TƏRƏFLƏRİN REKVİZİTLƏRİ VƏ İMZALARI</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10mm', marginTop: '10px' }}>
            <div style={{ width: '45%' }}>
              <div className="bold" style={{ borderBottom: '1px solid #000', paddingBottom: '2mm', marginBottom: '3mm' }}>TƏHSİL MÜƏSSİSƏSİ:</div>
              <div style={{ marginBottom: '1mm' }}><span className="bold">{companyName}</span></div>
              <div style={{ marginBottom: '1mm' }}>VÖEN: {companyVoen}</div>
              <div style={{ marginBottom: '1mm' }}>H/H: {companyHH}</div>
              <div style={{ marginBottom: '1mm' }}>M/H: {companyMH}</div>
              
              <div style={{ marginTop: '15mm' }}>Möhür / İmza: __________________</div>
            </div>
            
            <div style={{ width: '45%' }}>
              <div className="bold" style={{ borderBottom: '1px solid #000', paddingBottom: '2mm', marginBottom: '3mm' }}>VALİDEYN (QƏYYUM):</div>
              <div style={{ marginBottom: '1mm' }}><span className="bold">{data.parentName || '__________________'}</span></div>
              <div style={{ marginBottom: '1mm' }}>Şəxs. vəsiqəsi: {parentID}</div>
              <div style={{ marginBottom: '1mm' }}>FİN Kod: {parentFIN}</div>
              <div style={{ marginBottom: '1mm' }}>Ünvan: {parentAddress}</div>
              <div style={{ marginBottom: '1mm' }}>Əlaqə: {parentPhone}</div>
              
              <div style={{ marginTop: '15mm' }}>İmza: __________________</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
