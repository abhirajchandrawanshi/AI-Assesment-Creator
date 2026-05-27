'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAssignmentStore } from '../../../store/assignmentStore';
import { connectSocket, disconnectSocket } from '../../../services/socket';
import ProgressIndicator from '../../../components/ui/ProgressIndicator';
import QuestionPaperDisplay from '../../../components/ui/QuestionPaperDisplay';
import { 
  ArrowLeft, 
  Calendar, 
  BookOpen, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default function AssignmentDetails() {
  const { id } = useParams() as { id: string };

  const { 
    currentAssignment, 
    currentPaper, 
    loadAssignment, 
    loadQuestionPaper 
  } = useAssignmentStore();

  const [mounted, setMounted] = useState(false);

  // Avoid hydration issues with @react-pdf client rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch initial data & handle live websocket cycles
  useEffect(() => {
    if (!id) return;

    const init = async () => {
      const assignment = await loadAssignment(id);
      if (assignment) {
        if (assignment.status === 'completed') {
          await loadQuestionPaper(id);
        } else if (assignment.status === 'processing' || assignment.status === 'pending') {
          // Connect real-time progress update listeners
          connectSocket(id);
        }
      }
    };

    init();

    return () => {
      disconnectSocket();
    };
  }, [id, loadAssignment, loadQuestionPaper]);

  // Handle polling when page is kept open (extra safeguard for completion checks)
  useEffect(() => {
    if (!currentAssignment || currentAssignment.status !== 'completed' || currentPaper) return;
    loadQuestionPaper(id);
  }, [currentAssignment, currentPaper, id, loadQuestionPaper]);

  if (!currentAssignment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading assignment details...</p>
      </div>
    );
  }

  const isGenerating = currentAssignment.status === 'processing' || currentAssignment.status === 'pending';

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Backrow */}
      <div className="flex items-center justify-between border-b border-border/50 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 border border-border/50 bg-white rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{currentAssignment.title}</h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Source: {currentAssignment.materialName}
            </p>
          </div>
        </div>

        {currentAssignment.status === 'completed' && currentPaper && mounted && (
          <div className="flex items-center gap-3">
            {/* Info section is handled by QuestionPaperDisplay component */}
          </div>
        )}
      </div>

      {/* RENDER SYSTEM STATES */}
      {isGenerating ? (
        <div className="py-12">
          <ProgressIndicator 
            progress={currentAssignment.progress} 
            message={currentAssignment.progressMessage} 
            status={currentAssignment.status} 
          />
        </div>
      ) : currentAssignment.status === 'failed' ? (
        <div className="max-w-xl mx-auto bg-card border border-destructive/20 p-6 md:p-8 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-destructive">AI Generation Failed</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              We encountered an issue generating your questions. {currentAssignment.progressMessage}
            </p>
          </div>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/create"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Try Again
            </Link>
          </div>
        </div>
      ) : !currentPaper ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Parsing structured question sections...</p>
        </div>
      ) : (
        /* RENDER PROFESSIONAL QUESTION PAPER */
        <QuestionPaperDisplay assignment={currentAssignment} paper={currentPaper} />
      )}
    </div>
  );
}
