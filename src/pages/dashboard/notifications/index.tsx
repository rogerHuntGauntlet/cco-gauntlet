import React, { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { NotificationsList } from '../../../components/notifications/NotificationsList';
import { Notification } from '../../../types';
import { notifications as initialNotifications } from '../../../utils/mockData';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  return (
    <>
      <Head>
        <title>Notifications | CCO VibeCoder Platform</title>
        <meta
          name="description"
          content="View and manage your notifications"
        />
      </Head>
      
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <NotificationsList 
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearNotifications={handleClearNotifications}
          />
        </div>
      </DashboardLayout>
    </>
  );
} 