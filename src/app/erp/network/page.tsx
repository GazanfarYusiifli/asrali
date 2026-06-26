import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { FileText, Send, CheckCircle, Clock, XCircle, Eye, AtSign } from 'lucide-react';
import Link from 'next/link';
import { updateDocumentStatus } from './actions';
import styles from './network.module.css';

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
    <div className={styles.errorBox}>
      <h2 className={styles.errorTitle}>User Error</h2>
      <p className={styles.errorDesc}>{userError?.message || 'Unknown error. Did you run the SQL migration?'}</p>
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
      case 'PENDING': return <span className={`${styles.statusBadge} ${styles.statusPending}`}><Clock size={12}/> Gözləyir</span>;
      case 'VIEWED': return <span className={`${styles.statusBadge} ${styles.statusViewed}`}><Eye size={12}/> Oxunub</span>;
      case 'ACCEPTED': return <span className={`${styles.statusBadge} ${styles.statusAccepted}`}><CheckCircle size={12}/> Qəbul edilib</span>;
      case 'REJECTED': return <span className={`${styles.statusBadge} ${styles.statusRejected}`}><XCircle size={12}/> İmtina edilib</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleWrapper}>
            <div className={styles.iconBox}>
              <FileText size={24} />
            </div>
            <h1 className={styles.title}>Aşralı Şəbəkəsi</h1>
          </div>
          <p className={styles.subtitle}>İstifadəçilər arası birbaşa sənəd mübadiləsi (P2P)</p>
          <div className={styles.userBadge}>
            <AtSign size={14} /> 
            {currentUser.username || 'təyin_edilməyib'}
          </div>
        </div>

        <Link href="/erp/network/send" className={styles.btnPrimary}>
          <Send size={18} /> Yeni Sənəd Göndər
        </Link>
      </div>

      <div className={styles.card}>
        <div className={styles.tabs}>
          <Link href="?tab=incoming" className={`${styles.tab} ${tab === 'incoming' ? styles.tabActive : styles.tabInactive}`}>
            Gələn Sənədlər
          </Link>
          <Link href="?tab=outgoing" className={`${styles.tab} ${tab === 'outgoing' ? styles.tabActive : styles.tabInactive}`}>
            Göndərilən Sənədlər
          </Link>
        </div>

        <div className={styles.content}>
          {(!documents || documents.length === 0) ? (
            <div className={styles.emptyState}>
              <FileText size={64} className={styles.emptyStateIcon} />
              <h3 className={styles.emptyStateTitle}>Sənəd yoxdur</h3>
              <p className={styles.emptyStateDesc}>Bu bölmədə hələ ki heç bir sənəd tapılmadı.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map(doc => (
                <div key={doc.id} className={styles.docItem}>
                  <div className={styles.docInfoWrapper}>
                    <div className={styles.docIcon}>
                      <FileText size={24} />
                    </div>
                    <div>
                      <div className={styles.docMeta}>
                        <span className={styles.docType}>
                          {doc.document_type}
                        </span>
                        <span className={styles.docDate}>
                          {new Date(doc.created_at).toLocaleDateString('az-AZ')} {new Date(doc.created_at).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h3 className={styles.docTitle}>{doc.title}</h3>
                      <p className={styles.docSender}>
                        {tab === 'incoming' ? (
                          <>Göndərən: <strong>{doc.sender?.full_name}</strong> <span className={styles.docUsername}>@{doc.sender?.username}</span></>
                        ) : (
                          <>Alıcı: <strong>{doc.receiver?.full_name}</strong> <span className={styles.docUsername}>@{doc.receiver?.username}</span></>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className={styles.docActions}>
                    {renderStatus(doc.status)}
                    
                    {tab === 'incoming' && doc.status === 'PENDING' && (
                      <div className={styles.actionButtons}>
                        <form action={async () => {
                          'use server';
                          await updateDocumentStatus(doc.id, 'ACCEPTED');
                        }}>
                          <button type="submit" className={styles.btnAccept}>
                            Qəbul et
                          </button>
                        </form>
                        <form action={async () => {
                          'use server';
                          await updateDocumentStatus(doc.id, 'REJECTED');
                        }}>
                          <button type="submit" className={styles.btnReject}>
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
