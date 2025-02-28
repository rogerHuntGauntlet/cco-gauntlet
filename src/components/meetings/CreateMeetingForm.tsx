import React, { useState } from 'react';
import { 
  UserIcon, 
  CalendarIcon, 
  ClockIcon, 
  DocumentTextIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Meeting, User } from '../../types';

interface CreateMeetingFormProps {
  onSubmit: (meeting: Partial<Meeting>) => void;
  onCancel: () => void;
  currentUser: User;
}

export function CreateMeetingForm({ onSubmit, onCancel, currentUser }: CreateMeetingFormProps) {
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('09:00');
  const [duration, setDuration] = useState<number>(30);
  const [summary, setSummary] = useState<string>('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState<string>('');

  const handleAddParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  const handleRemoveParticipant = (email: string) => {
    setParticipants(participants.filter(p => p !== email));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert participants strings to User objects
    const participantUsers: User[] = [
      currentUser,
      ...participants.map(email => ({
        id: email,
        name: email.split('@')[0], // Simple name extraction
        email,
        role: 'client' as const // Using a literal type to match User.role
      }))
    ];
    
    // Create meeting date from date and time inputs
    const meetingDate = new Date(`${date}T${time}`);
    
    const newMeeting: Partial<Meeting> = {
      title,
      date: meetingDate.toISOString(),
      duration,
      summary,
      participants: participantUsers,
      status: 'scheduled',
    };
    
    onSubmit(newMeeting);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-cco-neutral-900">Create New Meeting</h2>
        <Button 
          variant="ghost" 
          onClick={onCancel}
          className="p-1"
        >
          <XMarkIcon className="w-5 h-5" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Meeting Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-cco-neutral-700 mb-1">
              Meeting Title*
            </label>
            <input 
              type="text" 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-cco-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cco-primary-500"
              placeholder="Enter meeting title"
              required
            />
          </div>
          
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-cco-neutral-700 mb-1">
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                Date*
              </label>
              <input 
                type="date" 
                id="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-cco-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cco-primary-500"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-cco-neutral-700 mb-1">
                <ClockIcon className="w-4 h-4 inline mr-1" />
                Time*
              </label>
              <input 
                type="time" 
                id="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-cco-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cco-primary-500"
                required
              />
            </div>
          </div>
          
          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-cco-neutral-700 mb-1">
              <ClockIcon className="w-4 h-4 inline mr-1" />
              Duration (minutes)*
            </label>
            <select 
              id="duration" 
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 border border-cco-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cco-primary-500"
              required
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>
          
          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-cco-neutral-700 mb-1">
              <DocumentTextIcon className="w-4 h-4 inline mr-1" />
              Meeting Summary
            </label>
            <textarea 
              id="summary" 
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 border border-cco-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cco-primary-500"
              placeholder="Brief description of the meeting"
              rows={3}
            />
          </div>
          
          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-cco-neutral-700 mb-1">
              <UserIcon className="w-4 h-4 inline mr-1" />
              Participants
            </label>
            
            <div className="mb-2">
              <div className="flex items-center mb-2">
                <span className="flex items-center px-2 py-1 bg-cco-primary-100 text-cco-primary-800 rounded text-sm mr-2">
                  <UserIcon className="w-3 h-3 mr-1" />
                  {currentUser.name} (You)
                </span>
              </div>
            </div>
            
            <div className="flex">
              <input 
                type="email" 
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                className="flex-1 px-3 py-2 border border-cco-neutral-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-cco-primary-500"
                placeholder="Add participant by email"
              />
              <Button 
                type="button"
                onClick={handleAddParticipant}
                className="rounded-l-none"
              >
                Add
              </Button>
            </div>
            
            {participants.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {participants.map((email) => (
                  <span 
                    key={email} 
                    className="flex items-center px-2 py-1 bg-cco-neutral-100 text-cco-neutral-800 rounded text-sm"
                  >
                    {email}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveParticipant(email)}
                      className="ml-1 text-cco-neutral-500 hover:text-cco-neutral-700"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button 
            variant="outline" 
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            variant="default" 
            type="submit"
          >
            Create Meeting
          </Button>
        </div>
      </form>
    </Card>
  );
} 