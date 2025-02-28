import React, { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { 
  CalendarIcon, 
  PlusIcon, 
  ArrowPathIcon,
  FunnelIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { MeetingCard } from '../../../components/meetings/MeetingCard';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Meeting, User } from '../../../types';
import { upcomingMeeting, recentMeeting, currentUser } from '../../../utils/mockData'; // Temporary mock data
import { 
  CalendarConnection, 
  CalendarProvider, 
  connectToCalendarProvider,
  syncCalendarEvents,
  sendCalendarInvite,
  generateICSFile
} from '../../../utils/calendarIntegration';
import { CreateMeetingForm } from '../../../components/meetings/CreateMeetingForm';

// Placeholder for meetings data
const mockMeetings: Meeting[] = [
  { ...upcomingMeeting, id: 'm2', title: 'API Integration Planning', date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() },
  { ...upcomingMeeting, id: 'm3', title: 'Client Status Review', date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString() },
  { ...upcomingMeeting, id: 'm4', title: 'Sprint Planning', date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toISOString() },
  { ...recentMeeting, id: 'm1', title: 'E-Commerce Platform Initial Planning', status: 'completed' }
];

const MeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [calendarConnection, setCalendarConnection] = useState<CalendarConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [sendingInvite, setSendingInvite] = useState<boolean>(false);
  const [inviteSuccess, setInviteSuccess] = useState<boolean>(false);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  // Filter meetings to show only upcoming ones (scheduled status)
  const upcomingMeetings = meetings.filter(meeting => meeting.status === 'scheduled');
  const pastMeetings = meetings.filter(meeting => meeting.status !== 'scheduled');

  const handleConnectCalendar = async () => {
    setIsConnecting(true);
    try {
      // In a real app, we would show a provider selection dialog
      const provider: CalendarProvider = 'google';
      const connection = await connectToCalendarProvider(provider);
      setCalendarConnection(connection);
      
      // Sync events after connection
      handleSyncEvents(connection);
    } catch (error) {
      console.error('Failed to connect to calendar:', error);
      alert('Failed to connect to calendar. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleSyncEvents = async (connection: CalendarConnection) => {
    setIsSyncing(true);
    try {
      const externalEvents = await syncCalendarEvents(connection);
      
      // In a real app, we would merge these with existing meetings
      // For now, we'll just log them
      console.log('Synced events:', externalEvents);
      
      // Update connection with new sync time
      setCalendarConnection({
        ...connection,
        lastSynced: new Date()
      });
    } catch (error) {
      console.error('Failed to sync calendar events:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSendInvite = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowInviteModal(true);
    setInviteSuccess(false);
  };

  const handleCloseModal = () => {
    setShowInviteModal(false);
    setSelectedMeeting(null);
  };

  const handleSubmitInvite = async (emails: string[]) => {
    if (!selectedMeeting || !calendarConnection) {
      alert('Please connect to a calendar first');
      return;
    }
    
    setSendingInvite(true);
    try {
      await sendCalendarInvite(selectedMeeting, emails, calendarConnection);
      setInviteSuccess(true);
      
      // Clear form after short delay
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (error) {
      console.error('Failed to send calendar invite:', error);
      alert('Failed to send invite: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSendingInvite(false);
    }
  };
  
  const handleDownloadICS = (meeting: Meeting) => {
    const icsContent = generateICSFile(meeting);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${meeting.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleCreateMeeting = () => {
    setShowCreateForm(true);
  };
  
  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };
  
  const handleSaveMeeting = (meetingData: Partial<Meeting>) => {
    // Create a new meeting with the provided data
    const newMeeting: Meeting = {
      id: `m${new Date().getTime()}`, // Generate a unique ID
      title: meetingData.title || 'Untitled Meeting',
      date: meetingData.date || new Date().toISOString(),
      duration: meetingData.duration || 30,
      participants: meetingData.participants || [currentUser],
      projectId: 'p1', // Default project ID
      status: 'scheduled',
      summary: meetingData.summary,
      actionItems: [],
      documents: []
    };
    
    // Add the new meeting to the list
    setMeetings([newMeeting, ...meetings]);
    
    // Close the form
    setShowCreateForm(false);
  };

  const renderContent = () => {
    if (showCreateForm) {
      return (
        <CreateMeetingForm 
          onSubmit={handleSaveMeeting}
          onCancel={handleCancelCreate}
          currentUser={currentUser}
        />
      );
    }

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-cco-neutral-900">Meetings</h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleConnectCalendar}
              disabled={isConnecting || !!calendarConnection}
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              {isConnecting ? 'Connecting...' : calendarConnection ? 'Calendar Connected' : 'Connect Calendar'}
            </Button>
            <Button 
              variant="default"
              onClick={handleCreateMeeting}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              New Meeting
            </Button>
          </div>
        </div>

        {/* Calendar integration status */}
        {calendarConnection && (
          <Card className="mb-6 bg-cco-primary-50 border-cco-primary-200">
            <div className="flex items-center">
              <CalendarIcon className="w-6 h-6 text-cco-primary-600 mr-3" />
              <div>
                <h3 className="font-medium text-cco-neutral-900">Calendar Connected</h3>
                <p className="text-sm text-cco-neutral-700">
                  Connected to {calendarConnection.provider.charAt(0).toUpperCase() + calendarConnection.provider.slice(1)} Calendar 
                  {calendarConnection.email && <span> ({calendarConnection.email})</span>}
                  {calendarConnection.lastSynced && 
                    <span className="ml-1">
                      • Last synced: {new Date(calendarConnection.lastSynced).toLocaleTimeString()}
                    </span>
                  }
                </p>
              </div>
              <Button 
                variant="ghost" 
                className="ml-auto"
                onClick={() => calendarConnection && handleSyncEvents(calendarConnection)}
                disabled={isSyncing}
              >
                <ArrowPathIcon className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync'}
              </Button>
            </div>
          </Card>
        )}

        {/* Upcoming meetings section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-cco-neutral-900">Upcoming Meetings</h2>
            <Button 
              variant="ghost"
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          {upcomingMeetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="relative">
                  <MeetingCard meeting={meeting} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-cco-neutral-50 border-dashed">
              <div className="flex flex-col items-center justify-center py-8">
                <CalendarIcon className="w-12 h-12 text-cco-neutral-400 mb-4" />
                <h3 className="font-medium text-cco-neutral-700 mb-2">No upcoming meetings</h3>
                <p className="text-sm text-cco-neutral-600 text-center max-w-md mb-4">
                  You don't have any scheduled meetings. Create a new meeting or connect your calendar to import existing ones.
                </p>
                <Button
                  variant="default"
                  onClick={handleCreateMeeting}
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Past meetings section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-cco-neutral-900">Past Meetings</h2>
          </div>
          
          {pastMeetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastMeetings.map((meeting) => (
                <div key={meeting.id}>
                  <MeetingCard meeting={meeting} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-cco-neutral-50 border-dashed">
              <div className="flex flex-col items-center justify-center py-8">
                <DocumentTextIcon className="w-12 h-12 text-cco-neutral-400 mb-4" />
                <h3 className="font-medium text-cco-neutral-700 mb-2">No past meetings</h3>
                <p className="text-sm text-cco-neutral-600 text-center max-w-md">
                  You don't have any past meetings. Once you've had meetings, they'll appear here.
                </p>
              </div>
            </Card>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Meetings | CCO VibeCoder Platform</title>
        <meta
          name="description"
          content="Manage your meetings, schedule new ones, and review past meetings"
        />
      </Head>
      
      <DashboardLayout>
        <div className="container mx-auto px-4">
          {renderContent()}
        </div>
      </DashboardLayout>
    </>
  );
};

export default MeetingsPage; 