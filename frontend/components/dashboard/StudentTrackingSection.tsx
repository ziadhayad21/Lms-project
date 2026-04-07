'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Users,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  BookOpen,
  Eye,
  EyeOff,
  TrendingUp,
  Award,
  BarChart2,
} from 'lucide-react';
import { progressApi } from '@/lib/api/progress.api';
import { followUpsApi, FollowUpType } from '@/lib/api/followups.api';

// ─── Types ────────────────────────────────────────────────────────────────────

type TrackingStudent = {
  _id: string;
  name: string;
  email: string;
  level?: string;
  lastLogin?: string;
  lastAccessed?: string | null;
  completedLessons: number;
  videosWatched?: number;
  totalWatchTimeSeconds?: number;
  examsTaken?: number;
  avgExamScore?: number;
  lastExam?: { score: number; passed: boolean; completedAt: string } | null;
  totalLessons: number;
  completionRate: number;
  status: 'pending' | 'in progress' | 'completed';
  needsAttention?: boolean;
};

type VideoEntry = {
  _id: string;
  title: string;
  order?: number;
  courseTitle: string;
  courseId: string;
  watchPercent: number;       // 0–100, skip-aware
  watchedSeconds: number;
  totalDurationSeconds: number;
  completedAt: string | null;
  hasRecord: boolean;
};

type ExamEntry = {
  _id: string;
  examTitle: string;
  courseTitle: string;
  score: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  attemptNumber: number;
};

type MissingExam = {
  _id: string;
  title: string;
  courseTitle: string;
};

