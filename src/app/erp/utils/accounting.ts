
import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';
export interface Posting {
  id: string;
  date: string;
  dt: string; // Debit account (e.g. '221')
  ct: string; // Credit account (e.g. '601')
  amount: number;
  document: string; // e.g. 'Xidmət Aktı #001'
  desc: string; // Description
}

// Initial mock data if localStorage is empty
const MOCK_POSTINGS: Posting[] = [
  // Kassa mədaxil (Satış gəliri): Dt 221 - Ct 601 (Kassaya pul girdi, Gəlir artdı)
  { id: '1', date: new Date().toISOString(), dt: '221', ct: '601', amount: 500, document: 'Kassa mədaxil #001', desc: 'Pasiyent ödənişi (USM)' },
  { id: '2', date: new Date().toISOString(), dt: '221', ct: '601', amount: 1200, document: 'Kassa mədaxil #002', desc: 'Cərrahi əməliyyat ödənişi' },
  
  // Bank mədaxil (Sığorta şirkətindən): Dt 223 - Ct 211 (Bank artdı, Debitor azaldı)
  { id: '3', date: new Date(Date.now() - 86400000).toISOString(), dt: '223', ct: '211', amount: 4500, document: 'Bank çıxarışı #10', desc: 'Sığorta ödənişi daxilolma' },
  
  // Xidmət göstərilib amma sığorta ödəyəcək (Debitor artır): Dt 211 - Ct 601
  { id: '4', date: new Date().toISOString(), dt: '211', ct: '601', amount: 800, document: 'Xidmət Aktı #112', desc: 'Sığortalı xəstə xidməti' },

  // Anbara dərman alışı (Kreditor borc yaranır): Dt 201 - Ct 531
  { id: '5', date: new Date(Date.now() - 172800000).toISOString(), dt: '201', ct: '531', amount: 3000, document: 'Alış fakturası #55', desc: 'Depodan tibbi ləvazimat alışı' },

  // Anbardan material silinməsi (Xərc): Dt 711 - Ct 201
  { id: '6', date: new Date().toISOString(), dt: '711', ct: '201', amount: 400, document: 'Silinmə aktı #01', desc: 'Reanimasiya şöbəsində istifadə' },

  // Kreditor borcun ödənilməsi (Bankdan çıxış): Dt 531 - Ct 223
  { id: '7', date: new Date().toISOString(), dt: '531', ct: '223', amount: 1000, document: 'Bank məxaric #05', desc: 'Təchizatçıya qismən ödəniş' },

  // Maaşların ödənməsi (Kassadan çıxış): Dt 711 - Ct 221
  { id: '8', date: new Date().toISOString(), dt: '711', ct: '221', amount: 600, document: 'Kassa məxaric #003', desc: 'Həkim bonusu ödənişi' },
];

export const getPostings = (): Posting[] => {
  if (typeof window === 'undefined') return [];
  const saved = getAppStorage('erp_postings');
  if (!saved) {
    setAppStorage('erp_postings', JSON.stringify(MOCK_POSTINGS));
    return MOCK_POSTINGS;
  }
  return JSON.parse(saved);
};

export const getTurnover = (postings: Posting[], accountPrefix: string, type: 'dt' | 'ct'): number => {
  return postings
    .filter(p => p[type].startsWith(accountPrefix))
    .reduce((sum, p) => sum + Number(p.amount), 0);
};

export const getBalanceActive = (postings: Posting[], accountPrefix: string): number => {
  // Active accounts normal balance is Debit (e.g. 221, 223, 201, 211)
  // Balance = Dt Turnover - Ct Turnover
  return getTurnover(postings, accountPrefix, 'dt') - getTurnover(postings, accountPrefix, 'ct');
};

export const getBalancePassive = (postings: Posting[], accountPrefix: string): number => {
  // Passive accounts normal balance is Credit (e.g. 531, 601)
  // Balance = Ct Turnover - Dt Turnover
  return getTurnover(postings, accountPrefix, 'ct') - getTurnover(postings, accountPrefix, 'dt');
};

export interface ErpDocument {
  id: string;
  date: string;
  type: string; // 'SERVICE', 'CASH', 'BANK', 'WAREHOUSE'
  name: string; // 'Xidmət Aktı #112', 'Kassa mədaxil #001'
  org: string; // 'Mərkəzi Xəstəxana'
  amount: number;
  status: 'Keçirilib' | 'Qaralama' | 'Silinib';
}

const MOCK_DOCUMENTS: ErpDocument[] = [
  { id: 'd1', date: new Date().toISOString(), type: 'CASH', name: 'Kassa mədaxil #001', org: 'Baş Ofis', amount: 500, status: 'Keçirilib' },
  { id: 'd2', date: new Date().toISOString(), type: 'CASH', name: 'Kassa mədaxil #002', org: 'Poliklinika', amount: 1200, status: 'Keçirilib' },
  { id: 'd3', date: new Date(Date.now() - 86400000).toISOString(), type: 'BANK', name: 'Bank çıxarışı #10', org: 'Baş Ofis', amount: 4500, status: 'Keçirilib' },
  { id: 'd4', date: new Date().toISOString(), type: 'SERVICE', name: 'Xidmət Aktı #112', org: 'Diaqnostika Mərkəzi', amount: 800, status: 'Keçirilib' },
  { id: 'd5', date: new Date(Date.now() - 172800000).toISOString(), type: 'WAREHOUSE', name: 'Alış fakturası #55', org: 'Mərkəzi Anbar', amount: 3000, status: 'Keçirilib' },
  { id: 'd6', date: new Date().toISOString(), type: 'WAREHOUSE', name: 'Silinmə aktı #01', org: 'Reanimasiya', amount: 400, status: 'Keçirilib' },
  { id: 'd7', date: new Date().toISOString(), type: 'BANK', name: 'Bank məxaric #05', org: 'Baş Ofis', amount: 1000, status: 'Keçirilib' },
  { id: 'd8', date: new Date().toISOString(), type: 'CASH', name: 'Kassa məxaric #003', org: 'Baş Ofis', amount: 600, status: 'Keçirilib' },
  { id: 'd9', date: new Date(Date.now() + 86400000).toISOString(), type: 'SERVICE', name: 'Xidmət Aktı #113', org: 'Poliklinika', amount: 120, status: 'Qaralama' },
];

export const getDocuments = (): ErpDocument[] => {
  if (typeof window === 'undefined') return [];
  const saved = getAppStorage('erp_documents');
  if (!saved) {
    setAppStorage('erp_documents', JSON.stringify(MOCK_DOCUMENTS));
    return MOCK_DOCUMENTS;
  }
  return JSON.parse(saved);
};

export const addDocument = (doc: Omit<ErpDocument, 'id'>): ErpDocument => {
  const docs = getDocuments();
  const newDoc = { ...doc, id: 'd' + Date.now() };
  docs.push(newDoc);
  setAppStorage('erp_documents', JSON.stringify(docs));
  return newDoc;
};

export const addPosting = (posting: Omit<Posting, 'id'>): Posting => {
  const postings = getPostings();
  const newPosting = { ...posting, id: 'p' + Date.now() };
  postings.push(newPosting);
  setAppStorage('erp_postings', JSON.stringify(postings));
  return newPosting;
};


