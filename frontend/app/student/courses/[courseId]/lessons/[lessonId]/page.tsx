'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { lessonApi } from '@/lib/api/lessons.api';
import Link from 'next/link';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

// ── Segment tracker: records actual watch ranges, ignoring skips ───────────────
class SegmentTracker {
  private segments: Array<{ start: number; end: number }> = [];
  private segStart: number | null = null;
  private lastPos: number = 0;

  onTick(currentSeconds: number) {
    const JUMP_THRESHOLD = 2; 

    if (this.segStart === null) {
      this.segStart = currentSeconds;
    } else if (currentSeconds < this.lastPos - JUMP_THRESHOLD || currentSeconds > this.lastPos + JUMP_THRESHOLD) {
      if (this.segStart !== null && this.lastPos > this.segStart) {
        this.segments.push({ start: this.segStart, end: this.lastPos });
      }
      this.segStart = currentSeconds;
    }
    this.lastPos = currentSeconds;
  }

  flush() {
    if (this.segStart !== null && this.lastPos > this.segStart) {
      this.segments.push({ start: this.segStart, end: this.lastPos });
      this.segStart = null;
    }
  }

  getMergedRanges(): Array<{ start: number; end: number }> {
    if (this.segments.length === 0) return [];
    const sorted = [...this.segments].sort((a, b) => a.start - b.start);
    const merged = [{ ...sorted[0] }];
    for (let i = 1; i < sorted.length; i++) {
      const last = merged[merged.length - 1];
      if (sorted[i].start <= last.end) {
        last.end = Math.max(last.end, sorted[i].end);
      } else {
        merged.push({ ...sorted[i] });
      }
    }
    return merged;
  }

  getTotalWatched(): number {
    return this.getMergedRanges().reduce((s, r) => s + (r.end - r.start), 0);
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  
  // State
  const [lesson,    setLesson]    = useState<any>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [completed, setCompleted] = useState(false);
  const [played,    setPlayed]    = useState(0); 
  const [playing,   setPlaying]   = useState(false);
  const [duration,  setDuration]  = useState(0);

  // Refs
  const tracker      = useRef(new SegmentTracker());
  const markedRef    = useRef(false);
  const syncRef      = useRef({
    courseId: params.courseId as string,
    lessonId: params.lessonId as string,
  });

  useEffect(() => {
    syncRef.current.courseId = params.courseId as string;
    syncRef.current.lessonId = params.lessonId as string;
  }, [params.courseId, params.lessonId]);

  /** Send current tracked segments to the backend */
  const syncProgress = useCallback(() => {
    tracker.current.flush();
    const ranges        = tracker.current.getMergedRanges();
    const watchedSecs   = tracker.current.getTotalWatched();
    const { courseId, lessonId } = syncRef.current;
    
    if (watchedSecs === 0 && ranges.length === 0) return;

    lessonApi
      .completeLesson(courseId, lessonId, Math.round(watchedSecs), Math.round(duration || 0), ranges)
      .catch(() => {});
  }, [duration]);

  // Initial Fetch
  useEffect(() => {
    lessonApi
      .getLesson(params.courseId as string, params.lessonId as string)
      .then((r) => setLesson(r.data.lesson))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

    return () => {
      syncProgress();
    };
  }, [params.courseId, params.lessonId, syncProgress]);

  // Periodic Sync (Every 10 seconds of playback)
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(syncProgress, 10000);
    return () => clearInterval(interval);
  }, [playing, syncProgress]);

  // Final Sync on Page Unload
  useEffect(() => {
    const handleUnload = () => syncProgress();
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [syncProgress]);

  // Event Handlers
  const handleDuration = (d: number) => {
    setDuration(d);
    // Proactively sync duration to backend so "Duration unknown" disappears
    const { courseId, lessonId } = syncRef.current;
    if (d > 0) {
      lessonApi.completeLesson(courseId, lessonId, 0, Math.round(d), [])
        .catch(() => {});
    }
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setPlayed(state.played);
    tracker.current.onTick(state.playedSeconds);

    if (state.played >= 0.8 && !markedRef.current) {
      markedRef.current = true;
      setCompleted(true);
    }
  };

  const handlePlay  = () => setPlaying(true);
  const handlePause = () => {
    setPlaying(false);
    syncProgress();
  };

  const handleEnded = () => {
    setPlaying(false);
    syncProgress();
    setCompleted(true);
  };

  // ── Render Logic ───────────────────────────────────────────────────────────

  const videoUrl = lesson?.videoUrl
    ? lesson.videoUrl
    : lesson?.videoFile?.filename
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/uploads/videos/${lesson.videoFile.filename}`
    : null;

  const pdfUrl = lesson?.pdfFile?.filename
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/uploads/lessons/${lesson.pdfFile.filename}`
    : null;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
      <p className="text-red-700 font-bold">{error}</p>
      <Link href={`/student/courses/${params.courseId}`} className="text-red-600 underline mt-4 inline-block">Return to Course</Link>
    </div>
  );
  
  if (!lesson) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <nav className="flex items-center gap-2 text-sm text-slate-400">
        <Link href={`/student/courses/${params.courseId}`} className="hover:text-slate-600 transition-colors">
          ← Back to Course
        </Link>
      </nav>

      <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-soft">
        <div className="aspect-video bg-slate-900 relative">
          {videoUrl ? (
            <ReactPlayer
              url={videoUrl}
              width="100%"
              height="100%"
              controls
              playing={playing}
              onPlay={handlePlay}
              onProgress={handleProgress}
              onDuration={handleDuration}
              onPause={handlePause}
              onEnded={handleEnded}
              config={{
                file: { attributes: { controlsList: 'nodownload' } },
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/50">
              <p>No video available for this lesson.</p>
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-3xl font-black text-slate-800 tracking-tight">{lesson.title}</h1>
              {lesson.description && (
                <p className="mt-3 text-base text-slate-500 leading-relaxed max-w-3xl">{lesson.description}</p>
              )}
            </div>
            {completed && (
              <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest rounded-xl border border-emerald-100 shrink-0">
                <span className="text-sm">✓</span> Completed
              </span>
            )}
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">
              <span>Watch progress (Real engagement)</span>
              <span className="text-primary-600">{Math.round(played * 100)}%</span>
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${played * 100}%` }}
              />
            </div>
          </div>

          {pdfUrl && (
            <div className="mt-8 p-6 bg-white border border-slate-100 rounded-2xl shadow-soft hover:shadow-lg transition-all flex items-center justify-between group">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-rose-50 text-rose-600 flex items-center justify-center rounded-2xl text-2xl group-hover:bg-rose-100 transition-colors">
                  📄
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Lesson Materials</h3>
                  <p className="text-xs text-slate-500 mt-1">{lesson.pdfFile?.originalName || 'Downloadable attachment (PDF)'}</p>
                </div>
              </div>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg"
              >
                View PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
