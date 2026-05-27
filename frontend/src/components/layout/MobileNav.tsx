'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList,
  BookOpen,
  Cpu,
  Menu,
  Bell,
  X,
  Users,
  Settings,
  Sparkles,
  LogOut
} from 'lucide-react';
import NotificationsDropdown from '../NotificationsDropdown';
import ProfileModal from '../ProfileModal';
import SettingsModal from '../SettingsModal';

export default function MobileNav() {
  const pathname = usePathname();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [userName, setUserName] = useState('John Doe');
  const [profilePicture, setProfilePicture] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const savedPicture = localStorage.getItem('userProfilePicture');
    if (savedPicture) {
      setProfilePicture(savedPicture);
    }
  }, []);

  const navItems = [
    { name: 'Home', href: '/', icon: LayoutDashboard },
    { name: 'My Groups', href: '/groups', icon: Users },
    { name: 'Assignments', href: '/', icon: ClipboardList },
    { name: 'AI Teacher\'s Toolkit', href: '/toolkit', icon: Cpu },
    { name: 'My Library', href: '/', icon: BookOpen },
  ];

  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* Mobile Top Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white flex items-center justify-between px-4 z-50 md:hidden border-b border-gray-100 shadow-sm">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-1 h-full">
          <img 
            src="/logo.svg" 
            alt="VedaAI"
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Right: Notification, Profile, Menu */}
        <div className="flex items-center gap-3 relative">
          {/* Notification */}
          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileDropdownOpen(false);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors relative"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile */}
          <button
            onClick={() => {
              setIsProfileDropdownOpen(!isProfileDropdownOpen);
              setIsNotificationsOpen(false);
            }}
            className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 flex-shrink-0"
          >
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-xs font-bold text-amber-800">
                {userInitials}
              </div>
            )}
          </button>

          {/* Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Profile Dropdown */}
        {isProfileDropdownOpen && (
          <div className="absolute top-14 right-4 bg-white rounded-lg shadow-lg p-3 min-w-[150px] z-50">
            <button
              onClick={() => {
                setIsProfileOpen(true);
                setIsProfileDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setIsProfileDropdownOpen(false)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Notifications Panel */}
        {isNotificationsOpen && (
          <div className="absolute top-14 right-12 bg-white rounded-lg shadow-lg min-w-[280px] z-50 max-h-80 overflow-hidden flex flex-col border border-gray-200">
            <div className="flex items-center justify-between p-3 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 text-center text-sm text-gray-500">
                <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p>No notifications yet</p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sidebar Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white z-40 md:hidden transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        {/* Close Button and Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <img 
            src="/logo.svg" 
            alt="VedaAI"
            className="h-8 w-auto object-contain"
          />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Create Assignment Button */}
        <div className="px-4 pt-4 pb-3">
          <Link
            href="/create"
            onClick={() => setIsMobileMenuOpen(false)}
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
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings Link */}
        <div className="px-3 py-2 border-t border-gray-100">
          <button
            onClick={() => {
              setShowSettings(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </div>

        {/* School Profile Footer */}
        <div className="px-4 py-4 border-t border-gray-100">
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
              <p className="text-sm font-semibold text-foreground leading-tight truncate">Delhi Public School</p>
              <p className="text-xs text-muted-foreground leading-tight truncate">Bokaro Steel City</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-3 pb-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black rounded-t-3xl flex items-center justify-around px-4 z-40 md:hidden">
        {navItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors relative ${
                isActive ? 'text-white' : 'text-gray-400'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile Modal */}
      {isProfileOpen && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onNameChange={(name) => {
            setUserName(name);
          }}
          onProfilePictureChange={(pic) => {
            setProfilePicture(pic);
          }}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}
