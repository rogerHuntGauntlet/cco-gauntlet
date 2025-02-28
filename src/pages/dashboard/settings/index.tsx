import React, { useState } from 'react';
import { NextPage } from 'next';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { UserSettings } from '../../../types';
import {
  UserIcon,
  BellIcon,
  SunIcon,
  EyeIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const TABS = [
  { id: 'profile', name: 'Profile', icon: UserIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon },
  { id: 'appearance', name: 'Appearance', icon: SunIcon },
  { id: 'accessibility', name: 'Accessibility', icon: EyeIcon },
  { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
  { id: 'integrations', name: 'Integrations', icon: ArrowPathIcon },
];

// Mock data for demonstration purposes
const mockSettings: UserSettings = {
  id: '1',
  userId: 'user1',
  emailNotifications: {
    meetings: true,
    documents: true,
    actionItems: true,
    projectUpdates: false,
  },
  theme: 'light',
  language: 'English',
  timezone: 'America/New_York',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  accessibility: {
    highContrast: false,
    largeText: false,
    reduceMotion: false,
  },
  privacy: {
    shareUsageData: true,
    allowCookies: true,
  },
  integration: {
    connectedServices: [
      {
        id: 'github',
        name: 'GitHub',
        connected: true,
        lastSync: '2023-08-15T12:00:00Z',
      },
      {
        id: 'google',
        name: 'Google Calendar',
        connected: true,
        lastSync: '2023-08-14T10:30:00Z',
      },
      {
        id: 'slack',
        name: 'Slack',
        connected: false,
      },
    ],
  },
};

const Settings: NextPage = () => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [settings, setSettings] = useState<UserSettings>(mockSettings);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleInputChange = (
    section: keyof UserSettings,
    key: string,
    value: any
  ) => {
    setSettings((prev) => {
      // Handle nested objects
      if (typeof prev[section] === 'object' && prev[section] !== null) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [key]: value,
          },
        };
      }
      // Handle top-level properties
      return {
        ...prev,
        [key]: value,
      };
    });
    setIsDirty(true);
  };

  const handleSave = () => {
    // Here you would typically save the settings to your backend
    console.log('Saving settings:', settings);
    setIsDirty(false);
    // Show a success message to the user
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    setSettings(mockSettings);
    setIsDirty(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-12">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-cco-neutral-900">Settings</h1>
            <p className="mt-1 text-sm text-cco-neutral-700">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <Button
              variant="secondary"
              onClick={handleReset}
              disabled={!isDirty}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isDirty}>
              Save Changes
            </Button>
          </div>
        </div>

        <div className="md:grid md:grid-cols-12 md:gap-6">
          {/* Sidebar / Tabs */}
          <div className="md:col-span-3">
            <Card className="sticky top-6">
              <nav className="space-y-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                      activeTab === tab.id
                        ? 'bg-cco-primary-50 text-cco-primary-700'
                        : 'text-cco-neutral-700 hover:bg-cco-neutral-100'
                    }`}
                  >
                    <tab.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        activeTab === tab.id
                          ? 'text-cco-primary-700'
                          : 'text-cco-neutral-600'
                      }`}
                      aria-hidden="true"
                    />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main content */}
          <div className="mt-5 md:mt-0 md:col-span-9">
            <Card>
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-lg font-medium leading-6 text-cco-neutral-900 mb-6">
                    Profile Information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-cco-neutral-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="mt-1 block w-full rounded-md border-cco-neutral-300 shadow-sm focus:border-cco-primary-500 focus:ring-cco-primary-500 sm:text-sm"
                        placeholder="John Doe"
                        value="Alex Johnson"
                        onChange={() => setIsDirty(true)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-cco-neutral-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="mt-1 block w-full rounded-md border-cco-neutral-300 shadow-sm focus:border-cco-primary-500 focus:ring-cco-primary-500 sm:text-sm"
                        placeholder="john.doe@example.com"
                        value="alex@vibecoder.dev"
                        onChange={() => setIsDirty(true)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="avatar"
                        className="block text-sm font-medium text-cco-neutral-700"
                      >
                        Avatar
                      </label>
                      <div className="mt-1 flex items-center space-x-5">
                        <img
                          className="h-16 w-16 rounded-full"
                          src="https://i.pravatar.cc/150?img=68"
                          alt="User avatar"
                        />
                        <Button variant="secondary" size="sm">
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-lg font-medium leading-6 text-cco-neutral-900 mb-6">
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="meetings"
                          name="meetings"
                          type="checkbox"
                          checked={settings.emailNotifications.meetings}
                          onChange={(e) =>
                            handleInputChange(
                              'emailNotifications',
                              'meetings',
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded border-cco-neutral-300 text-cco-primary-600 focus:ring-cco-primary-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="meetings"
                          className="font-medium text-cco-neutral-700"
                        >
                          Meeting updates
                        </label>
                        <p className="text-cco-neutral-500">
                          Get notified about meeting confirmations, cancellations and
                          updates.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="documents"
                          name="documents"
                          type="checkbox"
                          checked={settings.emailNotifications.documents}
                          onChange={(e) =>
                            handleInputChange(
                              'emailNotifications',
                              'documents',
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded border-cco-neutral-300 text-cco-primary-600 focus:ring-cco-primary-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="documents"
                          className="font-medium text-cco-neutral-700"
                        >
                          Document changes
                        </label>
                        <p className="text-cco-neutral-500">
                          Get notified when documents are created, updated or shared with
                          you.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="actionItems"
                          name="actionItems"
                          type="checkbox"
                          checked={settings.emailNotifications.actionItems}
                          onChange={(e) =>
                            handleInputChange(
                              'emailNotifications',
                              'actionItems',
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded border-cco-neutral-300 text-cco-primary-600 focus:ring-cco-primary-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="actionItems"
                          className="font-medium text-cco-neutral-700"
                        >
                          Action items
                        </label>
                        <p className="text-cco-neutral-500">
                          Get notified when you are assigned to action items or when they
                          are updated.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="projectUpdates"
                          name="projectUpdates"
                          type="checkbox"
                          checked={settings.emailNotifications.projectUpdates}
                          onChange={(e) =>
                            handleInputChange(
                              'emailNotifications',
                              'projectUpdates',
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded border-cco-neutral-300 text-cco-primary-600 focus:ring-cco-primary-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="projectUpdates"
                          className="font-medium text-cco-neutral-700"
                        >
                          Project updates
                        </label>
                        <p className="text-cco-neutral-500">
                          Get notified about project status changes and major updates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div>
                  <h3 className="text-lg font-medium leading-6 text-cco-neutral-900 mb-6">
                    Appearance and Localization
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="theme"
                        className="block text-sm font-medium text-cco-neutral-700"
                      >
                        Theme
                      </label>
                      <select
                        id="theme"
                        name="theme"
                        className="mt-1 block w-full rounded-md border-cco-neutral-300 shadow-sm focus:border-cco-primary-500 focus:ring-cco-primary-500 sm:text-sm"
                        value={settings.theme}
                        onChange={(e) =>
                          handleInputChange('theme', 'theme', e.target.value)
                        }
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="language"
                        className="block text-sm font-medium text-cco-neutral-700"
                      >
                        Language
                      </label>
                      <select
                        id="language"
                        name="language"
                        className="mt-1 block w-full rounded-md border-cco-neutral-300 shadow-sm focus:border-cco-primary-500 focus:ring-cco-primary-500 sm:text-sm"
                        value={settings.language}
                        onChange={(e) =>
                          handleInputChange('language', 'language', e.target.value)
                        }
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Japanese">Japanese</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="timezone"
                        className="block text-sm font-medium text-cco-neutral-700"
                      >
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        name="timezone"
                        className="mt-1 block w-full rounded-md border-cco-neutral-300 shadow-sm focus:border-cco-primary-500 focus:ring-cco-primary-500 sm:text-sm"
                        value={settings.timezone}
                        onChange={(e) =>
                          handleInputChange('timezone', 'timezone', e.target.value)
                        }
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="dateFormat"
                        className="block text-sm font-medium text-cco-neutral-700"
                      >
                        Date Format
                      </label>
                      <select
                        id="dateFormat"
                        name="dateFormat"
                        className="mt-1 block w-full rounded-md border-cco-neutral-300 shadow-sm focus:border-cco-primary-500 focus:ring-cco-primary-500 sm:text-sm"
                        value={settings.dateFormat}
                        onChange={(e) =>
                          handleInputChange('dateFormat', 'dateFormat', e.target.value)
                        }
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="timeFormat"
                        className="block text-sm font-medium text-cco-neutral-700"
                      >
                        Time Format
                      </label>
                      <select
                        id="timeFormat"
                        name="timeFormat"
                        className="mt-1 block w-full rounded-md border-cco-neutral-300 shadow-sm focus:border-cco-primary-500 focus:ring-cco-primary-500 sm:text-sm"
                        value={settings.timeFormat}
                        onChange={(e) =>
                          handleInputChange('timeFormat', 'timeFormat', e.target.value)
                        }
                      >
                        <option value="12h">12-hour (1:30 PM)</option>
                        <option value="24h">24-hour (13:30)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'accessibility' && (
                <div>
                  <h3 className="text-lg font-medium leading-6 text-cco-neutral-900 mb-6">
                    Accessibility
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="highContrast"
                          name="highContrast"
                          type="checkbox"
                          checked={settings.accessibility.highContrast}
                          onChange={(e) =>
                            handleInputChange(
                              'accessibility',
                              'highContrast',
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded border-cco-neutral-300 text-cco-primary-600 focus:ring-cco-primary-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="highContrast"
                          className="font-medium text-cco-neutral-700"
                        >
                          High contrast mode
                        </label>
                        <p className="text-cco-neutral-500">
                          Increase contrast between text and background
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="largeText"
                          name="largeText"
                          type="checkbox"
                          checked={settings.accessibility.largeText}
                          onChange={(e) =>
                            handleInputChange(
                              'accessibility',
                              'largeText',
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded border-cco-neutral-300 text-cco-primary-600 focus:ring-cco-primary-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="largeText"
                          className="font-medium text-cco-neutral-700"
                        >
                          Large text
                        </label>
                        <p className="text-cco-neutral-500">
                          Increase text size throughout the application
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="reduceMotion"
                          name="reduceMotion"
                          type="checkbox"
                          checked={settings.accessibility.reduceMotion}
                          onChange={(e) =>
                            handleInputChange(
                              'accessibility',
                              'reduceMotion',
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded border-cco-neutral-300 text-cco-primary-600 focus:ring-cco-primary-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="reduceMotion"
                          className="font-medium text-cco-neutral-700"
                        >
                          Reduce motion
                        </label>
                        <p className="text-cco-neutral-500">
                          Minimize animations and transitions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div>
                  <h3 className="text-lg font-medium leading-6 text-cco-neutral-900 mb-6">
                    Privacy and Data
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="shareUsageData"
                          name="shareUsageData"
                          type="checkbox"
                          checked={settings.privacy.shareUsageData}
                          onChange={(e) =>
                            handleInputChange(
                              'privacy',
                              'shareUsageData',
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded border-cco-neutral-300 text-cco-primary-600 focus:ring-cco-primary-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="shareUsageData"
                          className="font-medium text-cco-neutral-700"
                        >
                          Share anonymous usage data
                        </label>
                        <p className="text-cco-neutral-500">
                          Help us improve by allowing collection of anonymous usage statistics
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="allowCookies"
                          name="allowCookies"
                          type="checkbox"
                          checked={settings.privacy.allowCookies}
                          onChange={(e) =>
                            handleInputChange(
                              'privacy',
                              'allowCookies',
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded border-cco-neutral-300 text-cco-primary-600 focus:ring-cco-primary-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="allowCookies"
                          className="font-medium text-cco-neutral-700"
                        >
                          Allow cookies
                        </label>
                        <p className="text-cco-neutral-500">
                          We use cookies to enhance your experience and remember your preferences
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-cco-neutral-200">
                      <Button variant="destructive">Delete My Account</Button>
                      <p className="mt-2 text-xs text-cco-neutral-500">
                        This action is irreversible and will delete all your data permanently
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div>
                  <h3 className="text-lg font-medium leading-6 text-cco-neutral-900 mb-6">
                    Connected Services
                  </h3>
                  <div className="space-y-6">
                    {settings.integration.connectedServices.map(service => (
                      <div key={service.id} className="flex items-center justify-between p-4 border border-cco-neutral-200 rounded-md">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-cco-neutral-100 rounded-md flex items-center justify-center text-cco-neutral-700">
                            {service.id === 'github' && (
                              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.29.1-2.69 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.4.2 2.44.1 2.69.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                              </svg>
                            )}
                            {service.id === 'google' && (
                              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                              </svg>
                            )}
                            {service.id === 'slack' && (
                              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-cco-neutral-900">{service.name}</h4>
                            {service.connected ? (
                              <div className="flex items-center mt-1">
                                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                <span className="text-xs text-cco-neutral-600">Connected
                                  {service.lastSync && ` - Last synced ${new Date(service.lastSync).toLocaleDateString()}`}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center mt-1">
                                <span className="h-2 w-2 rounded-full bg-cco-neutral-300 mr-2"></span>
                                <span className="text-xs text-cco-neutral-600">Not connected</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant={service.connected ? "outline" : "default"}
                          size="sm"
                        >
                          {service.connected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings; 