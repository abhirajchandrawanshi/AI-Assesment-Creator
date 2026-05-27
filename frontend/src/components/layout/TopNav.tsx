'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import ProfileModal from '../ProfileModal';
import NotificationsDropdown from '../NotificationsDropdown';

export default function TopNav() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState('John Doe');
  const [profilePicture, setProfilePicture] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    // Load profile picture from localStorage
    const savedPicture = localStorage.getItem('userProfilePicture');
    if (savedPicture) {
      setProfilePicture(savedPicture);
    }
  }, []);

  const getBreadcrumb = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname === '/create') return 'Create Assessment';
    if (pathname.startsWith('/assignment/')) return 'Assignment Details';
    return 'Dashboard';
  };

  const showBack = pathname !== '/';

  const handleNameChange = (newName: string) => {
    setUserName(newName);
    setIsProfileOpen(false);
  };

  const handleProfilePictureChange = (imageUrl: string) => {
    setProfilePicture(imageUrl);
  };

  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <header className="h-14 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 hidden md:flex">
        {/* Left: Back + Breadcrumb */}
        <div className="flex items-center gap-3">
          {showBack && (
            <Link
              href="/"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="font-medium">{getBreadcrumb()}</span>
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <NotificationsDropdown />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="Profile menu"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-xs font-bold text-amber-800">
                    {userInitials}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-900 hidden lg:inline">{userName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-600 hidden lg:inline" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {/* Profile Info */}
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                        {profilePicture ? (
                          <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-sm font-bold text-amber-800">
                            {userInitials}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500">Educator</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={() => {
                      setIsProfileOpen(true);
                      setIsProfileDropdownOpen(false);
                    }}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      // Add logout functionality here
                      console.log('Logout clicked');
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userName={userName}
        onNameChange={handleNameChange}
        onProfilePictureChange={handleProfilePictureChange}
      />
    </>
  );
}
