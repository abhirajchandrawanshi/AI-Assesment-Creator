'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, Users, TrendingUp } from 'lucide-react';

export default function GroupsPage() {
  const pathname = usePathname();

  const groups = [
    {
      id: 1,
      name: 'Class 10A',
      studentCount: 32,
      progress: 75,
      lastUpdated: 'May 20, 2025'
    },
    {
      id: 2,
      name: 'Machine Learning Batch',
      studentCount: 18,
      progress: 92,
      lastUpdated: 'May 25, 2025'
    },
    {
      id: 3,
      name: 'Data Structures Group',
      studentCount: 24,
      progress: 58,
      lastUpdated: 'May 22, 2025'
    },
    {
      id: 4,
      name: 'Advanced Physics',
      studentCount: 28,
      progress: 45,
      lastUpdated: 'May 18, 2025'
    },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Groups</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and organize student groups</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#0B1220] text-white border border-orange-500/30 hover:border-orange-500/50 hover:shadow-md hover:shadow-orange-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Create Group
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <div key={group.id} className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:border-orange-200">
            {/* Card Header */}
            <div className="p-4 pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900 line-clamp-1">
                {group.name}
              </h3>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col gap-4">
              {/* Students */}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{group.studentCount} Students</span>
              </div>

              {/* Progress */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">Progress</span>
                  <span className="text-xs font-bold text-gray-900">{group.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(group.progress)} transition-all duration-300`}
                    style={{ width: `${group.progress}%` }}
                  />
                </div>
              </div>

              {/* Last Updated */}
              <p className="text-xs text-gray-500">Updated {group.lastUpdated}</p>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 border-t border-gray-100">
              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors duration-200">
                View Group
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
