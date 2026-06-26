import React from 'react';
import { Send, ArrowLeft, AtSign, FileType, AlignLeft, ChevronDown, Mail } from 'lucide-react';
import Link from 'next/link';
import { sendNetworkDocument } from '../../network/actions';
import styles from './send.module.css';

export default function ContextualSendPage({ searchParams }: { searchParams: { id?: string } }) {
  const defaultTitle = searchParams.id ? `E-Fatura Sənədi: ${searchParams.id}` : 'E-Fatura';

  return (
    <div className={styles.container}>
      <Link href="/erp/efatura/giden" className={styles.backLink}>
        <ArrowLeft size={16} /> Gedən Qaimələrə Qayıt
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <div className={styles.iconBox}>
              <Send size={28} />
            </div>
            <h1 className={styles.title}>Aşralı Şəbəkəsi ilə Göndər</h1>
          </div>
          <p className={styles.subtitle}>Sənədi digər istifadəçiyə e-poçt ünvanı vasitəsilə birbaşa sistem daxilində göndərin.</p>
        </div>

        <form action={sendNetworkDocument} className={styles.form}>
          <input type="hidden" name="redirectTo" value="/erp/efatura/giden" />
          
          {/* Receiver Email */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Qarşı Tərəfin E-poçt Ünvanı (Email)</label>
            <div className={styles.inputWrapper}>
              <Mail size={20} className={styles.inputIcon} />
              <input
                type="email"
                name="email"
                required
                className={styles.input}
                placeholder="Məsələn: sirket@mail.com"
              />
            </div>
            <p className={styles.helpText}>Sənəd göndərmək istədiyiniz şəxsin <strong>qeydiyyatda olan e-poçt ünvanını</strong> daxil edin.</p>
          </div>

          <div className={styles.grid}>
            {/* Document Type */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Sənədin Növü</label>
              <div className={styles.inputWrapper}>
                <FileType size={20} className={styles.inputIcon} />
                <select
                  name="type"
                  required
                  className={`${styles.input} ${styles.select}`}
                >
                  <option value="INVOICE">Elektron Qaimə (E-Fatura)</option>
                  <option value="CONTRACT">Müqavilə</option>
                  <option value="ACT">Akt (Təhvil-Təslim)</option>
                  <option value="MESSAGE">Məktub / Bildiriş</option>
                </select>
                <ChevronDown size={20} className={styles.selectIcon} />
              </div>
            </div>

            {/* Title */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Başlıq</label>
              <div className={styles.inputWrapper}>
                <AlignLeft size={20} className={styles.inputIcon} />
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={defaultTitle}
                  className={styles.input}
                  placeholder="Məsələn: İyun 2026 Qaiməsi"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Açıqlama / Sənədin Detalları</label>
            <textarea
              name="content"
              required
              className={styles.textarea}
              placeholder="Qaimə üzrə əlavə qeydlər, ödəniş şərtləri və s..."
              defaultValue={searchParams.id ? `Salam, bu qaimə sistem tərəfindən Aşralı Şəbəkəsi vasitəsilə sizə yönləndirilmişdir.\nQaimə ID: ${searchParams.id}` : ''}
            ></textarea>
          </div>

          <button type="submit" className={styles.submitBtn}>
            <Send size={22} /> Sənədi İndi Göndər
          </button>
        </form>
      </div>
    </div>
  );
}
