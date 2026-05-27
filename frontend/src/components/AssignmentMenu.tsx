'use client';

import { useState } from 'react';
import { MoreVertical, Eye, Trash2, X } from 'lucide-react';

interface AssignmentMenuProps {
  assignmentId: string;
  onView: () => void;
  onDelete: () => void;
}

export default function AssignmentMenu({
  assignmentId,
  onView,
  onDelete,
}: AssignmentMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onView();
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
        title="More options"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-border rounded-lg shadow-lg z-50">
          {/* Menu Items */}
          <button
            onClick={handleView}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors border-b border-border/50"
          >
            <Eye className="h-4 w-4 text-muted-foreground" />
            View Assignment
          </button>

          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}

      {/* Close when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
