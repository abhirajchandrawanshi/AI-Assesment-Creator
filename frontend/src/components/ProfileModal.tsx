'use client';

import { useState, useEffect } from 'react';
import { X, User, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadProfilePicture, updateUserProfile } from '@/services/api';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  onNameChange?: (newName: string) => void;
  onProfilePictureChange?: (imageUrl: string) => void;
}

export default function ProfileModal({ 
  isOpen, 
  onClose, 
  userName = 'John Doe', 
  onNameChange,
  onProfilePictureChange 
}: ProfileModalProps) {
  const [editName, setEditName] = useState(userName);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [profilePicture, setProfilePicture] = useState<string>('');

  useEffect(() => {
    // Load profile picture from localStorage on mount
    const savedPicture = localStorage.getItem('userProfilePicture');
    if (savedPicture) {
      setProfilePicture(savedPicture);
    }
  }, []);

  useEffect(() => {
    setEditName(userName);
  }, [userName]);

  if (!isOpen) return null;

  const handleNameSave = async () => {
    if (editName.trim() && editName !== userName) {
      setSaving(true);
      setMessage(null);
      try {
        await updateUserProfile(editName);
        onNameChange?.(editName);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Name updated successfully!' });
        setTimeout(() => setMessage(null), 2000);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to update name' });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image must be less than 5MB' });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setMessage({ type: 'error', text: 'Please select a valid image file' });
    }
  };

  const handlePictureUpload = async () => {
    if (selectedFile) {
      setUploading(true);
      setMessage(null);
      try {
        // Store image in localStorage for demo
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          localStorage.setItem('userProfilePicture', base64);
          setProfilePicture(base64);
          onProfilePictureChange?.(base64);
          
          // Try to upload to backend
          try {
            await uploadProfilePicture(selectedFile);
          } catch (error) {
            console.warn('Backend upload failed, using local storage', error);
          }
          
          setPreviewUrl('');
          setSelectedFile(null);
          setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
          setTimeout(() => setMessage(null), 2000);
        };
        reader.readAsDataURL(selectedFile);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to upload picture' });
      } finally {
        setUploading(false);
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg text-sm font-medium ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Picture Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm">Profile Picture</h3>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 flex-shrink-0">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-3xl font-bold text-amber-800">
                  {getInitials(editName)}
                </div>
              )}
            </div>

            <div className="w-full space-y-3">
              <label htmlFor="picture-upload" className="relative block">
                <input
                  id="picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading || previewUrl !== ''}
                />
                <span className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  <ImageIcon className="h-4 w-4" />
                  {previewUrl ? 'Change Image' : 'Choose Image'}
                </span>
              </label>

              {selectedFile && previewUrl && (
                <div className="flex gap-2">
                  <button
                    onClick={handlePictureUpload}
                    disabled={uploading}
                    className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Upload'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    disabled={uploading}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white font-medium text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Name Edit Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              Edit Name
            </h3>
          </div>

          {isEditing ? (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm"
                placeholder="Enter your name"
                autoFocus
                maxLength={50}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleNameSave}
                  disabled={saving || !editName.trim() || editName === userName}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditName(userName);
                    setIsEditing(false);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900 font-medium">{editName}</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
