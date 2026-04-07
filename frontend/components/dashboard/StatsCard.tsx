import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  icon:  string | LucideIcon;
  color: 'indigo' | 'emerald' | 'rose' | 'amber';
}

const colorMap = {
  indigo: { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  amber:  { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-100'  },
  rose:   { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-100'   },
};

export default function StatsCard({ label, value, icon: Icon, color }: Props) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 flex items-center gap-5 border border-slate-100 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
      <div className={clsx('w-14 lg:w-16 h-14 lg:h-16 rounded-3xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-sm border p-4', c.bg, c.border, c.text)}>
        {typeof Icon === 'string' ? <span className="text-2xl">{Icon}</span> : <Icon className="w-full h-full" />}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</p>
        <p className={clsx('text-xl lg:text-2xl font-black font-display tracking-tight truncate leading-none', c.text)}>{value}</p>
      </div>
    </div>
  );
}

