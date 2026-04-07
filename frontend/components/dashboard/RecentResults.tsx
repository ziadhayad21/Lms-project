import { Trophy, Clock, ChevronRight, Award } from 'lucide-react';

interface Result {
  _id:           string;
  exam?:         { title: string };
  course?:       { title: string };
  score:         number;
  passed:        boolean;
  completedAt:   string;
  attemptNumber: number;
}

interface Props {
  results: Result[];
}

export default function RecentResults({ results }: Props) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight font-display">Recent History</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Academic Performance</p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
          <Trophy className="w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {!results?.length ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
          <Award className="w-10 h-10 mb-3 opacity-20" />
          <p className="font-medium">No activity recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((r) => (
            <div key={r._id} className="group relative flex items-center gap-4 p-4 rounded-3xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
              <div
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm font-display
                  ${r.score >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
              >
                <span className="text-lg font-black leading-none">{r.score}%</span>
                <span className="text-[8px] font-black uppercase tracking-tighter mt-0.5">Score</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                   <h3 className="text-sm font-black text-slate-800 truncate leading-none">
                     {r.exam?.title ?? 'Module Evaluation'}
                   </h3>
                   <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${r.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                     {r.passed ? 'Passed' : 'Failed'}
                   </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">
                  {r.course?.title || 'English Proficiency'} • Attempt #{r.attemptNumber}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  {new Date(r.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
