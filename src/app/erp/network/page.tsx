import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { FileText, Send, CheckCircle, Clock, XCircle, Eye, AtSign } from 'lucide-react';
import Link from 'next/link';
import { updateDocumentStatus } from './actions';

export default async function NetworkPage({ searchParams }: { searchParams: { tab?: string } }) {
  const supabase = await createClient();
  const tab = searchParams.tab || 'incoming';

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div>Auth error</div>;

  const { data: currentUser, error: userError } = await supabase
    .from('users')
    .select('id, username')
    .eq('id', user.id)
    .single();

  if (!currentUser) return (
    <div className="p-8 max-w-xl mx-auto mt-10 bg-red-50 text-red-700 rounded-2xl border border-red-200 shadow-sm">
      <h2 className="text-xl font-bold mb-2">User Error</h2>
      <p className="font-mono text-sm">{userError?.message || 'Unknown error. Did you run the SQL migration?'}</p>
    </div>
  );

  // Fetch documents
  let query = supabase
    .from('network_documents')
    .select(`
      *,
      sender:users!network_documents_sender_user_id_fkey(full_name, username),
      receiver:users!network_documents_receiver_user_id_fkey(full_name, username)
    `)
    .order('created_at', { ascending: false });

  if (tab === 'incoming') {
    query = query.eq('receiver_user_id', currentUser.id);
  } else {
    query = query.eq('sender_user_id', currentUser.id);
  }

  const { data: documents } = await query;

  const renderStatus = (status: string) => {
    switch(status) {
      case 'PENDING': return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12}/> Gözləyir</span>;
      case 'VIEWED': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1"><Eye size={12}/> Oxunub</span>;
      case 'ACCEPTED': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Qəbul edilib</span>;
      case 'REJECTED': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={12}/> İmtina edilib</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <FileText className="text-white" size={24} />
            </div>
            Aşralı Şəbəkəsi
          </h1>
          <p className="text-slate-500 mt-2 font-medium">İstifadəçilər arası birbaşa sənəd mübadiləsi (P2P)</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-100 shadow-sm">
            Mənim hesabım: <AtSign size={14} className="ml-1"/> {currentUser.username || 'təyin_edilməyib'}
          </div>
        </div>

        <Link href="/erp/network/send" className="bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:-translate-y-1">
          <Send size={18} /> Yeni Sənəd Göndər
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <Link href="?tab=incoming" className={`flex-1 text-center py-4 font-bold text-sm uppercase tracking-wider transition-colors ${tab === 'incoming' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
            Gələn Sənədlər
          </Link>
          <Link href="?tab=outgoing" className={`flex-1 text-center py-4 font-bold text-sm uppercase tracking-wider transition-colors ${tab === 'outgoing' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
            Göndərilən Sənədlər
          </Link>
        </div>

        {/* Content */}
        <div className="p-6">
          {(!documents || documents.length === 0) ? (
            <div className="py-20 text-center flex flex-col items-center">
              <FileText size={64} className="text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">Sənəd yoxdur</h3>
              <p className="text-slate-500 mt-2">Bu bölmədə hələ ki heç bir sənəd tapılmadı.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map(doc => (
                <div key={doc.id} className="border border-slate-100 rounded-2xl p-5 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <FileText className="text-slate-400" size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                          {doc.document_type}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(doc.created_at).toLocaleDateString('az-AZ')} {new Date(doc.created_at).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-800">{doc.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {tab === 'incoming' ? (
                          <>Göndərən: <strong className="text-slate-700">{doc.sender?.full_name}</strong> <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded ml-1">@{doc.sender?.username}</span></>
                        ) : (
                          <>Alıcı: <strong className="text-slate-700">{doc.receiver?.full_name}</strong> <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded ml-1">@{doc.receiver?.username}</span></>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                    {renderStatus(doc.status)}
                    
                    {tab === 'incoming' && doc.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <form action={async () => {
                          'use server';
                          await updateDocumentStatus(doc.id, 'ACCEPTED');
                        }}>
                          <button type="submit" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
                            Qəbul et
                          </button>
                        </form>
                        <form action={async () => {
                          'use server';
                          await updateDocumentStatus(doc.id, 'REJECTED');
                        }}>
                          <button type="submit" className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-bold shadow-sm transition-colors">
                            Rədd et
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
