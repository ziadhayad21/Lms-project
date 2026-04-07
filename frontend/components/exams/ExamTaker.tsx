'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Play, FileText, CheckCircle, ArrowRight, AlertCircle, Trophy, BarChart3, ChevronRight } from 'lucide-react';
import { examApi } from '@/lib/api/exam.api';

interface ExamTakerProps {
  courseId: string;
  exam: any;
}

export default function ExamTaker({ courseId, exam }: ExamTakerProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(exam.timeLimit ? exam.timeLimit * 60 : null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Timer logic
  useEffect(() => {
    if (timeLeft === null || result) return;
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => (prev ?? 0) - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleTextAnswer = (questionId: string, text: string) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payloadAnswers = Object.entries(answers).map(([questionId, value]) => {
        if (typeof value === 'number') {
           return { questionId, selectedOptionIndex: value };
        }
        return { questionId, essayAnswer: value };
      });
      const res = await examApi.submitExam(exam._id, {
        answers: payloadAnswers,
        timeTakenSeconds: exam.timeLimit ? exam.timeLimit * 60 - (timeLeft ?? 0) : 0,
      });
      setResult(res.data.result);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (result) {
    return (
      <div className="max-w-3xl mx-auto animate-scale-in">
        <div className="bg-white rounded-[3.5rem] p-12 text-center border border-slate-100 shadow-soft relative overflow-hidden">
          {/* Confetti-like background decor */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-50/50 rounded-br-full -z-10" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-50/50 rounded-tl-full -z-10" />
          
          <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl ${result.passed ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
             <Trophy className="w-12 h-12" />
          </div>

          <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-3 font-display">
            Assessment Completed
          </h2>
          <p className="text-slate-500 font-medium text-lg mb-12">
            Great effort! Here is a summary of your performance.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-sm group hover:scale-[1.02] transition-transform">
               <BarChart3 className="w-6 h-6 text-indigo-500 mx-auto mb-4" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Your Score</p>
               <p className={`text-4xl font-black ${result.passed ? 'text-emerald-600' : 'text-indigo-600'}`}>
                 {result.score}%
               </p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 shadow-sm group hover:scale-[1.02] transition-transform">
               <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-4" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Accuracy</p>
               <p className="text-4xl font-black text-slate-700">
                 {result.correctAnswers}/{result.totalQuestions}
               </p>
            </div>
          </div>

          <div className={`p-8 rounded-3xl mb-12 border shadow-sm ${result.passed ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
            <h4 className={`text-lg font-black mb-1 ${result.passed ? 'text-emerald-800' : 'text-rose-800'}`}>
               Result: {result.passed ? 'PASSED' : 'NOT PASSED'}
            </h4>
            <p className={`text-sm font-bold ${result.passed ? 'text-emerald-600/80' : 'text-rose-600/80'}`}>
               Minimum required score: {result.passingScore}%
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push(`/student/courses/${courseId}`)}
              className="btn-primary flex-1 py-5 rounded-[2rem] text-sm tracking-widest font-black uppercase"
            >
              Back to Course
            </button>
            {!result.passed && (
               <button
                 onClick={() => window.location.reload()}
                 className="flex-1 py-5 rounded-[2rem] border-2 border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-[#4A5568] text-sm"
               >
                 Retry Exam
               </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* HUD: Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-12 border-b border-slate-100">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
               <FileText className="w-5 h-5" />
             </div>
             <div>
               <h1 className="text-2xl font-black text-slate-800 tracking-tight font-display">{exam.title}</h1>
               <div className="flex items-center gap-3 mt-1">
                 <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Ongoing Examination</p>
               </div>
             </div>
           </div>
        </div>

        <div className="flex items-center gap-6">
          {timeLeft !== null && (
            <div className={`flex items-center gap-4 px-6 py-4 rounded-[2rem] shadow-soft border group transition-colors ${timeLeft < 120 ? 'bg-rose-50 border-rose-100/50' : 'bg-white border-slate-100'}`}>
              <Clock className={`w-5 h-5 group-hover:scale-110 transition-transform ${timeLeft < 120 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
              <div className="leading-none">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Remaining</p>
                 <p className={`text-xl font-black font-display ${timeLeft < 120 ? 'text-rose-600' : 'text-slate-800'}`}>
                   {formatTime(timeLeft)}
                 </p>
              </div>
            </div>
          )}
          
          <div className="bg-slate-100/50 backdrop-blur-sm rounded-full w-24 h-24 p-1 relative flex items-center justify-center">
             <svg className="w-full h-full -rotate-90">
               <circle cx="48" cy="48" r="42" className="stroke-slate-200 fill-none stroke-[8px]" />
               <circle 
                  cx="48" cy="48" r="42" 
                  className="stroke-indigo-600 fill-none stroke-[8px] transition-all duration-500" 
                  style={{ strokeDasharray: '263.89', strokeDashoffset: `${263.89 - (263.89 * progress) / 100}` }}
               />
             </svg>
             <div className="absolute text-center leading-none">
               <span className="text-xs font-black text-slate-800">{currentQuestionIndex + 1}/{exam.questions.length}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-soft">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Questions</h5>
              <div className="grid grid-cols-4 gap-3">
                 {exam.questions.map((_: any, idx: number) => (
                   <button
                     key={idx}
                     onClick={() => setCurrentQuestionIndex(idx)}
                     className={`aspect-square rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
                        currentQuestionIndex === idx 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                          : answers[exam.questions[idx]._id] !== undefined
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-indigo-100'
                     }`}
                   >
                     {idx + 1}
                   </button>
                 ))}
              </div>
           </div>
           
           <div className="bg-brand-50 p-6 rounded-[2rem] border border-brand-100">
              <div className="flex items-center gap-3 mb-2">
                 <AlertCircle className="w-4 h-4 text-brand-500" />
                 <h6 className="text-[10px] font-black text-brand-700 uppercase tracking-widest">Integrity Notice</h6>
              </div>
              <p className="text-[11px] text-brand-600/80 font-bold leading-relaxed">
                 Switching tabs or refreshing may invalidate this session. Complete the exam within the allocated time.
              </p>
           </div>
        </div>

        {/* Main Interface */}
        <div className="lg:col-span-3 space-y-8 animate-fade-in-up">
           <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-soft relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 -z-10 group-hover:w-3 transition-all duration-300" />
              
              <div className="mb-10">
                <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Question {currentQuestionIndex + 1}</p>
                {currentQuestion.questionImage && (
                  <div className="mb-6 rounded-2xl overflow-hidden max-h-[300px] border border-slate-100 bg-slate-50 flex items-center justify-center p-4">
                     <img src={currentQuestion.questionImage} alt="Question Graphic" className="max-h-full object-contain" />
                  </div>
                )}
                <h3 className="text-3xl font-black text-slate-800 leading-tight">
                  {currentQuestion.questionText}
                </h3>
              </div>

              <div className="space-y-4 mb-12">
                {currentQuestion.type === 'essay' ? (
                  <textarea
                    placeholder="Write your answer here..."
                    value={(answers[currentQuestion._id] as string) || ''}
                    onChange={(e) => handleTextAnswer(currentQuestion._id, e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 focus:ring-0 rounded-3xl p-6 min-h-[200px] text-slate-700 font-medium resize-y transition-colors"
                  />
                ) : (
                  currentQuestion.options.map((option: string, oIdx: number) => (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(currentQuestion._id, oIdx)}
                      className={`w-full group/opt flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all text-left ${
                        answers[currentQuestion._id] === oIdx
                          ? 'border-indigo-600 bg-indigo-50/30'
                          : 'border-slate-50 bg-slate-50/30 hover:border-indigo-100 hover:bg-white active:scale-[0.995]'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all ${
                        answers[currentQuestion._id] === oIdx
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-white text-slate-400 group-hover/opt:text-indigo-600 border border-slate-100'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </div>
                      <span className={`text-lg font-bold ${answers[currentQuestion._id] === oIdx ? 'text-indigo-900' : 'text-slate-600'}`}>
                        {option}
                      </span>
                      {answers[currentQuestion._id] === oIdx && (
                         <div className="ml-auto w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                         </div>
                      )}
                    </button>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between gap-6 pt-10 border-t border-slate-100">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-[#4A5568] hover:bg-slate-50 disabled:opacity-30 flex items-center gap-2 group transition-all"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> 
                  Previous
                </button>

                {currentQuestionIndex === exam.questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || Object.keys(answers).length < exam.questions.length}
                    className="btn-primary px-10 py-5 text-sm flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? 'Finalizing...' : 'Submit Assessment'}
                    <Trophy className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(exam.questions.length - 1, prev + 1))}
                    className="btn-indigo-soft px-8 py-4 rounded-2xl flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-widest border-2 border-indigo-50 hover:bg-indigo-50 group transition-all"
                  >
                    Next Question
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
           </div>

           {Object.keys(answers).length < exam.questions.length && (
              <p className="text-center text-[11px] font-bold text-slate-400 flex items-center justify-center gap-2">
                 <Info className="w-3 h-3" />
                 Please answer all questions to enable final submission.
              </p>
           )}
        </div>
      </div>
    </div>
  );
}

function Info(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    )
}
