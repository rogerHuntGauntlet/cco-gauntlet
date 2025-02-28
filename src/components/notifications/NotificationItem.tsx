import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  BellIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  FolderIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { Notification } from '../../types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'meeting':
        return <CalendarIcon className="w-6 h-6 text-cco-primary-500" />;
      case 'document':
        return <DocumentTextIcon className="w-6 h-6 text-cco-accent-500" />;
      case 'action':
        return <ClipboardDocumentCheckIcon className="w-6 h-6 text-green-500" />;
      case 'project':
        return <FolderIcon className="w-6 h-6 text-orange-500" />;
      case 'system':
        return <InformationCircleIcon className="w-6 h-6 text-cco-neutral-500" />;
      default:
        return <BellIcon className="w-6 h-6 text-cco-neutral-400" />;
    }
  };

  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  const NotificationContent = () => (
    <div className={`flex items-start p-4 ${!notification.isRead ? 'bg-cco-primary-50' : ''}`}>
      <div className="flex-shrink-0 mr-3">{getIcon()}</div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h4 className={`text-sm font-medium mb-1 ${!notification.isRead ? 'text-cco-primary-900 font-semibold' : 'text-cco-neutral-800'}`}>
            {notification.title}
          </h4>
          <span className="text-xs text-cco-neutral-500 ml-2">
            {getRelativeTime(notification.createdAt)}
          </span>
        </div>
        <p className="text-sm text-cco-neutral-600 mb-2">{notification.message}</p>
        {!notification.isRead && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="text-xs text-cco-primary-600 hover:text-cco-primary-800 font-medium"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );

  return notification.link ? (
    <Link href={notification.link}>
      <div className="cursor-pointer hover:bg-cco-neutral-50 border-b border-cco-neutral-200 last:border-b-0">
        <NotificationContent />
      </div>
    </Link>
  ) : (
    <div className="border-b border-cco-neutral-200 last:border-b-0">
      <NotificationContent />
    </div>
  );
} 