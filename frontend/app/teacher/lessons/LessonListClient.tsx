'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { lessonApi } from '@/lib/api/lessons.api';
import LessonCard from '@/components/lessons/LessonCard';
import { Edit, Trash2, Eye } from 'lucide-react';

interface Lesson {
  _id: string;
  title: string;
  description?: string;
  course?: { _id: string; title: string };
  isPublished: boolean;
  order: number;
  videoUrl?: string;
  videoFile?: { filename: string };
  pdfFile?: { filename: string; originalName: string; size: number };
  createdAt?: string;
}

export default function LessonListClient({ initialLessons }: { initialLessons: Lesson[] }) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (lessonId: string, courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    
    setIsDeleting(lessonId);
    try {
      await lessonApi.delete(courseId, lessonId);
      setLessons(prev => prev.filter(l => l._id !== lessonId));
      router.refresh();
    } catch (error) {
      alert('Failed to delete lesson.');
    } finally {
      setIsDeleting(null);
    }
  };

  if (lessons.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
        <p className="text-4xl mb-4">📚</p>
        <p className="text-slate-600 font-medium">No lessons found. Add your first academic lesson.</p>
        <Link href="/teacher/lessons/new" className="btn-primary mt-6 inline-block py-2.5">
           + Add New Lesson
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {lessons.map((lesson) => (
        <div key={lesson._id} className="relative group">
          {/* THE CARD */}
          <LessonCard 
            mode="teacher"
            lesson={{
              ...lesson,
              courseId: lesson.course?._id
            }} 
          />


          {/* ADMIN/TEACHER ACTIONS OVERLAY */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <Link
              href={`/teacher/lessons/${lesson._id}/edit?courseId=${lesson.course?._id || ''}`}
              className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all shadow-lg border border-slate-100"
              title="Edit Lesson"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => handleDelete(lesson._id, lesson.course?._id || '')}
              disabled={isDeleting === lesson._id}
              className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-lg border border-slate-100 disabled:opacity-50"
              title="Delete Lesson"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Status Badge Over the Card */}
          <div className="absolute top-4 left-4 z-20">
             <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${
               lesson.isPublished ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
             }`}>
               {lesson.isPublished ? 'Active' : 'Draft'}
             </span>
          </div>
        </div>
      ))}
    </div>
  );
}
