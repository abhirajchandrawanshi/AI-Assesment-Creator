'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '../store/assignmentStore';
import EmptyState from '../components/ui/EmptyState';
import AssignmentMenu from '../components/AssignmentMenu';
import { 
  Plus, 
  Search, 
  Calendar, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  BookOpen,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { 
    assignments, 
    loading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    loadAssignments, 
    removeAssignment 
  } = useAssignmentStore();

  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load assignments on render and when query changes
  useEffect(() => {
    loadAssignments(searchQuery);
  }, [searchQuery, loadAssignments]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assessment? This will permanently delete the generated questions and key.')) {
      return;
    }
    setDeletingId(id);
    try {
      await removeAssignment(id);
    } catch (err) {
      console.error('Failed to delete assignment:', err);
      alert('Failed to delete assignment');
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (id: string) => {
    router.push(`/assignment/${id}`);
  };

  // Math stats computation
  const totalAssessments = assignments.length;
  const processingCount = assignments.filter(a => a.status === 'processing' || a.status === 'pending').length;
  const completedCount = assignments.filter(a => a.status === 'completed').length;
  const totalQuestions = assignments.reduce((sum, a) => sum + (a.totalQuestions || 0), 0);

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Assignments</h1>
          <p className="text-xs md:text-xs text-gray-600 mt-0.5 md:mt-1">
            Manage and create assignments for your students
          </p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-[#0B1220] text-white border border-orange-500/30 hover:border-orange-500/50 hover:shadow-md hover:shadow-orange-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] self-start md:self-auto"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Create Assignment
        </Link>
      </div>

      {/* Stats Widgets Panel - Hidden on mobile, visible on desktop */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg transition-shadow">
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Total Papers</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold tracking-tight">{totalAssessments}</span>
          </div>
        </div>
        <div className="p-4 rounded-lg transition-shadow">
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Queue Processing</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold tracking-tight">{processingCount}</span>
            {processingCount > 0 && (
              <Loader2 className="h-4 w-4 text-orange-500 animate-spin" />
            )}
          </div>
        </div>
        <div className="p-4 rounded-lg transition-shadow">
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Completed</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold tracking-tight">{completedCount}</span>
          </div>
        </div>
        <div className="p-4 rounded-lg transition-shadow">
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Total Questions</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold tracking-tight">{totalQuestions}</span>
          </div>
        </div>
      </div>

      {/* Search Input Filter bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search assignments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white pl-10 pr-4 py-2.5 rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500/30 transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Grid listing */}
      {loading && assignments.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-lg p-4 md:p-5 space-y-3 animate-pulse border border-gray-100">
              <div className="h-4 bg-gray-100 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-16 bg-gray-100 rounded-lg" />
              <div className="h-6 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          <EmptyState />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {assignments.map((assignment) => {
            const isProcessing = assignment.status === 'processing' || assignment.status === 'pending';
            const createdDate = new Date(assignment.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            const dueDate = new Date(assignment.dueDate).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            
            return (
              <Link
                key={assignment._id}
                href={`/assignment/${assignment._id}`}
                className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Card Header */}
                <div className="p-4 pb-3 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base leading-tight text-gray-900 line-clamp-2">
                        {assignment.title}
                      </h3>
                    </div>
                    <AssignmentMenu
                      assignmentId={assignment._id}
                      onView={() => handleView(assignment._id)}
                      onDelete={() => handleDelete(assignment._id)}
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col gap-3">
                  {/* Assigned Date */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-600">Assigned on</span>
                    <span className="text-sm font-medium text-gray-900">{createdDate}</span>
                  </div>

                  {/* Due Date */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-600">Due</span>
                    <span className="text-sm font-medium text-gray-900">{dueDate}</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    assignment.status === 'completed'
                      ? 'bg-green-50 text-green-700 border border-green-200/50'
                      : isProcessing
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/50'
                      : 'bg-red-50 text-red-700 border border-red-200/50'
                  }`}>
                    {isProcessing && <Loader2 className="h-2.5 w-2.5 animate-spin" />}
                    {assignment.status === 'completed' && <CheckCircle2 className="h-2.5 w-2.5" />}
                    {assignment.status === 'failed' && <XCircle className="h-2.5 w-2.5" />}
                    {assignment.status}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
