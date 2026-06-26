import React from 'react';
import { Send, ArrowLeft, AtSign, FileType, AlignLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { sendNetworkDocument } from '../actions';
import styles from './send.module.css';

export default function SendDocumentPage() {
  return (
    <div className={styles.container}>
      <Link href="/erp/network" className={styles.backLink}>
        <ArrowLeft size={16} /> Geri Qayıt
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <div className={styles.iconBox}>
              <Send size={28} />
            </div>
            <h1 className={styles.title}>Sənəd Göndər</h1>
          </div>
          <p className={styles.subtitle}>İstifadəçi adı (username) vasitəsilə digər hesaba sənəd və ya mesaj göndərin.</p>
        </div>

        <form action={sendNetworkDocument} className={styles.form}>
          {/* Receiver Username */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Qarşı Tərəfin İstifadəçi Adı</label>
            <div className={styles.inputWrapper}>
              <AtSign size={20} className={styles.inputIcon} />
              <input
                type="text"
                name="username"
                required
                className={styles.input}
                placeholder="Məsələn: eliyev_eli"
              />
            </div>
            <p className={styles.helpText}>Sənəd göndərmək istədiyiniz şəxsin <strong>@istifadəçi_adı</strong>-nı daxil edin.</p>
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
                  className={styles.input}
                  placeholder="Məsələn: İyun 2026 Qaiməsi"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Açıqlama / Sənədin Mətni</label>
            <textarea
              name="content"
              required
              className={styles.textarea}
              placeholder="Sənədin detalları və ya əlavə məlumat..."
            ></textarea>
          </div>

          <button type="submit" className={styles.submitBtn}>
            <Send size={22} /> İndi Göndər
          </button>
        </form>
      </div>
    </div>
  );
}
