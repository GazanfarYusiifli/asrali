'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { User, CalendarDays, Contact, Phone, Mail, Hospital, Building, Stethoscope, Microscope, Hourglass } from 'lucide-react';

type Tab = 'personal' | 'education' | 'schedule' | 'records' | 'financials';

function DoctorProfileContent() {
  const { role } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as Tab;

  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [status, setStatus] = useState<'Aktiv' | 'Məzuniyyət'>('Aktiv');

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Həkimin Məlumatları (Mock Data)
  const doctor = {
    name: "Dr. Cavid Əliyev",
    specialty: "Kardioloq",
    subSpecialty: "İnvaziv Kardiologiya",
    experience: 12,
    department: "Kardiologiya",
    gender: "Kişi",
    dob: "15.04.1985",
    phone: "+994 (50) 555-11-22",
    email: "cavid.aliyev@mederp.az",
    university: "Azərbaycan Tibb Universiteti",
    specialization: "Ege Universiteti, Türkiyə",
    license: "AZ-MD-2023-089912",
    rating: 4.8,
    reviews: 124
  };

  const [todayAppointments, setTodayAppointments] = useState([
    { id: 1, time: '10:00', patient: 'Aysel Məmmədova', type: 'İlkin Müayinə', status: 'Gözləyir' },
    { id: 2, time: '11:30', patient: 'Rəşad Quliyev', type: 'Təkrar Baxış', status: 'Tamamlandı' },
    { id: 3, time: '14:00', patient: 'Nigar Həsənova', type: 'EKQ / ExoKQ', status: 'Gözləyir' },
  ]);

  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState([
    { id: 1, day: 'Bazar Ertəsi', time: '09:00 - 16:00', breakTime: '13:00 - 14:00', type: 'work' },
    { id: 2, day: 'Çərşənbə Axşamı', time: '09:00 - 14:00', breakTime: '12:00 - 13:00', type: 'work' },
    { id: 3, day: 'Çərşənbə', time: '12:00 - 18:00', breakTime: '15:00 - 16:00', type: 'work' },
    { id: 4, day: 'Cüməşənbə', time: '-', breakTime: '-', type: 'off' },
    { id: 5, day: 'Cümə', time: '09:00 - 15:00', breakTime: '12:30 - 13:30', type: 'work' },
    { id: 6, day: 'Şənbə / Bazar', time: 'İstirahət Günü', breakTime: '-', type: 'off' },
  ]);

  const handleScheduleChange = (id: number, field: string, value: string) => {
    setWeeklySchedule(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const [patientRecords, setPatientRecords] = useState([
    { id: 'REC-001', date: '10.06.2026', patient: 'Əli Vəliyev', diagnosis: 'Arterial Hipertenziya', treatment: 'Dərman müalicəsi və pəhriz', prescription: 'Concor 5mg 1x1' },
    { id: 'REC-002', date: '08.06.2026', patient: 'Lalə Rzayeva', diagnosis: 'Ürək Çatışmazlığı (I dərəcə)', treatment: 'Stasionar nəzarət', prescription: 'Verospiron 25mg 1x1' },
  ]);

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [newRecordData, setNewRecordData] = useState({ patient: '', diagnosis: '', treatment: '', prescription: '' });

  const handleAddRecord = () => {
    if(!newRecordData.patient || !newRecordData.diagnosis) {
      alert("Zəhmət olmasa pasiyent adı və diaqnozu daxil edin.");
      return;
    }
    const newRecord = {
      id: `REC-00${patientRecords.length + 1}`,
      date: new Date().toLocaleDateString('az-AZ'),
      patient: newRecordData.patient,
      diagnosis: newRecordData.diagnosis,
      treatment: newRecordData.treatment,
      prescription: newRecordData.prescription
    };
    
    setPatientRecords([newRecord, ...patientRecords]);
    setIsRecordModalOpen(false);
    setNewRecordData({ patient: '', diagnosis: '', treatment: '', prescription: '' });
    
    // Simulate forwarding to patient
    setTimeout(() => {
      alert(`✅ Tibbi qeyd və e-Resept avtomatik olaraq ${newRecord.patient} adlı pasiyentin qeydiyyatdakı nömrəsinə (SMS / WhatsApp) yönləndirildi!`);
    }, 500);
  };

  const handleCompleteAppointment = (id: number) => {
    setTodayAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'Tamamlandı' } : app
    ));
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      
      {/* Əsas Panel: Məzmun Bloku */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Salamlama - Yalnız Şəxsi səhifədə görünsün */}
        {activeTab === 'personal' && (
          <div className="glass-panel" style={{ padding: '1.5rem 2rem', borderRadius: '24px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Salam, {doctor.name} 👋</h1>
            <p style={{ color: 'var(--text-secondary)' }}>İş qrafikinizə, xəstə qeydlərinə və gəlirlərinizə buradan nəzarət edə bilərsiniz.</p>
          </div>
        )}

        {/* Məzmun Bloku */}
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', minHeight: '500px' }}>
          
          {/* TAB 1: Şəxsi və Peşəkar */}
          {activeTab === 'personal' && (
            <div className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem', backgroundColor: 'var(--bg-color)', padding: '2rem', borderRadius: '20px' }}>
                <div style={{ 
                  width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800,
                  border: '4px solid var(--surface-color)', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)'
                }}>
                  {doctor.name.charAt(4)}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>{doctor.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <p style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{doctor.specialty}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
                      <span>⭐ {doctor.rating}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>({doctor.reviews} rəy)</span>
                    </div>
                  </div>
                </div>
                <div style={{ width: '280px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Hazırkı Status (Qeydiyyat üçün)
                  </label>
                  <select 
                    value={status} onChange={(e) => setStatus(e.target.value as any)}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: `1px solid ${status === 'Aktiv' ? 'var(--primary-color)' : '#ef4444'}`, backgroundColor: status === 'Aktiv' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', color: status === 'Aktiv' ? 'var(--primary-color)' : '#ef4444', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="Aktiv">🟢 Qəbul Aktivdir</option>
                    <option value="Məzuniyyət">🔴 Məzuniyyətdə / Qəbul Yoxdur</option>
                  </select>
                  {status === 'Məzuniyyət' && (
                    <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem', lineHeight: 1.4 }}>
                      Qeydiyyatçı sizə yeni pasiyent randevusu yaza bilməyəcək.
                    </p>
                  )}
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Ətraflı Məlumatlar</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                
                {/* Şəxsi Məlumatlar Kartı */}
                <div style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={20} /> Şəxsi Məlumatlar
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CalendarDays size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Doğum Tarixi</div>
                        <div style={{ fontWeight: 700 }}>{doctor.dob}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Contact size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Cins</div>
                        <div style={{ fontWeight: 700 }}>{doctor.gender}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Phone size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Əlaqə Nömrəsi</div>
                        <div style={{ fontWeight: 700 }}>{doctor.phone}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Mail size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Elektron Poçt (Email)</div>
                        <div style={{ fontWeight: 700 }}>{doctor.email}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Peşəkar Məlumatlar Kartı */}
                <div style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Hospital size={20} /> Peşəkar Məlumatlar
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Şöbə</div>
                        <div style={{ fontWeight: 700 }}>{doctor.department}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Stethoscope size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>İxtisas</div>
                        <div style={{ fontWeight: 700 }}>{doctor.specialty}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Microscope size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Alt İxtisas</div>
                        <div style={{ fontWeight: 700 }}>{doctor.subSpecialty}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Hourglass size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>İş Təcrübəsi</div>
                        <div style={{ fontWeight: 700 }}>{doctor.experience} il</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: Təhsil */}
          {activeTab === 'education' && (
            <div className="fade-in">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Təhsil və Lisenziya Təsdiqləri</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🎓</div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>Baza Tibb Təhsili</div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{doctor.university}</div>
                  </div>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🔬</div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>İxtisaslaşma (Rezidentura)</div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{doctor.specialization}</div>
                  </div>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', gap: '1.25rem', alignItems: 'center', gridColumn: 'span 2' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📜</div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>Səhiyyə Nazirliyi Təsdiqi</div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Dövlət Lisenziyası</div>
                    </div>
                    <span style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '10px', fontWeight: 800, letterSpacing: '1px' }}>{doctor.license}</span>
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Sertifikatlar və Kurslar</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', backgroundColor: 'var(--bg-color)', borderRadius: '16px', borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px' }}>🏆</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Avropa Kardiologiya Cəmiyyəti (ESC) Beynəlxalq Konqresi</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>İştirakçı / Nümayəndə</div>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--text-secondary)' }}>2025</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', backgroundColor: 'var(--bg-color)', borderRadius: '16px', borderLeft: '4px solid #3b82f6' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px' }}>🎖️</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Mürəkkəb Koronar Müdaxilələr Kursu</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Praktiki İştirakçı (İstanbul)</div>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--text-secondary)' }}>2024</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Qrafik və Randevular */}
          {activeTab === 'schedule' && (
            <div className="fade-in">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem' }}>
                
                {/* İş Qrafiki */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)' }}>Həftəlik İş Qrafiki</h3>
                    <button 
                      onClick={() => setIsEditingSchedule(!isEditingSchedule)}
                      style={{ padding: '0.4rem 0.8rem', backgroundColor: isEditingSchedule ? '#10b981' : 'var(--bg-color)', color: isEditingSchedule ? 'white' : 'var(--text-primary)', border: `1px solid ${isEditingSchedule ? '#10b981' : 'var(--border-color)'}`, borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s' }}
                    >
                      {isEditingSchedule ? 'Yadda Saxla' : 'Tənzimlə'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {weeklySchedule.map((item) => (
                      <div key={item.id} style={{ 
                        display: 'flex', flexDirection: 'column', gap: '0.5rem', 
                        padding: '1rem 1.25rem', borderRadius: '16px', 
                        backgroundColor: item.type === 'work' ? 'var(--bg-color)' : 'rgba(239, 68, 68, 0.05)',
                        border: `1px solid ${item.type === 'work' ? 'var(--border-color)' : 'rgba(239, 68, 68, 0.1)'}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ 
                              width: '12px', height: '12px', borderRadius: '50%', 
                              backgroundColor: item.type === 'work' ? '#10b981' : '#ef4444' 
                            }}></span>
                            <span style={{ fontWeight: 600, color: item.type === 'work' ? 'var(--text-primary)' : '#ef4444' }}>{item.day}</span>
                          </div>
                          
                          {isEditingSchedule ? (
                            <input 
                              type="text" 
                              value={item.time} 
                              onChange={(e) => handleScheduleChange(item.id, 'time', e.target.value)}
                              style={{ width: '120px', padding: '0.3rem 0.6rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, textAlign: 'right', outline: 'none' }}
                            />
                          ) : (
                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: item.type === 'work' ? 'var(--primary-color)' : '#ef4444' }}>
                              {item.time}
                            </div>
                          )}
                        </div>

                        {/* Nahar (Abed) fasiləsi hissəsi */}
                        {item.type === 'work' && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '1.75rem', marginTop: '0.25rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>☕ Nahar Fasiləsi:</span>
                            {isEditingSchedule ? (
                              <input 
                                type="text" 
                                value={item.breakTime} 
                                onChange={(e) => handleScheduleChange(item.id, 'breakTime', e.target.value)}
                                style={{ width: '100px', padding: '0.2rem 0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, textAlign: 'right', outline: 'none' }}
                              />
                            ) : (
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>{item.breakTime}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Randevular (Timeline Design) */}
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Bugünkü Randevular (Gündəlik)</h3>
                  <div style={{ position: 'relative', paddingLeft: '1rem' }}>
                    <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '0', width: '2px', backgroundColor: 'var(--border-color)', borderRadius: '2px' }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {todayAppointments.map(app => (
                        <div key={app.id} style={{ position: 'relative', paddingLeft: '2rem' }}>
                          <div style={{ 
                            position: 'absolute', left: '-21px', top: '24px', width: '12px', height: '12px', 
                            borderRadius: '50%', backgroundColor: app.status === 'Tamamlandı' ? '#10b981' : 'var(--bg-color)', 
                            border: `3px solid ${app.status === 'Tamamlandı' ? '#10b981' : '#3b82f6'}`,
                            boxShadow: `0 0 0 4px var(--surface-color)`
                          }}></div>
                          <div style={{ 
                            padding: '1.5rem', 
                            backgroundColor: 'var(--bg-color)', 
                            borderRadius: '20px',
                            boxShadow: app.status === 'Gözləyir' ? '0 10px 25px rgba(0,0,0,0.05)' : 'none',
                            border: `1px solid ${app.status === 'Gözləyir' ? 'rgba(59, 130, 246, 0.2)' : 'var(--border-color)'}`,
                            transition: 'all 0.3s'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ padding: '0.4rem 0.8rem', backgroundColor: 'var(--surface-color)', borderRadius: '10px', fontWeight: 800, color: 'var(--primary-color)', fontSize: '0.9rem', border: '1px solid var(--border-color)' }}>{app.time}</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.6rem', borderRadius: '8px', backgroundColor: app.status === 'Tamamlandı' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: app.status === 'Tamamlandı' ? '#10b981' : '#3b82f6' }}>
                                  {app.status === 'Gözləyir' ? '⏳ Gözləyir' : '✅ Tamamlandı'}
                                </span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                              <div>
                                <div style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.25rem' }}>{app.patient}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-secondary)' }}></span>
                                  {app.type}
                                </div>
                              </div>
                              {app.status === 'Gözləyir' && (
                                <button 
                                  onClick={() => handleCompleteAppointment(app.id)}
                                  style={{ padding: '0.6rem 1.25rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
                                >
                                  Qəbulu Tamamla
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: Xəstə Qeydləri */}
          {activeTab === 'records' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)' }}>Xəstə Tarixçəsi və Qeydlər</h3>
                <button 
                  onClick={() => setIsRecordModalOpen(true)}
                  style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
                >
                  + Yeni Tibbi Qeyd
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {patientRecords.map(rec => (
                  <div key={rec.id} className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', transition: '0.3s' }}>
                    
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-color)', border: '2px solid var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-color)' }}>
                          {rec.patient.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{rec.patient}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Pasiyent ID: {rec.id}</div>
                        </div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem' }}>
                        📅 {rec.date}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.25rem', borderRadius: '16px', borderLeft: '4px solid #ef4444' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>Qoyulmuş Diaqnoz</div>
                        <div style={{ fontWeight: 800, color: '#ef4444', fontSize: '1.1rem' }}>{rec.diagnosis}</div>
                      </div>
                      
                      <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.25rem', borderRadius: '16px', borderLeft: '4px solid #f59e0b' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>Təyin Edilmiş Müalicə</div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{rec.treatment}</div>
                      </div>
                      
                      <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.2rem' }}>💊</span> Elektron Resept (e-Resept)
                        </div>
                        <div style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '1.1rem' }}>{rec.prescription}</div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Maliyyə */}
          {activeTab === 'financials' && (
            <div className="fade-in">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Maliyyə İcmalı və Fəaliyyət Reytinqi</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                
                {/* Gəlir Kartı */}
                <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', borderRadius: '24px', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: '-10%', top: '-10%', fontSize: '8rem', opacity: 0.1 }}>💰</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.9, marginBottom: '0.5rem' }}>Bu Aykı Gəlir (Xalis)</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>3,450.00 ₼</div>
                  <div style={{ marginTop: '1rem', fontSize: '0.8rem', padding: '0.3rem 0.6rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'inline-block', fontWeight: 600 }}>+12% (Keçən aya nisbətən)</div>
                </div>

                {/* Xəstə Sayı */}
                <div style={{ padding: '2rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '24px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>Qəbul Edilən Xəstə (Aylıq)</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-color)' }}>124 <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 600 }}>nəfər</span></div>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '6px', fontWeight: 700 }}>80 İlk</span>
                    <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '6px', fontWeight: 700 }}>44 Təkrar</span>
                  </div>
                </div>

                {/* Şərtlər */}
                <div style={{ padding: '2rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '24px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>Müqavilə Şərti (Əməkhaqqı Fondu)</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-primary)' }}>1500 ₼ <span style={{ color: '#10b981' }}>+ 20%</span></div>
                  <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>Qeyd: Sabit maaş və hər xəstədən gələn gəlirin %-i</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)' }}>Son Pasiyent Rəyləri</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem 1rem', borderRadius: '12px', color: '#f59e0b', fontWeight: 800 }}>
                  Ümumi: 4.8 / 5.0 ⭐
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Rəy 1 */}
                <div style={{ padding: '1.75rem', backgroundColor: 'var(--bg-color)', borderRadius: '20px', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', color: '#f59e0b', fontSize: '1.2rem', letterSpacing: '2px' }}>⭐⭐⭐⭐⭐</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>A</div>
                    <div style={{ fontWeight: 700 }}>Anonim Pasiyent</div>
                  </div>
                  <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.6 }}>"Çox peşəkar və gülərüz həkimdir. Düzgün diaqnoz qoyaraq müalicəmi təyin etdi. Özümü çox yaxşı hiss edirəm."</p>
                </div>

                {/* Rəy 2 */}
                <div style={{ padding: '1.75rem', backgroundColor: 'var(--bg-color)', borderRadius: '20px', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', color: '#f59e0b', fontSize: '1.2rem', letterSpacing: '2px' }}>⭐⭐⭐⭐<span style={{ color: 'var(--border-color)' }}>⭐</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>M</div>
                    <div style={{ fontWeight: 700 }}>Aysel M.</div>
                  </div>
                  <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.6 }}>"Klinikada qeydiyyatda gözləmə müddəti çox oldu, amma həkimin öz işi əladır, tam diqqətlə dinlədi."</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* YENİ QEYD MODAL */}
      {isRecordModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'var(--bg-color)', padding: '2.5rem', borderRadius: '24px', width: '500px', maxWidth: '90%', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Yeni Tibbi Qeyd</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Pasiyent (Siyahıdan seçin və ya yazın)</label>
                <input 
                  type="text" 
                  value={newRecordData.patient}
                  onChange={e => setNewRecordData({...newRecordData, patient: e.target.value})}
                  placeholder="Məs: Rəşad Quliyev" 
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Qoyulmuş Diaqnoz</label>
                <input 
                  type="text" 
                  value={newRecordData.diagnosis}
                  onChange={e => setNewRecordData({...newRecordData, diagnosis: e.target.value})}
                  placeholder="Diaqnozu daxil edin" 
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Təyin Edilmiş Müalicə Planı</label>
                <textarea 
                  value={newRecordData.treatment}
                  onChange={e => setNewRecordData({...newRecordData, treatment: e.target.value})}
                  placeholder="Müalicə detalları..." 
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)', outline: 'none', minHeight: '80px', resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Elektron Resept (Dərmanlar)</label>
                <input 
                  type="text" 
                  value={newRecordData.prescription}
                  onChange={e => setNewRecordData({...newRecordData, prescription: e.target.value})}
                  placeholder="Məs: Parasetamol 500mg" 
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setIsRecordModalOpen(false)}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Ləğv et
              </button>
              <button 
                onClick={handleAddRecord}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>💾 Yadda Saxla & 📱 SMS Göndər</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}

export default function DoctorProfilePage() {
  return (
    <Suspense fallback={<div>Yüklənir...</div>}>
      <DoctorProfileContent />
    </Suspense>
  );
}

// Köməkçi UI Komponenti
function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}
