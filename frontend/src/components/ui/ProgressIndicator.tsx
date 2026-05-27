'use client';

import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number;
  message: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export default function ProgressIndicator({
  progress,
  message,
  status,
}: ProgressIndicatorProps) {
  const steps = [
    { label: 'Uploading study material', threshold: 10 },
    { label: 'Analyzing content structure', threshold: 30 },
    { label: 'Generating questions via AI core', threshold: 60 },
    { label: 'Formatting layout and hierarchy', threshold: 85 },
    { label: 'Finalizing exam document and key', threshold: 100 },
  ];

  const getStepStatus = (threshold: number) => {
    if (status === 'failed') return 'failed';
    if (progress >= threshold) return 'completed';
    if (progress > threshold - 25 && progress < threshold) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-card border border-border/80 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/10">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            AI Paper Generation
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Running queued jobs on BullMQ cluster...
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold tracking-tight text-primary">
            {progress}%
          </span>
          <span className="block text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
            Progress
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-8 relative">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>

      {/* Step Stepper */}
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const stepStatus = getStepStatus(step.threshold);
          
          return (
            <div
              key={idx}
              className={`flex items-start gap-4 transition-all duration-300 ${
                stepStatus === 'pending' ? 'opacity-40' : 'opacity-100'
              }`}
            >
              {/* Stepper Node Icon */}
              <div className="flex flex-col items-center h-full pt-1">
                {stepStatus === 'completed' && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {stepStatus === 'active' && (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                )}
                {stepStatus === 'pending' && (
                  <div className="h-5 w-5 rounded-full border border-muted-foreground/30 bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                    {idx + 1}
                  </div>
                )}
                {stepStatus === 'failed' && (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}

                {/* Stepper Link Line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`w-[2px] h-8 mt-2 transition-all duration-300 ${
                      progress >= steps[idx + 1].threshold
                        ? 'bg-gradient-to-b from-green-500 to-green-500'
                        : stepStatus === 'completed'
                        ? 'bg-gradient-to-b from-green-500 to-primary/40'
                        : 'bg-muted-foreground/15'
                    }`}
                  />
                )}
              </div>

              {/* Stepper Label */}
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    stepStatus === 'active'
                      ? 'text-primary'
                      : stepStatus === 'completed'
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </p>
                {stepStatus === 'active' && (
                  <motion.p
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-muted-foreground mt-0.5"
                  >
                    {message}
                  </motion.p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {status === 'failed' && (
        <div className="mt-8 p-4 rounded-xl border border-destructive/20 bg-destructive/5 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-destructive">Generation Job Terminated</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {message || 'An error occurred during queue execution.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
