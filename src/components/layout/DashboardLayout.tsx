import React, { useState } from 'react';
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

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleVibeMode = () => {
    setVibeMode(!vibeMode);
    // This is where you would apply vibe mode changes to the UI
    // For now, we'll just show a toast or alert
    alert(vibeMode ? "Exiting vibe mode..." : "Entering vibe mode! Flow state activated.");
  };

  return (
    <div className="flex h-screen bg-cco-neutral-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
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

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
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
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-cco-primary-700' : 'text-cco-neutral-700'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-cco-neutral-200">
            <div className="flex items-center space-x-3 p-2">
              <div className="flex-shrink-0">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://i.pravatar.cc/150?img=68"
                  alt="User avatar"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-cco-neutral-900">Alex Johnson</p>
                <p className="text-xs text-cco-neutral-700">alex@vibecoder.dev</p>
              </div>
            </div>
            <button className="mt-3 flex items-center w-full px-4 py-2 text-sm text-cco-neutral-700 rounded-md hover:bg-cco-neutral-100 transition-colors">
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-cco-neutral-700" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <button
            className="text-cco-neutral-700 lg:hidden"
            onClick={toggleSidebar}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <div className="ml-auto flex items-center space-x-4">
            {/* VIBE Button */}
            <button 
              onClick={toggleVibeMode}
              className={`p-1 rounded-md relative group transition-all duration-300 ${
                vibeMode 
                  ? 'bg-gradient-to-r from-[#6016FC] to-[#00F5D4] text-white shadow-lg' 
                  : 'text-cco-neutral-700 hover:bg-cco-neutral-100'
              }`}
            >
              <svg 
                width="26" 
                height="26" 
                viewBox="0 0 26 26" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-all duration-300 ${vibeMode ? 'scale-110' : 'group-hover:scale-110'}`}
              >
                {/* Brain-circuit fusion shape with electric indigo and neon teal gradient */}
                <path 
                  d="M13 2C7.48 2 3 6.48 3 12C3 17.52 7.48 22 13 22C18.52 22 23 17.52 23 12C23 6.48 18.52 2 13 2ZM13 4C14.82 4 16.5 4.57 17.9 5.54C18.1 5.89 17.89 6.82 17.45 7.71C17.08 8.46 16.43 9.32 16.28 9.76C16.05 10.47 15.88 11.88 16.2 12.38C16.35 12.6 16.74 12.94 17.38 12.48C17.77 12.18 18.19 11.95 18.48 11.95C18.92 11.95 19.44 13.2 19.11 14.03C18.81 14.79 17.67 15.04 16.3 15.25C15.87 15.32 15.46 15.39 15.14 15.47C14.13 15.73 13.95 16.35 13.95 16.63C13.95 16.86 14.05 17.2 14.48 17.2C15.17 17.2 15.3 17.32 15.39 17.53C15.54 17.84 15.29 18.32 15.05 18.32C14.96 18.32 14.86 18.27 14.77 18.17C14.64 18.04 14.53 17.71 13.91 17.71C13.66 17.71 13.33 17.8 13.13 17.92C12.97 18.02 12.88 18.14 12.88 18.26C12.88 18.38 12.96 18.49 13.17 18.6C13.39 18.72 13.55 18.95 13.55 19.24C13.55 19.34 13.41 19.86 13 19.86C12.67 19.86 12.52 19.5 12.31 19.02C12.29 18.97 12.27 18.91 12.24 18.86C12.14 18.66 11.95 18.47 11.64 18.3C11.33 18.13 11.15 17.8 11.15 17.48C11.15 17.3 11.21 17.12 11.32 16.96C11.47 16.72 11.66 16.51 11.86 16.32C12.05 16.14 12.26 15.95 12.42 15.74C12.54 15.57 12.61 15.4 12.61 15.24C12.61 14.83 12.13 14.57 11.82 14.4C11.6 14.27 11.43 14.18 11.43 14.06C11.43 13.89 11.62 13.8 11.82 13.8C12.11 13.8 12.32 14.01 12.53 14.22C12.76 14.45 12.97 14.67 13.3 14.67C13.84 14.67 14.12 14.35 14.12 13.76C14.12 13.64 14.1 13.51 14.05 13.36C13.99 13.2 13.94 13.03 13.94 12.89C13.94 12.61 14.07 12.4 14.37 12.4C14.55 12.4 14.74 12.58 14.93 12.77C15 12.84 15.07 12.91 15.14 12.97C15.4 13.21 15.62 13.1 15.62 12.7C15.62 12.23 15.5 11.86 15.38 11.51C15.27 11.17 15.15 10.85 15.15 10.49C15.15 10.09 15.37 9.89 15.64 9.89C15.82 9.89 15.98 9.97 16.14 10.05C16.28 10.12 16.43 10.19 16.59 10.19C16.69 10.19 16.8 10.16 16.93 10.09C17.25 9.9 17.03 9.24 16.82 8.63C16.69 8.22 16.56 7.83 16.56 7.57C16.56 7.22 16.63 7.07 16.7 6.94C16.78 6.79 16.86 6.65 16.86 6.34C16.86 6.01 16.84 5.65 16.48 5.25C15.56 4.71 14.58 4.38 13.5 4.29V5.4C13.5 5.73 13.31 6 13 6C12.69 6 12.5 5.73 12.5 5.4V4.29C11.44 4.38 10.44 4.7 9.52 5.24C9.16 5.64 9.14 6 9.14 6.34C9.14 6.65 9.22 6.79 9.3 6.94C9.37 7.07 9.44 7.22 9.44 7.57C9.44 7.83 9.31 8.22 9.18 8.63C8.97 9.24 8.75 9.9 9.07 10.09C9.2 10.16 9.31 10.19 9.41 10.19C9.57 10.19 9.72 10.12 9.86 10.05C10.01 9.97 10.18 9.89 10.36 9.89C10.63 9.89 10.85 10.09 10.85 10.49C10.85 10.85 10.73 11.17 10.61 11.51C10.5 11.86 10.38 12.23 10.38 12.7C10.38 13.1 10.6 13.21 10.86 12.97C10.93 12.91 10.99 12.84 11.07 12.77C11.25 12.58 11.45 12.4 11.63 12.4C11.93 12.4 12.06 12.61 12.06 12.89C12.06 13.03 12.01 13.2 11.94 13.36C11.9 13.51 11.87 13.64 11.87 13.76C11.87 14.35 12.16 14.67 12.7 14.67C13.03 14.67 13.24 14.45 13.47 14.22C13.68 14.01 13.89 13.8 14.18 13.8C14.38 13.8 14.57 13.89 14.57 14.06C14.57 14.18 14.4 14.27 14.18 14.4C13.87 14.57 13.39 14.83 13.39 15.24C13.39 15.4 13.46 15.57 13.58 15.74C13.74 15.95 13.95 16.14 14.14 16.32C14.34 16.51 14.53 16.72 14.68 16.96C14.79 17.12 14.85 17.3 14.85 17.48C14.85 17.8 14.67 18.13 14.36 18.3C14.05 18.47 13.86 18.66 13.76 18.86C13.73 18.91 13.71 18.97 13.69 19.02C13.48 19.5 13.33 19.86 13 19.86C12.59 19.86 12.45 19.34 12.45 19.24C12.45 18.95 12.61 18.72 12.83 18.6C13.04 18.49 13.12 18.38 13.12 18.26C13.12 18.14 13.03 18.02 12.87 17.92C12.67 17.8 12.34 17.71 12.09 17.71C11.47 17.71 11.36 18.04 11.23 18.17C11.14 18.27 11.04 18.32 10.95 18.32C10.71 18.32 10.46 17.84 10.61 17.53C10.7 17.32 10.83 17.2 11.52 17.2C11.95 17.2 12.05 16.86 12.05 16.63C12.05 16.35 11.87 15.73 10.86 15.47C10.54 15.39 10.13 15.32 9.7 15.25C8.33 15.04 7.19 14.79 6.89 14.03C6.56 13.2 7.08 11.95 7.52 11.95C7.81 11.95 8.23 12.18 8.62 12.48C9.26 12.94 9.65 12.6 9.8 12.38C10.12 11.88 9.95 10.47 9.72 9.76C9.57 9.32 8.92 8.46 8.55 7.71C8.11 6.82 7.9 5.89 8.1 5.54C9.5 4.57 11.18 4 13 4Z"
                  fill="url(#vibe-gradient)"
                />
                {/* Inner pulse circle */}
                <circle 
                  cx="13" 
                  cy="12" 
                  r="5" 
                  fill="url(#vibe-gradient)" 
                  opacity="0.2" 
                  className="animate-pulse"
                />
                <circle 
                  cx="13" 
                  cy="12" 
                  r="3" 
                  fill="url(#vibe-gradient)" 
                  opacity="0.3" 
                  className="animate-pulse delay-150"
                />
                {/* Define the gradient */}
                <defs>
                  <linearGradient id="vibe-gradient" x1="3" y1="12" x2="23" y2="12" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#6016FC" />
                    <stop offset="1" stopColor="#00F5D4" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Tooltip */}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-cco-neutral-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {vibeMode ? 'Deactivate Vibe Mode' : 'Activate Vibe Mode'}
              </span>
            </button>
            <button className="p-1 rounded-md text-cco-neutral-700 hover:bg-cco-neutral-100 relative">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-0 right-0 block w-2 h-2 bg-cco-accent-500 rounded-full"></span>
            </button>
            <button className="p-1 rounded-md text-cco-neutral-700 hover:bg-cco-neutral-100">
              <UserIcon className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 bg-cco-neutral-50">
          {children}
        </main>
      </div>
    </div>
  );
} 