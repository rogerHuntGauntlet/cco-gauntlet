import React from 'react';
import Link from 'next/link';
import { format, formatDistance } from 'date-fns';
import { CalendarIcon, ClockIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline';
import { Meeting } from '../../types';
import { Card } from '../ui/Card';

interface MeetingCardProps {
  meeting: Meeting;
  showActions?: boolean;
}

export function MeetingCard({ meeting, showActions = true }: MeetingCardProps) {
  const meetingDate = new Date(meeting.date);
  const formattedDate = format(meetingDate, 'MMM d, yyyy');
  const formattedTime = format(meetingDate, 'h:mm a');
  const relativeTime = formatDistance(meetingDate, new Date(), { addSuffix: true });
  
  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
  };
  
  return (
    <Card hover={true} className="overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[meeting.status]}`}>
            {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
          </span>
          <span className="text-xs text-cco-neutral-700">{relativeTime}</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 text-cco-neutral-900">{meeting.title}</h3>
        
        {meeting.summary && (
          <p className="text-sm text-cco-neutral-600 mb-4 line-clamp-2">{meeting.summary}</p>
        )}
        
        <div className="mt-auto space-y-2">
          <div className="flex items-center text-xs text-cco-neutral-700">
            <CalendarIcon className="w-4 h-4 mr-1.5" />
            <span>{formattedDate}</span>
            <span className="mx-2">•</span>
            <ClockIcon className="w-4 h-4 mr-1.5" />
            <span>{formattedTime}</span>
            <span className="mx-2">•</span>
            <span>{meeting.duration} min</span>
          </div>
          
          <div className="flex items-center text-xs text-cco-neutral-700">
            <UserIcon className="w-4 h-4 mr-1.5" />
            <span>{meeting.participants.length} participants</span>
            {meeting.documents && meeting.documents.length > 0 && (
              <>
                <span className="mx-2">•</span>
                <DocumentTextIcon className="w-4 h-4 mr-1.5" />
                <span>{meeting.documents.length} documents</span>
              </>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="mt-4 pt-4 border-t border-cco-neutral-200">
            <Link 
              href={`/meetings/${meeting.id}`}
              className="text-sm font-medium text-cco-primary-600 hover:text-cco-primary-700"
            >
              View details
            </Link>
            
            {meeting.recordingUrl && (
              <Link 
                href={meeting.recordingUrl}
                className="text-sm font-medium text-cco-primary-600 hover:text-cco-primary-700 ml-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch recording
              </Link>
            )}
          </div>
        )}
      </div>
    </Card>
  );
} 