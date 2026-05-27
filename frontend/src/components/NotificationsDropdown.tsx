'use client';

import { useState, useEffect } from 'react';
import { Bell, X, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { getNotifications, markAsRead } from '@/services/api';

interface Notification {
  id: string;
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  assignmentId?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Assignment Created',
    message: 'Your assessment "Physics - Heat and Thermodynamics" has been created successfully.',
    type: 'success',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '2',
    title: 'Question Generation Started',
    message: 'AI is now generating questions for your new assessment.',
    type: 'info',
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
];

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      try {
        const fetchedNotifications = await getNotifications();
        if (Array.isArray(fetchedNotifications) && fetchedNotifications.length > 0) {
          setNotifications(fetchedNotifications as Notification[]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRemoveNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAsRead = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'warning':
      case 'error':
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getNotificationBgColor = (type?: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-green-500';
      case 'warning':
      case 'error':
        return 'bg-amber-50 border-l-amber-500';
      case 'info':
      default:
        return 'bg-blue-50 border-l-blue-500';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 rounded-lg transition-colors"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="h-5 w-5 md:h-6 md:w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-3 w-3 md:h-4 md:w-4 rounded-full bg-red-500 ring-2 ring-white animate-pulse flex items-center justify-center text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-[500px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {loading ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-gray-500">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Bell className="h-8 w-8 text-gray-300 mx-auto" />
                  <p className="text-sm text-gray-500">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 md:p-4 cursor-pointer border-l-4 transition-all ${
                      notification.isRead
                        ? 'bg-gray-50 border-l-gray-200'
                        : `${getNotificationBgColor(notification.type)} border-l-current`
                    } hover:bg-gray-100`}
                    onClick={() => handleMarkAsRead(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {notification.title && (
                          <p className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </p>
                        )}
                        <p className={`text-xs ${notification.title ? 'text-gray-600 mt-1' : 'text-gray-900'} line-clamp-2`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTime(new Date(notification.createdAt))}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleRemoveNotification(notification.id, e)}
                        className="flex-shrink-0 p-1 hover:bg-white rounded transition-colors"
                        aria-label="Remove notification"
                      >
                        <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleClearAll}
                  className="w-full text-center text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors py-1"
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}
