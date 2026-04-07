import Link from 'next/link';
import { FileText, Clock, Trophy, ArrowRight, Info, CheckCircle, XCircle } from 'lucide-react';
import type { Exam } from '@/types';

interface ExamCardProps {
  courseId: string;
  exam: Exam;
  attemptCount?: number;
}

export default function ExamCard({ courseId, exam, attemptCount = 0 }: ExamCardProps) {
  const isAvailable = true; // For now
  
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-soft hover:shadow-2xl hover:border-indigo-100 transition-all duration-300 group relative overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />

      <div className="flex flex-col h-full">
        {/* Header: Title and Status */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors duration-300">
            <FileText className="w-6 h-6 text-indigo-600 group-hover:text-white" />
          </div>
          {attemptCount > 0 && (
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
              Completed {attemptCount}x
            </span>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4 flex-1">
          <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
            {exam.title}
          </h3>
          <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
            {exam.description || 'This assessment evaluates your understanding of the course concepts.'}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 pb-6 border-y border-slate-50">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                 <Clock className="w-4 h-4 text-slate-400" />
               </div>
               <div className="min-w-0">
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Time Limit</p>
                 <p className="text-sm font-black text-slate-700 truncate">{exam.timeLimit || 'No Limit'}</p>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                 <Trophy className="w-4 h-4 text-slate-400" />
               </div>
               <div className="min-w-0">
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Pass Score</p>
                 <p className="text-sm font-black text-slate-700 truncate">{exam.passingScore}%</p>
               </div>
             </div>
          </div>
        </div>

        {/* Footer: Action Button */}
        <div className="mt-8 pt-2">
          {attemptCount >= (exam.maxAttempts ?? Infinity) && exam.maxAttempts !== -1 ? (
             <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
                <XCircle className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Max Attempts Used</span>
             </div>
          ) : (
            <Link
              href={`/student/exams/${exam._id}`}
              className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 group/btn"
            >
              {attemptCount === 0 ? 'Start Assessment' : 'Try Again'}
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          )}

        </div>
      </div>
    </div>
  );
}
