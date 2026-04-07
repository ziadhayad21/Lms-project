'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Trophy, 
  Trash2, 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle, 
  Plus,
  AlertCircle,
  HelpCircle,
  Hash,
  Save,
  Check
} from 'lucide-react';
import { examApi } from '@/lib/api/exam.api';
import { uploadApi } from '@/lib/api/upload.api';
import type { CreateExamPayload } from '@/types';

interface ExamUploadFormProps {
  // simplified params
}

interface QuestionForm {
  type: 'multiple-choice' | 'essay';
  questionText: string;
  imageFile: File | null;
  previewUrl: string | null;
  options: string[];
  correctOptionIndex: number;
  points: number;
}

export default function ExamUploadForm({}: ExamUploadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const [examData, setExamData] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    passingScore: 60,
    maxAttempts: 3,
  });

  const [questions, setQuestions] = useState<QuestionForm[]>([
    { type: 'multiple-choice', questionText: '', imageFile: null, previewUrl: null, options: ['', ''], correctOptionIndex: 0, points: 1 }
  ]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { type: 'multiple-choice', questionText: '', imageFile: null, previewUrl: null, options: ['', ''], correctOptionIndex: 0, points: 1 }]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: keyof QuestionForm, value: any) => {
    const updated = [...questions];
    
    if (field === 'imageFile') {
      const file = value as File | null;
      updated[index] = { 
        ...updated[index], 
        imageFile: file,
        previewUrl: file ? URL.createObjectURL(file) : null
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleAddOption = (qIndex: number) => {
    if (questions[qIndex].options.length >= 6) return;
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    if (questions[qIndex].options.length <= 2) return;
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== oIndex);
    if (updated[qIndex].correctOptionIndex >= updated[qIndex].options.length) {
      updated[qIndex].correctOptionIndex = 0;
    }
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLevel) return setError('Please select a level');
    if (questions.some(q => !q.questionText || (q.type === 'multiple-choice' && q.options.some(o => !o)))) {
      return setError('Please fill in all questions and options');
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload images first
      const processedQuestions = await Promise.all(
        questions.map(async (q) => {
          let imageUrl = undefined;
          if (q.imageFile) {
            const res = await uploadApi.uploadImage(q.imageFile);
            imageUrl = res.url;
          }
          return {
            type: q.type,
            questionText: q.questionText,
            questionImage: imageUrl,
            options: q.type === 'multiple-choice' ? q.options : [],
            correctOptionIndex: q.type === 'multiple-choice' ? q.correctOptionIndex : undefined,
            points: q.points
          };
        })
      );

      const payload: CreateExamPayload = {
        ...examData,
        level: selectedLevel as any,
        questions: processedQuestions
      };

      await examApi.createExam(payload);
      router.push('/teacher/exams');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create exam');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 animate-fade-in-up">
      {/* 1. Basic Information */}
      <section className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-soft relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 transition-all group-hover:w-3" />
        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
             <Trophy className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-black text-slate-800 tracking-tight">Basic Information</h2>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Setup your assessment details</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="space-y-6 md:col-span-2">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Assign By Level</label>
              <select
                required
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="input-field py-4 bg-slate-50/50"
              >
                <option value="">Select a level...</option>
                {[
                  'أولى إعدادي',
                  'تانية إعدادي',
                  'تالتة إعدادي',
                  'أولى ثانوي',
                  'تانية ثانوي',
                  'تالتة ثانوي',
                ].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Exam Title</label>
            <input
              required
              type="text"
              placeholder="e.g., Final Proficiency Test - Level 1"
              value={examData.title}
              onChange={(e) => setExamData({ ...examData, title: e.target.value })}
              className="input-field py-4"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Description</label>
            <textarea
              rows={3}
              placeholder="Provide clear instructions for students..."
              value={examData.description}
              onChange={(e) => setExamData({ ...examData, description: e.target.value })}
              className="input-field py-4 min-h-[120px]"
            />
          </div>

          <div>
             <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">
               <Clock className="w-3 h-3" /> Time Limit (mins)
             </label>
             <input
               type="number"
               min="1"
               value={examData.timeLimit}
               onChange={(e) => setExamData({ ...examData, timeLimit: parseInt(e.target.value) })}
               className="input-field py-4"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">
                 <CheckCircle className="w-3 h-3 text-emerald-500" /> Pass %
               </label>
               <input
                 type="number"
                 min="0"
                 max="100"
                 value={examData.passingScore}
                 onChange={(e) => setExamData({ ...examData, passingScore: parseInt(e.target.value) })}
                 className="input-field py-4"
               />
             </div>
             <div>
               <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">
                 <AlertCircle className="w-3 h-3 text-amber-500" /> Max Tries
               </label>
               <input
                 type="number"
                 min="-1"
                 value={examData.maxAttempts}
                 onChange={(e) => setExamData({ ...examData, maxAttempts: parseInt(e.target.value) })}
                 className="input-field py-4"
               />
             </div>
          </div>
        </div>
      </section>

      {/* 2. Questions Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-6">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 border border-slate-200">
                <Hash className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Assessment Questions</h2>
           </div>
           <button
             type="button"
             onClick={handleAddQuestion}
             className="btn-indigo-soft px-8 py-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest"
           >
             <Plus className="w-4 h-4" /> Add Question
           </button>
        </div>

        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <div 
              key={qIndex} 
              className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-soft hover:border-indigo-100 transition-all group/q"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-3">
                   <span className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-black">
                     {qIndex + 1}
                   </span>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question Details</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(qIndex)}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-4 border-b border-slate-100 pb-4">
                  <div className="w-1/2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Question Type</label>
                    <select
                       value={question.type}
                       onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                       className="input-field py-2 text-sm bg-slate-50/50"
                    >
                       <option value="multiple-choice">Multiple Choice</option>
                       <option value="essay">Essay Response</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Question Photo (Optional)</label>
                    <input
                       type="file"
                       accept="image/*"
                       onChange={(e) => handleQuestionChange(qIndex, 'imageFile', e.target.files?.[0] || null)}
                       className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  {question.previewUrl && (
                    <div className="mb-4 rounded-xl overflow-hidden max-h-[200px] inline-block border border-slate-100 shadow-sm relative group">
                       <img src={question.previewUrl} alt="Question Reference" className="max-h-[200px] object-contain" />
                    </div>
                  )}
                  <textarea
                    required
                    placeholder="Enter the question text here..."
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                    className="w-full text-xl font-bold text-slate-800 placeholder:text-slate-300 bg-transparent border-none focus:ring-0 p-0 resize-none min-h-[60px]"
                  />
                  <div className="h-px w-full bg-slate-50 group-focus-within/q:bg-indigo-100 transition-colors mt-2" />
                </div>

                {question.type === 'multiple-choice' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="relative group/opt">
                      <div className={`p-4 rounded-3xl border-2 transition-all flex items-center gap-4 ${
                        question.correctOptionIndex === oIndex 
                          ? 'border-emerald-500 bg-emerald-50/20' 
                          : 'border-slate-50 bg-slate-50/30'
                      }`}>
                         <button
                           type="button"
                           onClick={() => handleQuestionChange(qIndex, 'correctOptionIndex', oIndex)}
                           className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                             question.correctOptionIndex === oIndex
                               ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                               : 'bg-white border-slate-200 text-slate-300 hover:border-emerald-400'
                           }`}
                         >
                           {question.correctOptionIndex === oIndex ? <Check className="w-4 h-4" /> : String.fromCharCode(65 + oIndex)}
                         </button>
                         <input
                           type="text"
                           required
                           placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                           value={option}
                           onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                           className="bg-transparent border-none focus:ring-0 p-0 w-full text-sm font-bold text-slate-700 placeholder:text-slate-300"
                         />
                         {question.options.length > 2 && (
                           <button
                             type="button"
                             onClick={() => handleRemoveOption(qIndex, oIndex)}
                             className="opacity-0 group-hover/opt:opacity-100 p-2 text-slate-400 hover:text-rose-500 transition-all"
                           >
                             <Trash2 className="w-3.5 h-3.5" />
                           </button>
                         )}
                      </div>
                    </div>
                  ))}
                  {question.options.length < 6 && (
                    <button
                      type="button"
                      onClick={() => handleAddOption(qIndex)}
                      className="p-4 rounded-3xl border-2 border-dashed border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest"
                    >
                      <PlusCircle className="w-4 h-4" /> Add Option
                    </button>
                  )}
                </div>
                )}
                
                {question.type === 'essay' && (
                  <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl text-center">
                     <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Students will see a text area to write their answer.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 animate-shake">
          <div className="w-10 h-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-sm font-black text-rose-600">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-4 pt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1 py-6 text-sm flex items-center justify-center gap-3 disabled:opacity-50 group"
        >
          {isSubmitting ? 'Publishing...' : 'Create Assessment'}
          <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-10 py-6 rounded-[2rem] border-2 border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all"
        >
          Discard
        </button>
      </div>
    </form>
  );
}
