'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Home,
  Users,
  ClipboardList,
  Cpu,
  BookOpen,
  Settings,
  Sparkles,
} from 'lucide-react';
import SettingsModal from '../SettingsModal';

export default function Sidebar() {
  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'My Groups', href: '/groups', icon: Users },
    { name: 'Assignments', href: '/', icon: ClipboardList },
    { name: 'AI Teacher\'s Toolkit', href: '/toolkit', icon: Cpu },
    { name: 'My Library', href: '/', icon: BookOpen },
  ];

  return (
    <aside className="w-[220px] bg-white flex flex-col h-screen fixed left-0 top-0 z-40 hidden md:flex">
      {/* Brand Logo */}
      <div className="flex items-center justify-center gap-2 px-5 py-3 border-b border-gray-100 h-20">
        <img 
          src="/logo.svg" 
          alt="VedaAI"
          className="h-14 w-auto object-contain flex-shrink-0"
        />
      </div>

      {/* Create Assignment Button */}
      <div className="px-4 pt-4 pb-3">
        <Link
          href="/create"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#0B1220] text-white text-xs font-semibold border border-orange-500/30 hover:border-orange-500/50 hover:shadow-md hover:shadow-orange-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Create Assignment
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href) && item.href !== '/';
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-[18px] w-[18px] flex-shrink-0" />
              <span className="flex-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings Link */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
        >
          <Settings className="h-[18px] w-[18px]" />
          <span>Settings</span>
        </button>
      </div>

      {/* School Profile Footer */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          {/* School Emblem */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 flex items-center justify-center">
              <svg className="h-5 w-5 text-amber-800" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-foreground leading-tight truncate">Delhi Public School</p>
            <p className="text-[11px] text-muted-foreground leading-tight truncate">Bokaro Steel City</p>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </aside>
  );
}
