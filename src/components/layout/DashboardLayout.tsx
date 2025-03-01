import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  HomeIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  RectangleStackIcon, 
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';
import VibeChatPanel from '../ui/VibeChatPanel';
import { signOut, getUser } from '../../utils/supabaseClient';
import { getProfile, UserProfile } from '../../utils/supabaseProfiles';
import { getUnreadNotificationCount } from '../../utils/supabaseData';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'My COO', href: '/dashboard/my-coo', icon: CircleStackIcon },
  { name: 'Meetings', href: '/dashboard/meetings', icon: CalendarIcon },
  { name: 'Documents', href: '/dashboard/documents', icon: DocumentTextIcon },
  { name: 'Projects', href: '/dashboard/projects', icon: RectangleStackIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vibeMode, setVibeMode] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDebugBypassActive, setIsDebugBypassActive] = useState(router.query.debugBypass === 'true');
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        const { user, error: userError } = await getUser();
        
        if (userError || !user) {
          console.error('Error fetching user:', userError?.message);
          return;
        }
        
        const { profile, error: profileError } = await getProfile(user.id);
        
        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
        } else if (profile) {
          setUserProfile(profile);
        }

        const { count, error: notificationError } = await getUnreadNotificationCount(user.id);
        
        if (notificationError) {
          console.error('Error fetching notifications:', notificationError.message);
        } else {
          setUnreadNotificationsCount(count);
        }
      } catch (error) {
        console.error('Unexpected error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleVibeMode = () => {
    setVibeMode(!vibeMode);
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await signOut();
      
      if (error) {
        console.error('Error signing out:', error.message);
        setIsSigningOut(false);
        return;
      }
      
    } catch (error) {
      console.error('Unexpected error during sign-out:', error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex h-screen bg-cco-neutral-50">
      {isDebugBypassActive && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-1 px-4 text-center text-sm z-50">
          ⚠️ DEBUG MODE: Authentication bypass active - do not use in production ⚠️
        </div>
      )}

      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-cco-neutral-200">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cco-primary-500 to-cco-accent-500 rounded-md flex items-center justify-center text-white font-bold">
                CCO
              </div>
              <span className="text-xl font-semibold text-cco-neutral-900">VibeCoder</span>
            </Link>
            <button 
              className="p-1 rounded-md lg:hidden text-cco-neutral-700 hover:bg-cco-neutral-100"
              onClick={toggleSidebar}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
              const Icon = item.icon as React.ComponentType<{ className: string }>;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-cco-primary-50 text-cco-primary-700'
                      : 'text-cco-neutral-700 hover:bg-cco-neutral-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-cco-primary-700' : 'text-cco-neutral-700'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-cco-neutral-200">
            <div className="flex items-center space-x-3 p-2">
              <div className="flex-shrink-0">
                {isLoading ? (
                  <div className="w-10 h-10 rounded-full bg-cco-neutral-200 animate-pulse"></div>
                ) : (
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={userProfile?.avatar_url || "https://i.pravatar.cc/150?img=68"}
                    alt="User avatar"
                  />
                )}
              </div>
              <div>
                {isLoading ? (
                  <>
                    <div className="h-4 w-24 bg-cco-neutral-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-32 bg-cco-neutral-200 rounded animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-cco-neutral-900">
                      {userProfile?.name || 'User'}
                    </p>
                    <p className="text-xs text-cco-neutral-700">
                      {userProfile?.role || 'User'}
                    </p>
                  </>
                )}
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              disabled={isSigningOut || isLoading}
              className="mt-3 flex items-center w-full px-4 py-2 text-sm text-cco-neutral-700 rounded-md hover:bg-cco-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-cco-neutral-700" />
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </div>

      <VibeChatPanel isOpen={vibeMode} onClose={() => setVibeMode(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <button
            className="text-cco-neutral-700 lg:hidden"
            onClick={toggleSidebar}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <div className="ml-auto flex items-center space-x-4">
            <button 
              onClick={toggleVibeMode}
              className={`p-1 rounded-md transition-all duration-300 relative group ${
                vibeMode 
                  ? 'bg-gradient-to-r from-cco-primary-500 to-cco-accent-500 text-white shadow-md' 
                  : 'text-cco-neutral-700 hover:bg-cco-neutral-100'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-300 ${vibeMode ? 'scale-110' : 'scale-100'}`}
              >
                <circle cx="13" cy="12" r="8" />
                <path d="M13 2v4" />
                <path d="M13 18v4" />
                <path d="M2 12h4" />
                <path d="M18 12h4" />
                <circle cx="13" cy="12" r="5" className="animate-pulse" fill="currentColor" opacity="0.2" />
                <circle cx="13" cy="12" r="3" className="animate-pulse delay-150" fill="currentColor" opacity="0.3" />
              </svg>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-cco-accent-500 rounded-full"></span>
              <span className="sr-only">{vibeMode ? 'Deactivate Vibe Mode' : 'Activate Vibe Mode'}</span>
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-max px-2 py-1 bg-cco-neutral-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {vibeMode ? 'Deactivate Vibe Mode' : 'Activate Vibe Mode'}
              </span>
            </button>
            <Link href="/dashboard/notifications" className="p-1 rounded-md text-cco-neutral-700 hover:bg-cco-neutral-100 relative group">
              <BellIcon className="w-6 h-6" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center bg-cco-accent-500 text-white text-xs font-medium rounded-full min-w-5 h-5 px-1.5">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-max px-2 py-1 bg-cco-neutral-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Notifications
              </span>
            </Link>
            <button className="p-1 rounded-md text-cco-neutral-700 hover:bg-cco-neutral-100">
              <UserIcon className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto p-6 bg-cco-neutral-50 ${isDebugBypassActive ? 'pt-8 mt-6' : 'pt-6'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 