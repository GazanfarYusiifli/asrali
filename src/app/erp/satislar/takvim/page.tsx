'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar as CalendarIcon, Plus, Trash2, Clock, User } from 'lucide-react';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
const days = ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'];

export default function IsTeqvimiPage() {
  const getMonday = () => {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const baseDate = getMonday();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [daysToShow, setDaysToShow] = useState(14); // Default to 14 days

  // Add Task Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [newTaskContent, setNewTaskContent] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('09:00');
  const [newTaskPersonel, setNewTaskPersonel] = useState('Qəzənfər Yusifli');
  const [newTaskSms, setNewTaskSms] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = JSON.parse(getAppStorage('erp_calendar_tasks') || '[]');
    setTasks(saved);
  }, []);

  if (!isMounted) return null;

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const getVisibleDates = () => {
    const dates = [];
    for (let i = 0; i < daysToShow; i++) {
      dates.push(addDays(baseDate, i));
    }
    return dates;
  };

  const visibleDates = getVisibleDates();

  const handleSaveTask = () => {
    if (!newTaskContent.trim()) return;
    
    const newTask = {
      id: Date.now(),
      dateString: selectedDateStr,
      time: newTaskTime,
      author: newTaskPersonel, // Personel
      content: newTaskContent,
      smsWarning: newTaskSms
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setAppStorage('erp_calendar_tasks', JSON.stringify(updatedTasks));
    
    setIsModalOpen(false);
    setNewTaskContent('');
    setNewTaskTime('09:00');
    setNewTaskPersonel('Qəzənfər Yusifli');
    setNewTaskSms(false);
  };

  const deleteTask = (id: number) => {
    if (confirm('Bu qeydi silmək istədiyinizə əminsiniz?')) {
      const updatedTasks = tasks.filter(t => t.id !== id);
      setTasks(updatedTasks);
      setAppStorage('erp_calendar_tasks', JSON.stringify(updatedTasks));
    }
  };

  const openAddTaskModal = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    const now = new Date();
    setNewTaskTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#dcfce7', padding: '0.5rem', borderRadius: '8px', color: '#10b981' }}>
            <CalendarIcon size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.2rem' }}>İş Təqvimi</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>İşlərinizi və qeydlərinizi gündəlik olaraq planlaşdırın.</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', padding: '0.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <button 
            onClick={() => setDaysToShow(7)}
            style={{ ...navBtnStyle, backgroundColor: daysToShow === 7 ? '#dcfce7' : 'transparent', color: daysToShow === 7 ? '#059669' : '#475569' }}
          >
            7 Günlük Plan
          </button>
          
          <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0', margin: '0 0.2rem' }}></div>
          
          <button 
            onClick={() => setDaysToShow(14)}
            style={{ ...navBtnStyle, backgroundColor: daysToShow === 14 ? '#dcfce7' : 'transparent', color: daysToShow === 14 ? '#059669' : '#475569' }}
          >
            14 Günlük Plan
          </button>
        </div>
      </div>

      {/* Calendar Grid (Kanban style columns) */}
      <div style={{ flex: 1, display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }} className="custom-scrollbar">
        {visibleDates.map((date, i) => {
          const dateStr = date.toISOString().split('T')[0];
          const isToday = dateStr === new Date().toISOString().split('T')[0];
          const dayTasks = tasks.filter(t => t.dateString === dateStr).sort((a, b) => a.time.localeCompare(b.time));
          
          return (
            <div key={i} style={{ 
              minWidth: '300px', 
              width: '300px', 
              backgroundColor: isToday ? '#f0fdf4' : 'white', 
              borderRadius: '12px', 
              border: isToday ? '2px solid #34d399' : '1px solid #e2e8f0', 
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}>
              {/* Column Header */}
              <div style={{ padding: '1rem', borderBottom: isToday ? '1px solid #a7f3d0' : '1px solid #e2e8f0', backgroundColor: isToday ? '#dcfce7' : '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: isToday ? '#065f46' : '#1e293b' }}>
                    {date.getDate()} {months[date.getMonth()]} {date.getFullYear()}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: isToday ? '#059669' : '#64748b', fontWeight: 600 }}>
                    {days[date.getDay()]} {isToday && '(Bu gün)'}
                  </div>
                </div>
                <button onClick={() => openAddTaskModal(dateStr)} style={{ backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#10b981', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#10b981'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#10b981'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#10b981'; e.currentTarget.style.borderColor = '#cbd5e1'; }}>
                  <Plus size={18} />
                </button>
              </div>

              {/* Tasks List */}
              <div style={{ padding: '1rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="custom-scrollbar">
                {dayTasks.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginTop: '2rem' }}>
                    Bu gün üçün qeyd yoxdur.
                  </div>
                ) : (
                  dayTasks.map(task => (
                    <div key={task.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', position: 'relative', borderLeft: '4px solid #10b981' }}>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
                          <Clock size={14} /> {task.time}
                        </div>
                        <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7, padding: 0 }} title="Sil">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 700 }}>
                          <User size={14} /> {task.author}
                        </div>
                        {task.smsWarning && (
                          <span style={{ fontSize: '0.7rem', backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.2rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                            SMS
                          </span>
                        )}
                      </div>

                      <div style={{ color: '#1e293b', fontSize: '0.95rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.5' }}>
                        {task.content}
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              Yeni Qeyd Əlavə Et
            </h2>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Tarix</label>
                <input type="date" value={selectedDateStr} onChange={(e) => setSelectedDateStr(e.target.value)} style={inputStyle} disabled />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Saat</label>
                <input type="time" value={newTaskTime} onChange={(e) => setNewTaskTime(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>İşçi (Personal)</label>
              <input type="text" value={newTaskPersonel} onChange={(e) => setNewTaskPersonel(e.target.value)} style={inputStyle} placeholder="İşçinin adını daxil edin..." />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Açıqlama</label>
              <textarea 
                rows={4} 
                value={newTaskContent} 
                onChange={(e) => setNewTaskContent(e.target.value)} 
                placeholder="İş və ya plan barədə məlumat yazın..."
                style={{ ...inputStyle, resize: 'none' }}
                autoFocus
              ></textarea>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <input 
                type="checkbox" 
                id="smsCheck" 
                checked={newTaskSms} 
                onChange={(e) => setNewTaskSms(e.target.checked)} 
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10b981' }} 
              />
              <label htmlFor="smsCheck" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>SMS Xəbərdarlıq göndərilsin</label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '0.6rem 1.5rem', backgroundColor: 'transparent', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                Ləğv Et
              </button>
              <button onClick={handleSaveTask} style={{ padding: '0.6rem 1.5rem', backgroundColor: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
                Yadda Saxla
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `}} />
    </div>
  );
}

const navBtnStyle = {
  display: 'flex', 
  alignItems: 'center', 
  gap: '0.3rem', 
  padding: '0.4rem 0.8rem', 
  backgroundColor: 'transparent', 
  border: 'none', 
  borderRadius: '6px', 
  color: '#475569', 
  fontWeight: 600, 
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontSize: '0.9rem'
};

const inputStyle = {
  padding: '0.8rem 1rem', 
  borderRadius: '8px', 
  border: '1px solid #cbd5e1', 
  outline: 'none', 
  fontSize: '0.95rem', 
  color: '#0f172a', 
  fontWeight: 500, 
  backgroundColor: '#f8fafc', 
  transition: 'all 0.2s',
  width: '100%'
};
