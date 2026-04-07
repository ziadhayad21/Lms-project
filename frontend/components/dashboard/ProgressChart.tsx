'use client';

import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Layout } from 'lucide-react';

interface Progress {
  course:               { title: string };
  completionPercentage: number;
  isCompleted:          boolean;
}

interface Props {
  progresses: Progress[];
}

export default function ProgressChart({ progresses }: Props) {
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight font-display">Learning Curve</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Acquisition Progress</p>
        </div>
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
          <Layout className="w-5 h-5" />
        </div>
      </div>

      {!progresses?.length ? (
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
          No learning data yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="90%"
            data={progresses.slice(0, 5).map((p, i) => ({
              name: p.course?.title?.length > 15 ? p.course.title.slice(0, 15) + '…' : p.course?.title ?? 'Course',
              value: p.completionPercentage ?? 0,
              fill: COLORS[i % COLORS.length]
            }))}
            startAngle={180}
            endAngle={-180}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={8}
              label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 900 }}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Proficiency']}
              contentStyle={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, fontSize: 12, fontWeight: 700, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend
              iconSize={8}
              iconType="circle"
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
