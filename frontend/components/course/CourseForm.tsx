'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { courseApi } from '@/lib/api/courses.api';
import type { Course, CreateCoursePayload, CourseLevel, CourseCategory } from '@/types';

interface Props {
  mode:     'create' | 'edit';
  course?:  Course; // Provided when editing
}

const LEVELS:      CourseLevel[]    = ['beginner', 'intermediate', 'advanced'];
const CATEGORIES:  CourseCategory[] = ['grammar', 'speaking', 'writing', 'reading', 'listening', 'vocabulary', 'general'];

export default function CourseForm({ mode, course }: Props) {
  const router = useRouter();

  const [title,       setTitle]       = useState(course?.title       ?? '');
  const [description, setDescription] = useState(course?.description ?? '');
  const [level,       setLevel]       = useState<CourseLevel>(course?.level   ?? 'beginner');
  const [category,    setCategory]    = useState<CourseCategory>(course?.category ?? 'general');
  const [tags,        setTags]        = useState((course?.tags ?? []).join(', '));
  const [thumbnail,   setThumbnail]   = useState<File | null>(null);
  const [preview,     setPreview]     = useState<string | null>(course?.thumbnailUrl ?? null);
  const [isPublished, setIsPublished] = useState(course?.isPublished ?? false);

  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim())       { setError('Title is required.');       return; }
    if (!description.trim()) { setError('Description is required.'); return; }

    setSaving(true);
    setError('');

    const payload: CreateCoursePayload & { isPublished?: boolean } = {
      title:       title.trim(),
      description: description.trim(),
      level,
      category,
      tags:        tags.split(',').map((t) => t.trim()).filter(Boolean),
      isPublished,
    };

    try {
      if (mode === 'create') {
        const res = await courseApi.create(payload, thumbnail ?? undefined);
        router.push(`/teacher/courses/${res.data.course._id}`);
      } else if (course) {
        await courseApi.update(course._id, payload, thumbnail ?? undefined);
        router.push(`/teacher/courses/${course._id}`);
      }
      router.refresh();
    } catch (e: any) {
      setError(e.message ?? 'Failed to save course.');
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

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Course Thumbnail</label>
        <div className="flex items-start gap-4">
          <div className="w-32 h-20 rounded-xl border-2 border-dashed border-slate-200 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
            {preview
              ? (
                <Image
                  src={preview}
                  alt="Preview"
                  width={128}
                  height={80}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              )
              : <span className="text-2xl">🖼️</span>}
          </div>
          <div>
            <input
              type="file"
              id="thumbnail"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleThumbnail}
              className="hidden"
            />
            <label htmlFor="thumbnail" className="btn-secondary cursor-pointer text-sm">
              Choose Image
            </label>
            <p className="text-xs text-slate-400 mt-1.5">JPG, PNG or WebP · Max 5 MB</p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Course Title <span className="text-red-500">*</span>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          placeholder="e.g. English Grammar Masterclass"
          maxLength={100}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field resize-none"
          rows={4}
          placeholder="Describe what students will learn in this course…"
          maxLength={2000}
        />
        <p className="text-xs text-slate-400 mt-1 text-right">{description.length}/2000</p>
      </div>

      {/* Level + Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Level <span className="text-red-500">*</span>
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as CourseLevel)}
            className="input-field appearance-none cursor-pointer capitalize"
          >
            {LEVELS.map((l) => <option key={l} value={l} className="capitalize">{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CourseCategory)}
            className="input-field appearance-none cursor-pointer capitalize"
          >
            {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Tags <span className="text-slate-400 font-normal">(comma-separated)</span>
        </label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="input-field"
          placeholder="e.g. IELTS, grammar, writing, beginners"
        />
      </div>

      {/* Publish Toggle */}
      <label className="flex items-start gap-3 cursor-pointer select-none p-4 rounded-xl border border-slate-200 hover:border-primary-200 transition-colors">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="w-4 h-4 rounded accent-primary-600 mt-0.5 shrink-0"
        />
        <div>
          <p className="text-sm font-medium text-slate-800">Publish course immediately</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Published courses are visible to all students. Leave unchecked to save as draft.
          </p>
        </div>
      </label>

      {/* Submit */}
      <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving…
            </span>
          ) : mode === 'create' ? (
            'Create Course'
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}
