
import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';
// Master Data / Справочники (Kataloqlar) idarəetməsi üçün Util

export interface CatalogItem {
  id: string; // Internal GUID/UUID
  code: string; // 1C Code, e.g. 000001
  name: string; // Adı
  group?: string; // Qrup (Qovluq adı)
  properties?: Record<string, any>; // Digər xüsusiyyətlər (VÖEN, İxtisas və s.)
}

export type CatalogName = 'employees' | 'doctors' | 'services' | 'goods' | 'counterparties' | 'patients' | 'warehouses';

const MOCK_DATA: Record<CatalogName, CatalogItem[]> = {
  employees: [
    { id: 'e1', code: '000001', name: 'Qəzənfər Yusifli', group: 'İdarə heyəti', properties: { role: 'Müdir' } },
    { id: 'e2', code: '000002', name: 'Aygün Məmmədova', group: 'Mühasibatlıq', properties: { role: 'Baş Mühasib' } },
  ],
  doctors: [
    { id: 'doc1', code: 'D00001', name: 'Dr. Əli Əliyev', group: 'Cərrahiyyə', properties: { specialty: 'Ümumi Cərrah' } },
    { id: 'doc2', code: 'D00002', name: 'Dr. Zəhra Rəhimova', group: 'Poliklinika', properties: { specialty: 'Pediatr' } },
  ],
  services: [
    { id: 's1', code: 'S001', name: 'USM (Qarın boşluğu)', group: 'Şüa Diaqnostika', properties: { price: 40 } },
    { id: 's2', code: 'S002', name: 'Qanın ümumi analizi (QÜA)', group: 'Laboratoriya', properties: { price: 15 } },
    { id: 's3', code: 'S003', name: 'Terapevt qəbulu', group: 'Poliklinika', properties: { price: 30 } },
  ],
  goods: [
    { id: 'g1', code: 'M00001', name: 'Şpris 5ml', group: 'Sərf Materialları', properties: { unit: 'ədəd', cost: 0.1 } },
    { id: 'g2', code: 'M00002', name: 'Parasetamol 500mq', group: 'Dərmanlar', properties: { unit: 'qutu', cost: 1.5 } },
    { id: 'g3', code: 'M00003', name: 'Cərrahi Əlcək (L ölçü)', group: 'Sərf Materialları', properties: { unit: 'cüt', cost: 0.8 } },
  ],
  counterparties: [
    { id: 'c1', code: 'K00001', name: 'Avromed MMC', group: 'Təchizatçılar', properties: { voen: '1200000001' } },
    { id: 'c2', code: 'K00002', name: 'Paşa Sığorta ASC', group: 'Sığorta Şirkətləri', properties: { voen: '1400000002' } },
  ],
  patients: [
    { id: 'p1', code: 'P00001', name: 'Tural Hüseynov', group: 'Klinika', properties: { fin: '7ABC123', phone: '050-123-45-67' } },
    { id: 'p2', code: 'P00002', name: 'Leyla Əliyeva', group: 'Poliklinika', properties: { fin: '6XYZ987', phone: '055-987-65-43' } },
  ],
  warehouses: [
    { id: 'w1', code: 'A00001', name: 'Mərkəzi Anbar', group: 'Əsas Anbarlar', properties: { manager: 'Həsən Həsənov' } },
    { id: 'w2', code: 'A00002', name: 'Reanimasiya Deposu', group: 'Şöbə Anbarları', properties: { manager: 'Nərgiz xanım' } },
  ],
};

// Generates a 6-digit code like '000124'
const generateCode = (prefix: string, currentItems: CatalogItem[]) => {
  const num = currentItems.length + 1;
  return prefix + num.toString().padStart(5, '0');
};

export const getCatalog = (catalogName: CatalogName): CatalogItem[] => {
  if (typeof window === 'undefined') return [];
  const key = `erp_catalog_${catalogName}`;
  const saved = getAppStorage(key);
  if (!saved) {
    setAppStorage(key, JSON.stringify(MOCK_DATA[catalogName]));
    return MOCK_DATA[catalogName];
  }
  return JSON.parse(saved);
};

export const addCatalogItem = (catalogName: CatalogName, prefix: string, name: string, group: string, properties: any = {}): CatalogItem => {
  const items = getCatalog(catalogName);
  const newItem: CatalogItem = {
    id: Date.now().toString(),
    code: generateCode(prefix, items),
    name,
    group,
    properties
  };
  items.push(newItem);
  setAppStorage(`erp_catalog_${catalogName}`, JSON.stringify(items));
  return newItem;
};

export const updateCatalogItem = (catalogName: CatalogName, updatedItem: CatalogItem) => {
  const items = getCatalog(catalogName);
  const index = items.findIndex(i => i.id === updatedItem.id);
  if (index > -1) {
    items[index] = updatedItem;
    setAppStorage(`erp_catalog_${catalogName}`, JSON.stringify(items));
  }
};
