import React from 'react';
import { 
  CalendarIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  BoltIcon,
  ArrowRightIcon,
  SparklesIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MeetingCard } from '../meetings/MeetingCard';
import { DocumentCard } from '../meetings/DocumentCard';
import { Dashboard as DashboardType } from '../../types';
import Link from 'next/link';

interface DashboardProps {
  data: DashboardType;
}

export function Dashboard({ data }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-cco-primary-600 via-cco-primary-700 to-cco-primary-900 rounded-xl p-6 sm:p-8 text-white shadow-lg overflow-hidden relative">
        {/* Animated background effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white transform translate-x-1/2 translate-y-1/2 animate-pulse"></div>
        </div>
        
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center mb-3">
            <SparklesIcon className="w-6 h-6 text-yellow-300 mr-2 animate-spin-slow" />
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 font-extrabold">VibeCoder</span>, Alex!
            </h1>
          </div>
          <p className="text-cco-primary-100 mb-4 text-lg">
            Your meeting with Jordan Smith about the E-Commerce Platform has been analyzed. 
            We&apos;ve prepared some resources based on the discussion.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button 
              variant="accent" 
              size="lg" 
              className="bg-white text-cco-primary-800 hover:bg-cco-neutral-100 hover:shadow-lg transition-all duration-300 font-medium"
            >
              <DocumentTextIcon className="w-5 h-5 mr-2 text-cco-accent-600" />
              <span className="text-cco-primary-900 font-semibold">View Meeting Documents</span>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-transparent border-white text-white hover:bg-cco-primary-700 hover:text-white hover:border-transparent hover:shadow-lg transition-all duration-300"
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              Schedule Follow-up
            </Button>
          </div>
        </div>
      </div>

      {/* Recent meeting summary */}
      {data.recentMeetings.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-cco-neutral-900">Recent Meeting</h2>
            <Button variant="ghost" className="text-sm">
              View all meetings <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <MeetingCard meeting={data.recentMeetings[0]} />
            </div>
            
            <div className="bg-cco-neutral-50 rounded-lg p-5">
              <h3 className="font-semibold text-lg mb-3 text-cco-neutral-900">Key Highlights</h3>
              <ul className="space-y-2">
                {data.recentMeetings[0].keyHighlights?.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <BoltIcon className="w-5 h-5 text-cco-accent-500 flex-shrink-0 mt-0.5 mr-2" />
                    <span className="text-sm text-cco-neutral-700">{highlight}</span>
                  </li>
                ))}
              </ul>
              
              {data.recentMeetings[0].actionItems && data.recentMeetings[0].actionItems.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-3 text-cco-neutral-900">Action Items</h3>
                  <ul className="space-y-3">
                    {data.recentMeetings[0].actionItems.map((item) => (
                      <li key={item.id} className="flex items-start">
                        <span className={`w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0 ${
                          item.priority === 'high' 
                            ? 'bg-red-500' 
                            : item.priority === 'medium' 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`} />
                        <div>
                          <p className="text-sm text-cco-neutral-700">{item.description}</p>
                          {item.dueDate && (
                            <p className="text-xs text-cco-neutral-700 mt-1">
                              <ClockIcon className="w-3.5 h-3.5 inline-block mr-1" />
                              Due {new Date(item.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Generated documents */}
      {data.recentDocuments.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-cco-neutral-900">Generated Documents</h2>
            <Button variant="ghost" className="text-sm">
              View all documents <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.recentDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>
      )}

      {/* Active projects */}
      {data.activeProjects.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-cco-neutral-900">Active Projects</h2>
            <Button variant="ghost" className="text-sm">
              View all projects <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {data.activeProjects.map((project) => (
              <Card key={project.id} hover={true} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                    <span className="text-xs text-cco-neutral-700">
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-1">{project.name}</h3>
                  <p className="text-sm text-cco-neutral-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 bg-cco-neutral-100 text-cco-neutral-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-cco-neutral-700">
                    <span>{project.meetings.length} Meetings</span>
                    <span>{project.documents.length} Documents</span>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Project
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent notifications */}
      {data.notifications && data.notifications.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <BellIcon className="w-5 h-5 text-cco-accent-500 mr-2" />
              <h2 className="text-xl font-semibold text-cco-neutral-900">Recent Notifications</h2>
              {data.notifications.filter(n => !n.isRead).length > 0 && (
                <span className="ml-2 bg-cco-accent-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {data.notifications.filter(n => !n.isRead).length} new
                </span>
              )}
            </div>
            <Link href="/notifications">
              <Button variant="ghost" className="text-sm">
                View all notifications <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-1">
            {data.notifications.slice(0, 3).map((notification) => (
              <Link 
                key={notification.id} 
                href={notification.link || '/notifications'}
                className={`block p-3 rounded-md hover:bg-cco-neutral-50 ${!notification.isRead ? 'bg-cco-primary-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {notification.type === 'meeting' ? (
                      <CalendarIcon className="w-5 h-5 text-cco-primary-500" />
                    ) : notification.type === 'document' ? (
                      <DocumentTextIcon className="w-5 h-5 text-cco-accent-500" />
                    ) : notification.type === 'action' ? (
                      <ClockIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <BoltIcon className="w-5 h-5 text-cco-neutral-500" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className={`text-sm font-medium mb-1 ${!notification.isRead ? 'text-cco-primary-900 font-semibold' : 'text-cco-neutral-800'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-cco-neutral-500 ml-2">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-cco-neutral-600">{notification.message}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 