import { createClient } from '@supabase/supabase-js';

// Supabase client instance (mock setup for the architecture)
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export type DocumentType = 'PurchaseInvoice' | 'SalesInvoice' | 'CashReceipt' | 'CashPayment' | 'Payroll';

export interface DocumentPostingData {
  document_id: string;
  company_id: string;
  doc_type: DocumentType;
  total_amount: number;
  counterparty_id?: string;
  lines: any[];
}

/**
 * MÜHASİBAT ENGINE (POSTING ENGINE)
 * Sənədlərin statusu "Təsdiqləndi" (Posted) olduqda Jurnal yazılışlarını (Debet/Kredit) yaradan əsas məntiq (1C stili)
 */
export async function postDocument(doc: DocumentPostingData) {
  // 1. Transaction başlatmaq (Supabase RPC ilə tam ACID üçün tövsiyə olunur, lakin burda məntiqi göstəririk)
  
  try {
    // Öncə bu sənədin köhnə yazılışlarını silirik (Re-posting üçün)
    await supabase.from('erp_journal_entries').delete().eq('document_id', doc.document_id);

    // Yeni Jurnal Başlığı Yaradırıq
    const { data: journalEntry, error: jeError } = await supabase.from('erp_journal_entries').insert({
      document_id: doc.document_id,
      company_id: doc.company_id,
      entry_date: new Date().toISOString(),
      description: `${doc.doc_type} üzrə avtomatik yazılış`
    }).select().single();

    if (jeError) throw jeError;

    const entryId = journalEntry.id;
    const entriesToInsert = [];

    // 2. MÜHASİBAT YAZILIŞLARININ (DOUBLE-ENTRY) YARADILMASI
    // Sənəd növünə əsasən hesabların tapılması (Normalda DB-dən id ilə tapılır, burda kodla izah edirik)
    
    if (doc.doc_type === 'PurchaseInvoice') {
      // Alış Fakturası: Debet (201 - Anbar), Kredit (531 - Təchizatçıya borc)
      // Line-by-line yazılışlar (Mallar üzrə analitika)
      for (const line of doc.lines) {
        entriesToInsert.push(
          // DEBET - Mal artdı
          { journal_entry_id: entryId, account_id: 'ACCOUNT_ID_201', is_debit: true, amount: line.total, item_id: line.item_id },
          // KREDİT - Borc artdı
          { journal_entry_id: entryId, account_id: 'ACCOUNT_ID_531', is_debit: false, amount: line.total, counterparty_id: doc.counterparty_id }
        );
      }
    } 
    else if (doc.doc_type === 'SalesInvoice') {
      // Satış Fakturası: Debet (211 - Xəstənin borcu), Kredit (601 - Satış Gəliri)
      for (const line of doc.lines) {
        entriesToInsert.push(
          { journal_entry_id: entryId, account_id: 'ACCOUNT_ID_211', is_debit: true, amount: line.total, counterparty_id: doc.counterparty_id },
          { journal_entry_id: entryId, account_id: 'ACCOUNT_ID_601', is_debit: false, amount: line.total, item_id: line.item_id }
        );
      }
    }
    else if (doc.doc_type === 'CashReceipt') {
      // Mədaxil Orderi: Debet (221 - Kassa), Kredit (211 - Xəstə/Sığorta borcu azaldı)
      entriesToInsert.push(
        { journal_entry_id: entryId, account_id: 'ACCOUNT_ID_221', is_debit: true, amount: doc.total_amount },
        { journal_entry_id: entryId, account_id: 'ACCOUNT_ID_211', is_debit: false, amount: doc.total_amount, counterparty_id: doc.counterparty_id }
      );
    }
    else if (doc.doc_type === 'CashPayment') {
      // Məxaric Orderi (Məs. Təchizatçıya ödəniş): Debet (531), Kredit (221)
      entriesToInsert.push(
        { journal_entry_id: entryId, account_id: 'ACCOUNT_ID_531', is_debit: true, amount: doc.total_amount, counterparty_id: doc.counterparty_id },
        { journal_entry_id: entryId, account_id: 'ACCOUNT_ID_221', is_debit: false, amount: doc.total_amount }
      );
    }

    // 3. Yazılışları bazaya insert etmək
    const { error: linesError } = await supabase.from('erp_journal_lines').insert(entriesToInsert);
    if (linesError) throw linesError;

    // Sənədin statusunu Posted etmək
    await supabase.from('erp_documents').update({ status: 'Posted', posted_at: new Date().toISOString() }).eq('id', doc.document_id);

    return { success: true, message: "Sənəd uğurla mühasibatlığıa işləndi (Posted)." };

  } catch (error) {
    console.error("Posting error:", error);
    return { success: false, error };
  }
}

/**
 * HESABAT ENGINE (TRIAL BALANCE / REGISTERS)
 * Balansın SQL View vasitəsilə və ya RPC ilə birbaşa yoxlanılması
 */
export async function getTrialBalance(companyId: string) {
  // view_trial_balance PostgreSQL-də yaratdığımız View-dur
  const { data, error } = await supabase
    .from('view_trial_balance')
    .select('*')
    .eq('company_id', companyId); // Əgər view-da company_id əlavə olunubsa

  if (error) throw error;
  return data;
}
