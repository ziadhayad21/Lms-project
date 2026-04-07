'use client';

import Link from 'next/link';
import { FileText, Play, Download, ChevronRight, Video, BookOpen } from 'lucide-react';

interface LessonCardProps {
  lesson: {
    _id: string;
    courseId?: string;
    title: string;
    description?: string;
    videoUrl?: string;
    videoFile?: { filename: string };
    pdfFile?: { filename: string; originalName: string; size: number };
    createdAt?: string;
    level?: string;
  };
  mode?: 'student' | 'teacher';
}


export default function LessonCard({ lesson, mode = 'student' }: LessonCardProps) {
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api/v1', '').replace(/\/$/, '');
  const pdfUrl = lesson.pdfFile?.filename ? `${apiBase}/uploads/lessons/${lesson.pdfFile.filename}` : null;

  // Extract courseId safely (handle if it's an object or string)
  const cid = (typeof lesson.courseId === 'object' && lesson.courseId !== null)
    ? (lesson.courseId as any)._id 
    : lesson.courseId;

  // Dedicated navigation path based on user role/mode
  const videoPath = mode === 'teacher'
    ? `/teacher/lessons/${lesson._id}/preview?courseId=${cid || ''}`
    : `/student/courses/${cid || 'general'}/lessons/${lesson._id}/video`;




  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden group">
      {/* Header Info */}
      <div className="p-6 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/30">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-primary-100">
            Education Module
          </span>
          {lesson.level && (
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md border border-indigo-100">
              {lesson.level}
            </span>
          )}

          {lesson.createdAt && (
            <span className="text-[10px] text-slate-400 font-medium">
              • {new Date(lesson.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2 group-hover:text-primary-600 transition-colors">
          {lesson.title}
        </h3>
        {lesson.description && (
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {lesson.description}
          </p>
        )}
      </div>

      {/* CLICKABLE SECTIONS */}
      <div className="grid grid-cols-2 divide-x divide-slate-100 h-40">
        
        {/* WATCH VIDEO SECTION */}
        <Link 
          href={videoPath}
          className="flex flex-col items-center justify-center p-6 bg-white hover:bg-primary-50 transition-all group/video relative overflow-hidden"
        >
          <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-3 transform group-hover/video:scale-110 group-hover/video:rotate-3 transition-all duration-500">
            <Video className="w-7 h-7" />
          </div>
          <span className="text-sm font-bold text-slate-700">Watch Video</span>
          <span className="text-[10px] font-medium text-slate-400 mt-1 flex items-center gap-1">
            Open Player <ChevronRight className="w-3 h-3" />
          </span>
          <div className="absolute top-0 right-0 p-1 opacity-0 group-hover/video:opacity-100 transition-opacity">
             <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-ping" />
          </div>
        </Link>

        {/* VIEW PDF SECTION */}
        {pdfUrl ? (
          <a 
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-6 bg-white hover:bg-red-50 transition-all group/pdf relative overflow-hidden"
          >
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-3 transform group-hover/pdf:scale-110 group-hover/pdf:-rotate-3 transition-all duration-500">
              <FileText className="w-7 h-7" />
            </div>
            <span className="text-sm font-bold text-slate-700">View PDF</span>
            <span className="text-[10px] font-medium text-slate-400 mt-1 flex items-center gap-1">
              Download File <Download className="w-3 h-3" />
            </span>
          </a>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 cursor-not-allowed opacity-60">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-3">
              <BookOpen className="w-7 h-7" />
            </div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">No Materials</span>
            <span className="text-[10px] font-medium text-slate-300 mt-1 italic">Text only lesson</span>
          </div>
        )}
      </div>
    </div>
  );
}
