import React, { useState } from 'react';
import { 
  BellIcon, 
  CheckCircleIcon, 
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Notification } from '../../types';
import { NotificationItem } from './NotificationItem';
import { Button } from '../ui/Button';

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onClearNotifications: () => void;
}

export function NotificationsList({ 
  notifications, 
  onMarkAllAsRead, 
  onMarkAsRead,
  onClearNotifications
}: NotificationsListProps) {
  const [filter, setFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotifications = notifications
    .filter(n => !filter || n.type === filter)
    .filter(n => 
      searchTerm === '' || 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const filterOptions = [
    { value: null, label: 'All' },
    { value: 'meeting', label: 'Meetings' },
    { value: 'document', label: 'Documents' },
    { value: 'action', label: 'Actions' },
    { value: 'project', label: 'Projects' },
    { value: 'system', label: 'System' },
  ];

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-cco-primary-600 to-cco-primary-800 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BellIcon className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="ml-2 bg-cco-accent-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="space-x-2">
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onMarkAllAsRead}
                className="bg-transparent border-white text-white hover:bg-cco-primary-700 text-xs"
              >
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Mark all as read
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearNotifications}
              className="bg-transparent border-white text-white hover:bg-cco-primary-700 text-xs"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              Clear all
            </Button>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pr-8 rounded border border-cco-primary-400 bg-cco-primary-700 text-white placeholder-cco-primary-300 focus:outline-none focus:ring-2 focus:ring-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cco-primary-300 hover:text-white"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex overflow-x-auto bg-cco-neutral-100 border-b border-cco-neutral-200">
        {filterOptions.map((option) => (
          <button
            key={option.label}
            onClick={() => setFilter(option.value)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              filter === option.value
                ? 'text-cco-primary-600 border-b-2 border-cco-primary-600'
                : 'text-cco-neutral-600 hover:text-cco-primary-800 hover:bg-cco-neutral-200'
            }`}
          >
            {option.label}
            {option.value === null && (
              <span className="ml-1 bg-cco-neutral-200 text-cco-neutral-700 text-xs px-1.5 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="max-h-[600px] overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        ) : (
          <div className="p-8 text-center text-cco-neutral-500">
            {searchTerm || filter ? (
              <>
                <div className="flex justify-center mb-2">
                  <FunnelIcon className="w-8 h-8 text-cco-neutral-400" />
                </div>
                <p className="text-cco-neutral-600 mb-2">No matching notifications found</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter(null);
                  }}
                  className="text-cco-primary-600 hover:text-cco-primary-800 text-sm font-medium"
                >
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-2">
                  <BellIcon className="w-8 h-8 text-cco-neutral-400" />
                </div>
                <p className="text-cco-neutral-600">You don&apos;t have any notifications</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 