'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { lessonApi } from '@/lib/api/lessons.api';
import Link from 'next/link';
import { ChevronLeft, Play, Clock, CheckCircle } from 'lucide-react';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

export default function VideoLessonPage() {
  const params = useParams();
  const router = useRouter();
  const [lesson,    setLesson]    = useState<any>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [completed, setCompleted] = useState(false);
  const [played,    setPlayed]    = useState(0); 
  const startTime = useRef(Date.now());
  const markedRef = useRef(false);

  useEffect(() => {
    lessonApi
      .getLesson(params.courseId as string, params.lessonId as string)
      .then((r) => setLesson(r.data.lesson))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params]);

  const handleProgress = ({ played: p }: { played: number }) => {
    setPlayed(p);
    if (p >= 0.8 && !markedRef.current) {
      markedRef.current = true;
      const watchTime = Math.round((Date.now() - startTime.current) / 1000);
      lessonApi
        .completeLesson(params.courseId as string, params.lessonId as string, watchTime)
        .then(() => setCompleted(true))
        .catch(() => {});
    }
  };

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api/v1', '').replace(/\/$/, '');
  const videoUrl = lesson?.videoUrl
    ? lesson.videoUrl
    : lesson?.videoFile?.filename
    ? `${apiBase}/uploads/videos/${lesson.videoFile.filename}`
    : null;

  if (loading) return <div className="p-20 text-center text-slate-400">Loading academic theater...</div>;
  if (error)   return <div className="p-20 text-center text-rose-500 font-bold">{error}</div>;
  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-20">
      {/* Navigation Header */}
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link 
          href={`/student/courses/${params.courseId}`} 
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-widest">Dashboard</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Now Playing</span>

            <span className="text-white text-sm font-bold truncate max-w-[200px]">{lesson.title}</span>
          </div>
          {completed && (
             <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
               <CheckCircle className="w-5 h-5" />
             </div>
          )}
        </div>
      </div>

      {/* Theater View */}
      <div className="flex-1 flex flex-col justify-center bg-black relative">
        <div className="container mx-auto px-0 aspect-video max-h-[80vh]">
          {videoUrl ? (
            <ReactPlayer
              url={videoUrl}
              width="100%"
              height="100%"
              controls
              onProgress={handleProgress}
              playing={true}
              config={{
                file: { attributes: { controlsList: 'nodownload' } },
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/20 border border-white/5 bg-slate-900 rounded-3xl p-12 text-center">
              <Play className="w-20 h-20 mb-6 opacity-10" />
              <p className="text-xl font-bold">Cinema content missing</p>
              <p className="text-sm mt-2 opacity-50">Please notify your instructor that the video source is unavailable.</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Footer */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-t border-white/5 py-6">
        <div className="container mx-auto px-6 flex items-center gap-6">
           <div className="flex-1">
             <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">
               <span>Engagement Score</span>
               <span>{Math.round(played * 100)}%</span>
             </div>
             <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
               <div 
                 className="h-full bg-indigo-500 rounded-full transition-all duration-300 shadow-lg shadow-indigo-500/50" 
                 style={{ width: `${played * 100}%` }} 
               />
             </div>
           </div>
           <div className="hidden md:flex items-center gap-2">
             <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40">
               <Clock className="w-5 h-5" />
             </div>
             <div className="text-right">
               <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Time Remaining</p>
               <p className="text-white text-xs font-bold font-mono">Calculating...</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
