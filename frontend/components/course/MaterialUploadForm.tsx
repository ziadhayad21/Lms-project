'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiUpload } from '@/lib/api/client';

interface Props { courseId: string }

export default function MaterialUploadForm({ courseId }: Props) {
  const router = useRouter();
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile,     setPdfFile]     = useState<File | null>(null);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { setError('PDF must be under 50 MB.'); return; }
    setPdfFile(file);
    setError('');
    if (!title) setTitle(file.name.replace('.pdf', ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) { setError('Please select a PDF file.'); return; }
    if (!title.trim()) { setError('Title is required.'); return; }

    setSaving(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('file',        pdfFile);
      fd.append('title',       title.trim());
      fd.append('description', description.trim());
      await apiUpload(`/courses/${courseId}/materials`, fd);
      router.push(`/teacher/courses/${courseId}`);
      router.refresh();
    } catch (e: any) {
      setError(e.message ?? 'Upload failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      {/* PDF Drop Zone */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">PDF File <span className="text-red-500">*</span></label>
        <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFile} className="hidden" />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors"
        >
          {pdfFile ? (
            <div>
              <p className="text-3xl mb-2">📄</p>
              <p className="font-medium text-slate-800">{pdfFile.name}</p>
              <p className="text-xs text-slate-400 mt-1">{(pdfFile.size / 1024).toFixed(0)} KB</p>
            </div>
          ) : (
            <div>
              <p className="text-4xl mb-2">📎</p>
              <p className="text-sm font-medium text-slate-700">Click to select PDF</p>
              <p className="text-xs text-slate-400 mt-1">PDF only · Max 50 MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Title <span className="text-red-500">*</span></label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="e.g. Grammar Worksheet Unit 3" />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field resize-none" rows={2} placeholder="Optional: what this material covers" />
      </div>

      <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Uploading…
            </span>
          ) : 'Upload Material'}
        </button>
      </div>
    </form>
  );
}
