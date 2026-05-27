'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { createAssignment } from '../../services/api';
import { 
  ArrowLeft, 
  UploadCloud, 
  Plus, 
  Trash2, 
  Sparkles, 
  Loader2, 
  FileText, 
  AlertCircle,
  X,
  Minus
} from 'lucide-react';
import Link from 'next/link';

// Zod Validation Schema
const QuestionRowSchema = zod.object({
  questionType: zod.string().min(1, 'Type is required'),
  count: zod.number()
    .int('Must be a whole number')
    .min(1, 'Must be at least 1')
    .max(100, 'Max 100 questions per section'),
  marks: zod.number()
    .int('Must be a whole number')
    .min(1, 'Must be at least 1')
    .max(100, 'Max 100 marks per question'),
});

const FormSchema = zod.object({
  title: zod.string().min(3, 'Title must be at least 3 characters'),
  description: zod.string().optional(),
  dueDate: zod.string().refine((val) => !isNaN(Date.parse(val)), 'Due date is required'),
  instructions: zod.string().optional(),
  config: zod.array(QuestionRowSchema).min(1, 'At least one question type is required'),
});

type FormValues = zod.infer<typeof FormSchema>;

export default function CreateAssignment() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      instructions: '',
      config: [
        { questionType: 'Multiple Choice Questions', count: 5, marks: 1 },
        { questionType: 'Short Questions', count: 3, marks: 5 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'config',
  });

  // Real-time calculations
  const configValues = watch('config') || [];
  const totalQuestions = configValues.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
  const totalMarks = configValues.reduce((sum, item) => sum + ((Number(item.count) || 0) * (Number(item.marks) || 0)), 0);

  // File Drag & Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'txt') {
      setFileError('Invalid file type. Only PDF and TXT documents are supported.');
      setFile(null);
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setFileError('File too large. Maximum size allowed is 10MB.');
      setFile(null);
      return;
    }
    setFileError(null);
    setFile(selectedFile);
  };

  // Submit Handler
  const onSubmit = async (values: FormValues) => {
    if (!file) {
      setFileError('Study material document is required.');
      return;
    }

    setSubmitting(true);
    setSubmissionError(null);

    try {
      const formData = new FormData();
      formData.append('title', values.title);
      if (values.description) formData.append('description', values.description);
      formData.append('dueDate', new Date(values.dueDate).toISOString());
      if (values.instructions) formData.append('instructions', values.instructions);
      formData.append('config', JSON.stringify(values.config));
      formData.append('material', file);

      const assignment = await createAssignment(formData);
      router.push(`/assignment/${assignment._id}`);
    } catch (err) {
      const error = err as Error;
      setSubmissionError(error.message || 'An error occurred during submission.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 py-6 md:py-8">
          <Link
            href="/"
            className="p-2 border border-gray-300 bg-white rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Create Assessment</h1>
            <p className="text-base text-gray-600 mt-1">
              Configure your question paper and generate assessments with AI
            </p>
          </div>
        </div>

        {submissionError && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 flex items-start gap-3 text-sm text-red-800 mb-6">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Submission failed:</span> {submissionError}
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Core Assignment Fields */}
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-xl shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-sm">1</div>
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Assessment Details</h2>
              <p className="text-xs md:text-sm text-gray-600">Basic information about your assessment</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-900">Assessment Title *</label>
              <input
                type="text"
                placeholder="e.g. Physics - Heat and Thermodynamics"
                {...register('title')}
                className={`w-full bg-white border ${errors.title ? 'border-red-300' : 'border-gray-300'} px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all`}
              />
              {errors.title && (
                <p className="text-xs text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Due Date *</label>
              <input
                type="date"
                {...register('dueDate')}
                className={`w-full bg-white border ${errors.dueDate ? 'border-red-300' : 'border-gray-300'} px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all`}
              />
              {errors.dueDate && (
                <p className="text-xs text-red-600">{errors.dueDate.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-900">Description</label>
              <textarea
                placeholder="Describe what this assessment covers..."
                rows={2}
                {...register('description')}
                className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* File Drag and Drop zone */}
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-xl shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-sm">2</div>
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Reference Material</h2>
              <p className="text-xs md:text-sm text-gray-600">Upload your study document (PDF or TXT)</p>
            </div>
          </div>
          
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 md:p-12 text-center flex flex-col items-center justify-center transition-all ${
              isDragActive 
                ? 'border-gray-900 bg-gray-900/5' 
                : file 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {!file ? (
              <div className="space-y-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gray-200 flex items-center justify-center mx-auto text-gray-600">
                  <UploadCloud className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <p className="text-base md:text-lg font-semibold text-gray-900">Drag and drop your file here</p>
                  <p className="text-xs md:text-sm text-gray-600 mt-2">or click to browse (PDF or TXT, max 10MB)</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 z-20 flex-wrap md:flex-nowrap justify-center">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-green-100 border border-green-300 text-green-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 md:h-7 md:w-7" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm md:text-base font-semibold text-gray-900 truncate max-w-[240px] md:max-w-sm">{file.name}</p>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          {fileError && (
            <p className="text-sm text-red-600 flex items-center gap-2"><AlertCircle className="h-4 w-4" />{fileError}</p>
          )}
        </div>

        {/* Question Type Blueprint Configuration */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          {/* Header */}
          <div className="flex items-start gap-3 p-6 border-b border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">Question Configuration</h2>
              <p className="text-sm text-gray-600 mt-0.5">Define question types and marks</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Header Row - Desktop Only */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="col-span-5"><p className="text-xs font-bold text-gray-600 uppercase">Question Type</p></div>
              <div className="col-span-2"><p className="text-xs font-bold text-gray-600 uppercase">No. Questions</p></div>
              <div className="col-span-2"><p className="text-xs font-bold text-gray-600 uppercase">Marks</p></div>
              <div className="col-span-3"><p className="text-xs font-bold text-gray-600 uppercase text-right">Total</p></div>
            </div>

            {/* Rows */}
            <div className="space-y-3">
              {fields.map((field, index) => {
                const countValue = configValues[index]?.count || 0;
                const marksValue = configValues[index]?.marks || 0;
                const totalMarksForRow = countValue * marksValue;
                
                return (
                  <div key={field.id}>
                    {/* Desktop Row */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all">
                      {/* Question Type */}
                      <select
                        {...register(`config.${index}.questionType` as const)}
                        className="col-span-5 bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      >
                        <option value="">Select type...</option>
                        <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                        <option value="Short Questions">Short Questions</option>
                        <option value="Diagram/Graph-Based Questions">Diagram/Graph-Based Questions</option>
                        <option value="Numerical Problems">Numerical Problems</option>
                        <option value="Long Answer">Long Answer</option>
                        <option value="Essay">Essay</option>
                      </select>

                      {/* Questions Counter */}
                      <div className="col-span-2 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => {
                            const newVal = Math.max(1, (configValues[index]?.count || 1) - 1);
                            setValue(`config.${index}.count`, newVal);
                          }}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          {...register(`config.${index}.count` as const, { valueAsNumber: true })}
                          className="flex-1 bg-transparent text-center text-sm font-semibold text-gray-900 focus:outline-none w-12"
                          min="1"
                          max="100"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newVal = Math.min(100, (configValues[index]?.count || 0) + 1);
                            setValue(`config.${index}.count`, newVal);
                          }}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Marks Counter */}
                      <div className="col-span-2 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => {
                            const newVal = Math.max(1, (configValues[index]?.marks || 1) - 1);
                            setValue(`config.${index}.marks`, newVal);
                          }}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          {...register(`config.${index}.marks` as const, { valueAsNumber: true })}
                          className="flex-1 bg-transparent text-center text-sm font-semibold text-gray-900 focus:outline-none w-12"
                          min="1"
                          max="100"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newVal = Math.min(100, (configValues[index]?.marks || 0) + 1);
                            setValue(`config.${index}.marks`, newVal);
                          }}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Total and Delete */}
                      <div className="col-span-3 flex items-center justify-between">
                        <p className="text-lg font-bold text-gray-900">{totalMarksForRow}</p>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Mobile Card */}
                    <div className="md:hidden bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-gray-600">Row {index + 1}</span>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Question Type */}
                      <div>
                        <label className="text-xs font-bold text-gray-600 block mb-2">Question Type</label>
                        <select
                          {...register(`config.${index}.questionType` as const)}
                          className="w-full bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm font-medium text-gray-900 focus:outline-none"
                        >
                          <option value="">Select type...</option>
                          <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                          <option value="Short Questions">Short Questions</option>
                          <option value="Diagram/Graph-Based Questions">Diagram/Graph-Based Questions</option>
                          <option value="Numerical Problems">Numerical Problems</option>
                          <option value="Long Answer">Long Answer</option>
                          <option value="Essay">Essay</option>
                        </select>
                      </div>

                      {/* Questions & Marks in Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-gray-600 block mb-2">No. Questions</label>
                          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newVal = Math.max(1, (configValues[index]?.count || 1) - 1);
                                setValue(`config.${index}.count`, newVal);
                              }}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded text-sm"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              {...register(`config.${index}.count` as const, { valueAsNumber: true })}
                              className="flex-1 bg-transparent text-center text-sm font-semibold text-gray-900 focus:outline-none"
                              min="1"
                              max="100"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newVal = Math.min(100, (configValues[index]?.count || 0) + 1);
                                setValue(`config.${index}.count`, newVal);
                              }}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-gray-600 block mb-2">Marks</label>
                          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newVal = Math.max(1, (configValues[index]?.marks || 1) - 1);
                                setValue(`config.${index}.marks`, newVal);
                              }}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded text-sm"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              {...register(`config.${index}.marks` as const, { valueAsNumber: true })}
                              className="flex-1 bg-transparent text-center text-sm font-semibold text-gray-900 focus:outline-none"
                              min="1"
                              max="100"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newVal = Math.min(100, (configValues[index]?.marks || 0) + 1);
                                setValue(`config.${index}.marks`, newVal);
                              }}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="pt-3 border-t border-gray-200 flex justify-between">
                        <span className="text-sm text-gray-600">Total Marks:</span>
                        <span className="text-lg font-bold text-gray-900">{totalMarksForRow}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Button */}
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() => append({ questionType: 'Multiple Choice Questions', count: 5, marks: 1 })}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Question Type
              </button>
            </div>

            {/* Summary Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
              <div className="text-right space-y-1">
                <p className="text-sm text-gray-600">Total Questions: <span className="font-bold text-gray-900">{totalQuestions}</span></p>
                <p className="text-sm text-gray-600">Total Marks: <span className="font-bold text-gray-900">{totalMarks}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Instructions */}
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-xl shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-sm">4</div>
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Additional Information</h2>
              <p className="text-xs md:text-sm text-gray-600">Provide guidelines for AI-generated questions</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">AI Instructions (Optional)</label>
            <textarea
              placeholder="e.g., Focus on recent concepts, include real-world applications, difficulty should be moderate..."
              rows={3}
              {...register('instructions')}
              className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4 md:pt-8">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg text-sm font-semibold border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 transition-all text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold bg-black text-white shadow-lg hover:bg-gray-900 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Assessment
              </>
            )}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}