type DetailedStudentData = {
  student: any;
  videos: {
    all: VideoEntry[];
    fullyWatched: VideoEntry[];
    partiallyWatched: VideoEntry[];
    notWatched: VideoEntry[];
  };
  exams: {
    taken: ExamEntry[];
    missing: MissingExam[];
  };
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatSeconds(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function watchColor(pct: number): { bar: string; badge: string; text: string } {
  if (pct >= 90) return { bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'text-emerald-600' };
  if (pct >= 50) return { bar: 'bg-indigo-500',  badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',   text: 'text-indigo-600' };
  if (pct >= 1)  return { bar: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700 border-amber-200',       text: 'text-amber-600' };
  return             { bar: 'bg-slate-300',      badge: 'bg-slate-100 text-slate-500 border-slate-200',       text: 'text-slate-400' };
}

// ─── Video Row ────────────────────────────────────────────────────────────────

function VideoRow({ v }: { v: VideoEntry }) {
  const colors = watchColor(v.watchPercent);
  const hasTime = v.totalDurationSeconds > 0;

  return (
    <li className="flex flex-col gap-2 px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-all group">
      {/* Title + badge */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`shrink-0 w-2 h-2 rounded-full ${v.hasRecord ? (v.watchPercent >= 90 ? 'bg-emerald-500' : 'bg-indigo-400') : 'bg-slate-300'}`} />
          <span className="text-sm font-semibold text-slate-800 truncate">{v.title}</span>
        </div>
        <span className={`shrink-0 text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${colors.badge}`}>
          {v.watchPercent}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${colors.bar}`} style={{ width: `${v.watchPercent}%` }} />
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
        {v.hasRecord && hasTime && (
          <>
            <span className={colors.text}>
              {formatSeconds(v.watchedSeconds)} watched
            </span>
            <span>/</span>
            <span>{formatSeconds(v.totalDurationSeconds)} total</span>
          </>
        )}
        {!v.hasRecord && <span className="italic">Not opened yet</span>}
        {v.hasRecord && !hasTime && <span className="italic text-amber-500">Duration unknown</span>}
        {v.completedAt && (
          <span className="ml-auto">{formatDate(v.completedAt)}</span>
        )}
      </div>
    </li>
  );
}

// ─── Exam Row ─────────────────────────────────────────────────────────────────

function ExamRow({ e }: { e: ExamEntry }) {
  const isPassed = e.passed;
  return (
    <li className="flex flex-col gap-2 px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Award className={`w-3.5 h-3.5 shrink-0 ${isPassed ? 'text-emerald-500' : 'text-rose-500'}`} />
          <span className="text-sm font-semibold text-slate-800 truncate">{e.examTitle}</span>
        </div>
        <span className={`shrink-0 text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${
          isPassed
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : 'bg-rose-100 text-rose-700 border-rose-200'
        }`}>
          {e.score}% · {isPassed ? 'Pass' : 'Fail'}
        </span>
      </div>
      <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
        <span>{e.correctAnswers}/{e.totalQuestions} correct</span>
        {e.attemptNumber > 1 && <span>Attempt #{e.attemptNumber}</span>}
        <span className="ml-auto">{e.courseTitle}</span>
        <span>{formatDate(e.completedAt)}</span>
      </div>
    </li>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudentTrackingSection({
  title = 'Student Tracking (متابعة الطالب)',
  subtitle = 'Real engagement • Skip-aware watch time • All exam scores',
  initial = [],
  compact = false,
  refreshIntervalMs = 20_000,
}: {
  title?: string;
  subtitle?: string;
  initial?: TrackingStudent[];
  compact?: boolean;
  refreshIntervalMs?: number;
}) {
  const [students,          setStudents]          = useState<TrackingStudent[]>(initial);
  const [isLoading,         setIsLoading]         = useState(false);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [detailedCache,     setDetailedCache]     = useState<Record<string, DetailedStudentData>>({});
  const [loadingDetails,    setLoadingDetails]    = useState<string | null>(null);
  const [videoFilter,       setVideoFilter]       = useState<'all' | 'watched' | 'not_watched'>('all');

  const [action, setAction] = useState<{
    student: TrackingStudent;
    type: FollowUpType;
    message: string;
    isSubmitting: boolean;
    error?: string;
    success?: string;
  } | null>(null);

  // ── Polling ─────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await progressApi.getTrackingOverview();
      setStudents(res.data.tracking as TrackingStudent[]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initial?.length === 0) void load();
    const id = window.setInterval(() => void load(), refreshIntervalMs);
    return () => window.clearInterval(id);
  }, [load, refreshIntervalMs, initial]);

  const visible = useMemo(
    () => (compact ? students.slice(0, 10) : students),
    [students, compact]
  );

  // ── Expand/collapse student row ──────────────────────────────────────────────
  const toggleStudent = async (studentId: string) => {
    if (expandedStudentId === studentId) {
      setExpandedStudentId(null);
      return;
    }
    setExpandedStudentId(studentId);
    if (!detailedCache[studentId]) {
      setLoadingDetails(studentId);
      try {
        const res = await progressApi.getStudentProgress(studentId);
        setDetailedCache((prev) => ({ ...prev, [studentId]: res.data as any }));
      } finally {
        setLoadingDetails(null);
      }
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4 px-2">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight font-display">{title}</h2>
          <p className="text-slate-400 mt-1 text-sm font-bold uppercase tracking-widest">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {isLoading ? 'Refreshing…' : `${students.length} Students`}
          </span>
          {compact && (
            <Link
              href="/teacher/tracking"
              className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:text-indigo-700"
            >
              View All →
            </Link>
          )}
        </div>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-soft">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-indigo-500 opacity-20" />
          </div>
          <p className="text-slate-600 font-black text-lg">No active students found.</p>
          <p className="text-slate-400 text-sm mt-1">Students will appear here once they are approved and enrolled.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-5 font-black text-[10px] text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="p-5 font-black text-[10px] text-slate-400 uppercase tracking-widest">Level</th>
                  <th className="p-5 font-black text-[10px] text-slate-400 uppercase tracking-widest">Videos</th>
                  <th className="p-5 font-black text-[10px] text-slate-400 uppercase tracking-widest">Exams</th>
                  <th className="p-5 font-black text-[10px] text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((student) => {
                  const isExpanded      = expandedStudentId === student._id;
                  const details         = detailedCache[student._id];
                  const isLoadingRow    = loadingDetails === student._id;

                  return (
                    <React.Fragment key={student._id}>
                      <tr
                        className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-indigo-50/30' : ''}`}
                        onClick={() => toggleStudent(student._id)}
                      >
                        {/* Name */}
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100 text-indigo-600 font-black text-sm">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-sm">{student.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Level */}
                        <td className="p-5">
                          <span className="text-xs font-bold text-slate-600 px-3 py-1 bg-slate-100 rounded-lg whitespace-nowrap">
                            {student.level || 'Unassigned'}
                          </span>
                        </td>

                        {/* Videos quick summary */}
                        <td className="p-5">
                          <div className="w-36">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5">
                              <span className="text-slate-400">{student.completionRate}% done</span>
                              <span className="text-indigo-600">{student.completedLessons}/{student.totalLessons}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  student.completionRate < 30 && student.totalLessons > 0
                                    ? 'bg-rose-500'
                                    : 'bg-indigo-500'
                                }`}
                                style={{ width: `${Math.min(100, Math.max(0, student.completionRate))}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Exams quick summary */}
                        <td className="p-5">
                          {student.examsTaken ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-700">{student.examsTaken} taken</span>
                              {student.avgExamScore !== undefined && (
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                                  student.avgExamScore >= 60
                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                    : 'bg-rose-100 text-rose-700 border-rose-200'
                                }`}>
                                  avg {student.avgExamScore}%
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">None yet</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                              student.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-700'
                                : student.status === 'in progress'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {student.status}
                            </span>
                            {student.needsAttention && student.totalLessons > 0 && (
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                            )}
                          </div>
                        </td>

                        {/* Expand toggle */}
                        <td className="p-5 text-right">
                          <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </td>
                      </tr>

                      {/* ── Expanded detailed view ───────────────────────────────── */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="p-0 border-b border-indigo-100">
                            <div className="bg-gradient-to-b from-indigo-50/30 to-white p-8">

                              {isLoadingRow ? (
                                <div className="flex items-center justify-center py-12 gap-3">
                                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                  <span className="text-sm text-slate-500 font-medium">Loading student data…</span>
                                </div>
                              ) : details ? (
                                <div className="space-y-8 animate-fade-in">

                                  {/* ── Quick action buttons ─────────────────────── */}
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setAction({ student, type: 'feedback', message: '', isSubmitting: false }); }}
                                      className="py-2 px-4 bg-white border border-slate-200 hover:border-amber-300 text-amber-700 hover:bg-amber-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center shadow-sm"
                                    >
                                      <AlertCircle className="w-3.5 h-3.5" /> Send Feedback
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setAction({ student, type: 'note', message: '', isSubmitting: false }); }}
                                      className="py-2 px-4 bg-white border border-slate-200 hover:border-indigo-300 text-indigo-700 hover:bg-indigo-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center shadow-sm"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" /> Note
                                    </button>
                                    <a
                                      href={`mailto:${student.email}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="py-2 px-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center shadow-sm"
                                    >
                                      <Mail className="w-3.5 h-3.5" /> Email
                                    </a>

                                    {/* Summary chips */}
                                    <div className="ml-auto flex items-center gap-2 flex-wrap">
                                      <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
                                        <PlayCircle className="w-3 h-3" />
                                        {details.videos.all.length} videos total
                                      </span>
                                      <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
                                        <BookOpen className="w-3 h-3" />
                                        {details.exams.taken.length} exams taken
                                      </span>
                                    </div>
                                  </div>

                                  {/* ── Two column layout: Videos | Exams ─────────── */}
                                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                                    {/* VIDEO TRACKING COLUMN */}
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between">
                                        <h4 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest">
                                          <PlayCircle className="w-4 h-4 text-indigo-500" />
                                          Video Watch Percentage
                                        </h4>
                                        {/* Filter tabs */}
                                        <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
                                          {(['all', 'watched', 'not_watched'] as const).map((f) => (
                                            <button
                                              key={f}
                                              onClick={(e) => { e.stopPropagation(); setVideoFilter(f); }}
                                              className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md transition-all ${
                                                videoFilter === f
                                                  ? 'bg-white text-indigo-600 shadow-sm'
                                                  : 'text-slate-400 hover:text-slate-600'
                                              }`}
                                            >
                                              {f === 'all' ? 'All' : f === 'watched' ? 'Watched' : 'Not Watched'}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="bg-white rounded-2xl border border-slate-200 p-4">
                                        {/* Stats bar */}
                                        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-slate-100">
                                          <div className="text-center">
                                            <p className="text-lg font-black text-emerald-600">{details.videos.fullyWatched.length}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">≥90% watched</p>
                                          </div>
                                          <div className="text-center border-x border-slate-100">
                                            <p className="text-lg font-black text-indigo-600">{details.videos.partiallyWatched.length}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Partial</p>
                                          </div>
                                          <div className="text-center">
                                            <p className="text-lg font-black text-slate-400">{details.videos.notWatched.length}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Not Opened</p>
                                          </div>
                                        </div>

                                        {/* Video list */}
                                        {(() => {
                                          const list =
                                            videoFilter === 'watched'
                                              ? details.videos.all.filter((v) => v.hasRecord)
                                              : videoFilter === 'not_watched'
                                              ? details.videos.all.filter((v) => !v.hasRecord)
                                              : details.videos.all;

                                          return list.length > 0 ? (
                                            <ul className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                                              {list.map((v) => (
                                                <VideoRow key={String(v._id)} v={v} />
                                              ))}
                                            </ul>
                                          ) : (
                                            <p className="text-xs text-slate-400 text-center italic py-6">
                                              {videoFilter === 'not_watched'
                                                ? '🎉 All videos have been opened!'
                                                : 'No videos match this filter.'}
                                            </p>
                                          );
                                        })()}
                                      </div>
                                    </div>

                                    {/* EXAMS COLUMN */}
                                    <div className="space-y-4">
                                      <h4 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest">
                                        <BookOpen className="w-4 h-4 text-indigo-500" />
                                        Exam Results
                                      </h4>

                                      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-5">
                                        {/* Exam summary bar */}
                                        {details.exams.taken.length > 0 && (
                                          <div className="grid grid-cols-3 gap-3 pb-4 border-b border-slate-100">
                                            <div className="text-center">
                                              <p className="text-lg font-black text-slate-800">{details.exams.taken.length}</p>
                                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Taken</p>
                                            </div>
                                            <div className="text-center border-x border-slate-100">
                                              <p className="text-lg font-black text-emerald-600">
                                                {details.exams.taken.filter((e) => e.passed).length}
                                              </p>
                                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Passed</p>
                                            </div>
                                            <div className="text-center">
                                              <p className="text-lg font-black text-indigo-600">
                                                {Math.round(
                                                  details.exams.taken.reduce((sum, e) => sum + e.score, 0) /
                                                    details.exams.taken.length
                                                )}%
                                              </p>
                                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Avg Score</p>
                                            </div>
                                          </div>
                                        )}

                                        {/* Taken exams */}
                                        <div>
                                          <p className="text-xs font-black text-emerald-600 mb-3 flex items-center gap-2">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            Completed Exams ({details.exams.taken.length})
                                          </p>
                                          {details.exams.taken.length > 0 ? (
                                            <ul className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                                              {details.exams.taken.map((e) => (
                                                <ExamRow key={String(e._id)} e={e} />
                                              ))}
                                            </ul>
                                          ) : (
                                            <p className="text-xs text-slate-400 italic bg-slate-50 py-3 px-4 rounded-xl">
                                              No exams taken yet.
                                            </p>
                                          )}
                                        </div>

                                        {/* Missing exams */}
                                        {details.exams.missing.length > 0 && (
                                          <div>
                                            <p className="text-xs font-black text-amber-600 mb-3 flex items-center gap-2">
                                              <Clock className="w-3.5 h-3.5" />
                                              Pending / Not Attempted ({details.exams.missing.length})
                                            </p>
                                            <ul className="space-y-2">
                                              {details.exams.missing.map((e) => (
                                                <li
                                                  key={String(e._id)}
                                                  className="flex justify-between items-center px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs"
                                                >
                                                  <span className="font-semibold text-slate-700 truncate pr-2">{e.title}</span>
                                                  <span className="shrink-0 text-[9px] font-black text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">
                                                    {e.courseTitle}
                                                  </span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-slate-500 text-center py-6">Failed to load student details.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Follow-up action modal ──────────────────────────────────────────── */}
      {action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setAction(null)}
            aria-label="Close modal"
          />
          <div className="relative w-full max-w-xl bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-6 animate-zoom-in">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Follow-up action</p>
                <h3 className="text-xl font-black text-slate-800 tracking-tight font-display line-clamp-1">
                  {action.type} → {action.student.name}
                </h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-1">{action.student.level || 'Unassigned Level'}</p>
              </div>
              <button
                type="button"
                onClick={() => setAction(null)}
                className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-widest"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <textarea
                value={action.message}
                onChange={(e) => setAction({ ...action, message: e.target.value, error: undefined, success: undefined })}
                rows={5}
                placeholder="Write your message…"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-800 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-200 transition-all"
              />
              {action.error   && <p className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-lg">{action.error}</p>}
              {action.success && <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-3 rounded-lg">{action.success}</p>}
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAction(null)}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm"
                disabled={action.isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!action.message.trim()) {
                    setAction({ ...action, error: 'Message cannot be empty.' });
                    return;
                  }
                  setAction({ ...action, isSubmitting: true, error: undefined, success: undefined });
                  try {
                    await followUpsApi.create({
                      studentId: action.student._id,
                      type:      action.type,
                      message:   action.message.trim(),
                    });
                    setAction({ ...action, isSubmitting: false, message: '', success: 'Sent and saved successfully.' });
                  } catch (e: any) {
                    setAction({ ...action, isSubmitting: false, error: e?.message ?? 'Failed to send.' });
                  }
                }}
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20"
                disabled={action.isSubmitting}
              >
                {action.isSubmitting ? 'Sending…' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      ` }} />
    </section>
  );
}
