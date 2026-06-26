import React from 'react';
import { Send, ArrowLeft, Building2, FileType, AlignLeft } from 'lucide-react';
import Link from 'next/link';
import { sendNetworkDocument } from '../actions';

export default function SendDocumentPage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto font-sans">
      <Link href="/erp/network" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-6 transition-colors">
        <ArrowLeft size={16} /> Geri Qayıt
      </Link>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <Send className="text-indigo-600" size={24} />
            </div>
            Sənəd Göndər
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Aşralı Şəbəkəsindəki digər şirkətə birbaşa sənəd göndərin.</p>
        </div>

        <form action={sendNetworkDocument} className="space-y-6">
          {/* Receiver VOEN */}
          <div className="group">
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Qarşı Tərəfin VÖEN-i</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                name="voen"
                required
                className="w-full pl-12 pr-4 py-4 text-lg font-bold text-slate-800 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner"
                placeholder="Məsələn: 1234567891"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 ml-1">Sənəd göndərmək istədiyiniz şirkətin VÖEN kodunu daxil edin.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Document Type */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Sənədin Növü</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FileType className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <select
                  name="type"
                  required
                  className="w-full pl-12 pr-4 py-4 text-lg font-bold text-slate-700 bg-slate-50 border-2 border-slate-100 rounded-2xl appearance-none focus:ring-0 focus:border-indigo-500 focus:bg-white outline-none transition-all cursor-pointer shadow-inner"
                >
                  <option value="INVOICE">Elektron Qaimə (E-Fatura)</option>
                  <option value="CONTRACT">Müqavilə</option>
                  <option value="ACT">Akt (Təhvil-Təslim)</option>
                  <option value="MESSAGE">Məktub / Bildiriş</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Başlıq</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <AlignLeft className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full pl-12 pr-4 py-4 text-lg font-bold text-slate-800 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner"
                  placeholder="Məsələn: İyun 2026 Qaiməsi"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="group">
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Açıqlama / Sənədin Mətni</label>
            <textarea
              name="content"
              rows={5}
              className="w-full p-5 text-lg text-slate-800 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner resize-y"
              placeholder="Sənədin detalları və ya əlavə məlumat..."
            ></textarea>
          </div>

          <button type="submit" className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-extrabold text-lg shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2">
            <Send size={20} /> İndi Göndər
          </button>
        </form>
      </div>
    </div>
  );
}
