'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { lessonApi } from '@/lib/api/lessons.api';

interface LessonData {
  _id: string;
  title: string;
  description?: string;
  order: number;
  isPreview: boolean;
  isPublished: boolean;
  videoUrl?: string;
  videoFile?: { originalName: string; size: number } | null;
  pdfFile?: { originalName: string; size: number } | null;
}

interface Props {
  initialData: LessonData;
  courseId: string;
}

export default function LessonEditClient({ initialData, courseId }: Props) {
  const router = useRouter();

  const [title,      setTitle]      = useState(initialData.title || '');
  const [description,setDescription]= useState(initialData.description || '');
  const [videoUrl,   setVideoUrl]   = useState(initialData.videoUrl || '');
  const [videoFile,  setVideoFile]  = useState<File | null>(null);
  const [pdfFile,    setPdfFile]    = useState<File | null>(null);
  const [order,      setOrder]      = useState(initialData.order?.toString() || '1');
  const [isPreview,  setIsPreview]  = useState(initialData.isPreview || false);
  const [isPublished,setIsPublished]= useState(initialData.isPublished || false);
  
  // If there's an existing file or no external url, default to file mode
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>(initialData.videoUrl ? 'url' : 'file');

  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef  = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024 * 1024) {
      setError('Video file must be under 500 MB.');
      return;
    }
    setVideoFile(file);
    setError('');
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setError('PDF file must be under 50 MB.');
      return;
    }
    setPdfFile(file);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Lesson title is required.'); return; }
    if (uploadMode === 'url' && !videoUrl.trim()) { setError('Please enter a video URL.'); return; }

    setSaving(true);
    setError('');

    try {
      const payload: any = {
        title:       title.trim(),
        description: description.trim() || undefined,
        order:       parseInt(order, 10) || 1,
        isPreview,
        isPublished,
      };

      if (uploadMode === 'url') {
        payload.videoUrl = videoUrl.trim();
      }

      await lessonApi.update(
        courseId, 
        initialData._id, 
        payload, 
        uploadMode === 'file' ? videoFile ?? undefined : undefined,
        pdfFile ?? undefined
      );
      
      router.push('/teacher/lessons');
      router.refresh();
    } catch (e: any) {
      setError(e.message ?? 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Lesson Title <span className="text-red-500">*</span>
        </label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="e.g. Introduction to Present Perfect" />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field resize-none" rows={2} placeholder="Optional short description of this lesson" />
      </div>

      {/* Upload Mode Toggle */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Video Source</label>
        <div className="flex rounded-xl border border-slate-200 overflow-hidden">
          {(['file', 'url'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setUploadMode(mode)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                uploadMode === mode
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {mode === 'file' ? '📁 Upload File/Change' : '🔗 External URL'}
            </button>
          ))}
        </div>
      </div>

      {/* File Upload */}
      {uploadMode === 'file' && (
        <div>
          <input ref={fileInputRef} type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleFileChange} className="hidden" />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            {videoFile ? (
              <div>
                <p className="text-2xl mb-2">🎬</p>
                <p className="font-medium text-slate-800 text-sm">{videoFile.name}</p>
                <p className="text-xs text-slate-400 mt-1">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-3xl mb-2">📹</p>
                <p className="text-sm font-medium text-slate-700">
                  {initialData.videoFile?.originalName ? 'Click to replace video' : 'Click to select video'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {initialData.videoFile?.originalName ? `Current: ${initialData.videoFile?.originalName}` : 'MP4, WebM, or QuickTime · Max 500 MB'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* URL Input */}
      {uploadMode === 'url' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Video URL</label>
          <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input-field" placeholder="https://youtube.com/watch?v=..." />
        </div>
      )}

      {/* PDF Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Materials (PDF)</label>
        <input ref={pdfInputRef} type="file" accept="application/pdf" onChange={handlePdfChange} className="hidden" />
        <div
          onClick={() => pdfInputRef.current?.click()}
          className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors"
        >
          {pdfFile ? (
            <>
              <div className="w-10 h-10 bg-red-100 text-red-600 flex items-center justify-center rounded-lg text-xl">📄</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{pdfFile.name}</p>
                <p className="text-xs text-slate-500">{(pdfFile.size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
              <button type="button" onClick={(e) => { e.stopPropagation(); setPdfFile(null); }} className="text-slate-400 hover:text-red-500 text-lg">×</button>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-slate-100 text-slate-500 flex items-center justify-center rounded-lg text-xl">📎</div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {initialData.pdfFile?.originalName ? 'Click to replace PDF' : 'Attach PDF Material'}
                </p>
                <p className="text-xs text-slate-400 truncate max-w-[200px]">
                  {initialData.pdfFile?.originalName ? `Current: ${initialData.pdfFile?.originalName}` : 'Optional · Max 50 MB'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Order + Flags */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Order</label>
          <input type="number" min="1" value={order} onChange={(e) => setOrder(e.target.value)} className="input-field" />
        </div>
        <div className="flex flex-col gap-3 pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none pt-5">
            <input type="checkbox" checked={isPreview} onChange={(e) => setIsPreview(e.target.checked)} className="w-4 h-4 accent-primary-600 rounded" />
            <span className="text-sm text-slate-700">Free preview</span>
          </label>
        </div>
        <div className="flex flex-col gap-3 pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none pt-5">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4 accent-primary-600 rounded" />
            <span className="text-sm text-slate-700">Published</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
