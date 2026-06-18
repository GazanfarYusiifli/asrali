'use client'

import { useState } from 'react';

const TABS = [
  { id: 'general', label: 'Ümumi', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> },
  { id: 'billing', label: 'Ödəniş & Abunəlik', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg> },
  { id: 'team', label: 'Komanda Üzvləri', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
  { id: 'integrations', label: 'İnteqrasiyalar', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> },
  { id: 'notifications', label: 'Bildirişlər', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> }
];

type TeamMember = { id: string; name: string; email: string; role: string; };

const INITIAL_TEAM: TeamMember[] = [
  { id: 'TM-1', name: 'Nihad Əliyev', email: 'nihad@edufinance.az', role: 'Admin (Sahib)' },
  { id: 'TM-2', name: 'Aysel Quliyeva', email: 'aysel@edufinance.az', role: 'Baş Mühasib' },
  { id: 'TM-3', name: 'Ramil Həsənov', email: 'ramil@edufinance.az', role: 'Müəllim / Baxıcı' }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaved, setIsSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Team State
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamForm, setTeamForm] = useState<Partial<TeamMember>>({});

  // States for toggles
  const [toggles, setToggles] = useState({
    whatsapp: true,
    stripe: false,
    googleCal: true,
    emailNotif: true,
    smsNotif: false,
    monthlyReport: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  // Team Functions
  const handleOpenTeamModal = (member?: TeamMember) => {
    if (member) {
      setTeamForm(member);
    } else {
      setTeamForm({ name: '', email: '', role: 'Müəllim / Baxıcı' });
    }
    setIsTeamModalOpen(true);
  };

  const handleSaveTeam = () => {
    if (!teamForm.name || !teamForm.email) return alert('Ad və E-poçt daxil edilməlidir!');
    
    if (teamForm.id) {
      setTeam(team.map(m => m.id === teamForm.id ? teamForm as TeamMember : m));
    } else {
      const newMember: TeamMember = {
        id: `TM-${Date.now()}`,
        name: teamForm.name,
        email: teamForm.email,
        role: teamForm.role || 'Müəllim / Baxıcı'
      };
      setTeam([...team, newMember]);
    }
    setIsTeamModalOpen(false);
  };

  const handleDeleteTeam = (id: string) => {
    if (confirm('Bu üzvü sistemdən silmək istədiyinizə əminsiniz?')) {
      setTeam(team.filter(m => m.id !== id));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Tənzimləmələr</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Sistemin əsas parametrlərini idarə edin</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* SIDEBAR TABS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left', 
                  padding: '1rem 1.25rem', 
                  backgroundColor: isActive ? 'var(--bg-color)' : 'transparent', 
                  color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)', 
                  border: '1px solid',
                  borderColor: isActive ? 'var(--border-color)' : 'transparent',
                  borderRadius: '12px', 
                  fontWeight: isActive ? 700 : 600, 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>
        
        {/* CONTENT AREA */}
        <div className="glass-panel" style={{ padding: '3rem', borderRadius: '24px', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          
          {/* 1. ÜMUMİ TƏNZİMLƏMƏLƏR */}
          {activeTab === 'general' && (
            <form onSubmit={handleSave} style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Ümumi Tənzimləmələr</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '16px', backgroundColor: 'var(--bg-color)', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', overflow: 'hidden' }}>
                    {logoPreview ? <img src={logoPreview} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Şirkət Loqosu</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Tövsiyə edilən ölçü: 256x256px, PNG.</p>
                    <button type="button" onClick={() => setLogoPreview('https://api.dicebear.com/7.x/initials/svg?seed=EF&backgroundColor=4f46e5')} style={{ padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Nümunə Yüklə</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={labelStyle}>Şirkətin Adı</label>
                    <input type="text" defaultValue="EduFinance Academy" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>VÖEN (Vergi Nömrəsi)</label>
                    <input type="text" defaultValue="1405678912" style={inputStyle} />
                  </div>
                </div>
                
                <div>
                  <label style={labelStyle}>Dəstək E-poçtu</label>
                  <input type="email" defaultValue="support@edufinance.az" style={inputStyle} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={labelStyle}>Əsas Valyuta</label>
                    <select style={inputStyle}>
                      <option>AZN (₼)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Saat Qurşağı</label>
                    <select style={inputStyle}>
                      <option>Baku (GMT+4)</option>
                      <option>Istanbul (GMT+3)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '2rem', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {isSaved ? <SuccessMsg /> : <span />}
                <SaveButton />
              </div>
            </form>
          )}

          {/* 2. ÖDƏNİŞ VƏ ABUNƏLİK */}
          {activeTab === 'billing' && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Ödəniş & Abunəlik</h2>
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary-color), #818cf8)', color: 'white' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Pro Plan (İllik)</h3>
                  <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>Növbəti ödəniş: 12 Aprel, 2027</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>1,200 ₼<span style={{ fontSize: '1rem', fontWeight: 500, opacity: 0.8 }}>/il</span></div>
                    <button style={{ padding: '0.6rem 1.25rem', background: 'white', color: 'var(--primary-color)', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Planı Dəyiş</button>
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Ödəniş Üsulları</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ background: '#1e293b', color: 'white', padding: '0.5rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px' }}>VISA</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>Visa ilə bitən: **** 4242</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Müddət: 04/28</div>
                      </div>
                    </div>
                    <button style={{ color: 'var(--primary-color)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Redaktə et</button>
                  </div>
                  <button style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'transparent', border: '1px dashed var(--border-color)', borderRadius: '12px', width: '100%', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}>+ Yeni Kart Əlavə Et</button>
                </div>
              </div>
            </div>
          )}

          {/* 3. KOMANDA ÜZVLƏRİ */}
          {activeTab === 'team' && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Komanda Üzvləri</h2>
                <button onClick={() => handleOpenTeamModal()} style={{ padding: '0.65rem 1.25rem', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '10px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>+ Üzv Dəvət Et</button>
              </div>
              
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {team.map((member) => (
                    <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-color)', transition: 'transform 0.1s' }} className="hover-scale">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{member.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{member.email}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--surface-color)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>{member.role}</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleOpenTeamModal(member)} style={{ color: 'var(--primary-color)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Redaktə</button>
                          {member.role !== 'Admin (Sahib)' && (
                            <button onClick={() => handleDeleteTeam(member.id)} style={{ color: '#ef4444', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Sil</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {team.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Siyahıda heç kim yoxdur.</div>}
                </div>
              </div>
            </div>
          )}

          {/* 4. İNTEQRASİYALAR */}
          {activeTab === 'integrations' && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>İnteqrasiyalar</h2>
              <div style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <IntegrationCard title="WhatsApp Business API" desc="Müştərilərə avtomatik qəbzlər göndərin." icon={<div style={{background:'#25D366', color:'white', padding:'0.5rem', borderRadius:'8px', fontWeight:800}}>WA</div>} active={toggles.whatsapp} onToggle={() => handleToggle('whatsapp')} />
                <IntegrationCard title="Stripe / Bank Kartları" desc="Onlayn ödənişləri birbaşa qəbul edin." icon={<div style={{background:'#635bff', color:'white', padding:'0.5rem', borderRadius:'8px', fontWeight:800}}>St</div>} active={toggles.stripe} onToggle={() => handleToggle('stripe')} />
                <IntegrationCard title="Google Calendar" desc="Dərs cədvəllərini təqvimə sinxronizasiya edin." icon={<div style={{background:'#ea4335', color:'white', padding:'0.5rem', borderRadius:'8px', fontWeight:800}}>GC</div>} active={toggles.googleCal} onToggle={() => handleToggle('googleCal')} />
              </div>
            </div>
          )}

          {/* 5. BİLDİRİŞLƏR */}
          {activeTab === 'notifications' && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Bildiriş Tənzimləmələri</h2>
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <ToggleRow title="Sistem e-poçtları (Məcburi)" desc="Parol sıfırlama, hesab təhlükəsizliyi barədə." active={true} disabled={true} />
                <ToggleRow title="Aylıq Maliyyə Hesabatı" desc="Hər ayın 1-i ümumi gəlir/xərc hesabatını e-poçtla al." active={toggles.monthlyReport} onToggle={() => handleToggle('monthlyReport')} />
                <ToggleRow title="Ödəniş Xatırlatmaları (E-poçt)" desc="Təhsil haqqı gecikən şagirdlər üçün bildiriş." active={toggles.emailNotif} onToggle={() => handleToggle('emailNotif')} />
                <ToggleRow title="SMS Bildirişləri" desc="Sistem yenilikləri barədə telefona mesaj al." active={toggles.smsNotif} onToggle={() => handleToggle('smsNotif')} />
              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* TEAM MODAL */}
      {isTeamModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '450px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>{teamForm.id ? 'Üzvü Redaktə Et' : 'Yeni Üzv Dəvət Et'}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Ad və Soyad</label>
                <input value={teamForm.name || ''} onChange={e => setTeamForm({...teamForm, name: e.target.value})} placeholder="Məs: Əli Vəliyev" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>E-poçt</label>
                <input type="email" value={teamForm.email || ''} onChange={e => setTeamForm({...teamForm, email: e.target.value})} placeholder="eli@edufinance.az" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Vəzifə (Rol)</label>
                <select value={teamForm.role || 'Müəllim / Baxıcı'} onChange={e => setTeamForm({...teamForm, role: e.target.value})} style={inputStyle}>
                  <option value="Admin (Sahib)">Admin (Sahib)</option>
                  <option value="Baş Mühasib">Baş Mühasib</option>
                  <option value="Müəllim / Baxıcı">Müəllim / Baxıcı</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem' }}>
              <button onClick={() => setIsTeamModalOpen(false)} style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>İmtina</button>
              <button onClick={handleSaveTeam} style={{ padding: '0.85rem 2rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>{teamForm.id ? 'Yadda Saxla' : 'Dəvət Göndər'}</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .toggle-switch { width: 44px; height: 24px; background: var(--border-color); border-radius: 12px; position: relative; cursor: pointer; transition: 0.3s; }
        .toggle-switch.active { background: #10b981; }
        .toggle-dot { width: 18px; height: 18px; background: white; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .toggle-switch.active .toggle-dot { left: 23px; }
        .hover-scale:hover { transform: translateY(-2px); box-shadow: var(--shadow-sm); }
      `}} />
    </div>
  );
}

// Helper Components
const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem', outline: 'none' };

const SaveButton = () => (
  <button type="submit" style={{ padding: '0.85rem 2rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>Yadda Saxla</button>
);

const SuccessMsg = () => (
  <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
    Dəyişikliklər Yadda Saxlanıldı!
  </span>
);

const IntegrationCard = ({ title, desc, icon, active, onToggle }: any) => (
  <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '16px', background: 'var(--bg-color)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
      {icon}
      <div className={`toggle-switch ${active ? 'active' : ''}`} onClick={onToggle}><div className="toggle-dot" /></div>
    </div>
    <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{title}</h3>
    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{desc}</p>
  </div>
);

const ToggleRow = ({ title, desc, active, onToggle, disabled }: any) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', opacity: disabled ? 0.6 : 1 }}>
    <div>
      <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{title}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{desc}</p>
    </div>
    <div className={`toggle-switch ${active ? 'active' : ''}`} onClick={disabled ? undefined : onToggle} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}><div className="toggle-dot" /></div>
  </div>
);
