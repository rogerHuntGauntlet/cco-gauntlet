import React, { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { 
  DocumentTextIcon, 
  PlusIcon, 
  FolderIcon,
  FunnelIcon,
  ArrowUpTrayIcon,
  DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

// Mock data for documents
const mockDocuments = [
  {
    id: 'd1',
    title: 'Project Requirements Document',
    type: 'doc',
    createdAt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    size: '1.2 MB',
    owner: 'Alex Johnson',
    tags: ['requirements', 'planning'],
    path: '/projects/p1/docs',
    sharedWith: ['user2', 'user3']
  },
  {
    id: 'd2',
    title: 'Meeting Minutes - Sprint Planning',
    type: 'doc',
    createdAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    size: '450 KB',
    owner: 'Alex Johnson',
    tags: ['meeting', 'sprint'],
    path: '/meetings/m4/docs',
    sharedWith: ['user2', 'user4', 'user5']
  },
  {
    id: 'd3',
    title: 'Product Roadmap 2023',
    type: 'spreadsheet',
    createdAt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    size: '2.1 MB',
    owner: 'Alex Johnson',
    tags: ['planning', 'roadmap'],
    path: '/projects/p1/docs',
    sharedWith: ['user2']
  },
  {
    id: 'd4',
    title: 'Client Presentation',
    type: 'presentation',
    createdAt: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    size: '5.4 MB',
    owner: 'Alex Johnson',
    tags: ['client', 'presentation'],
    path: '/projects/p2/docs',
    sharedWith: ['user3', 'user4']
  },
  {
    id: 'd5',
    title: 'Quarterly Financial Report',
    type: 'spreadsheet',
    createdAt: new Date(new Date().getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(new Date().getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    size: '1.8 MB',
    owner: 'Finance Team',
    tags: ['finance', 'quarterly'],
    path: '/finance/reports',
    sharedWith: ['user2', 'user3', 'user4', 'user5']
  }
];

// Mock folders
const mockFolders = [
  {
    id: 'f1',
    name: 'Projects',
    path: '/projects',
    documentCount: 12,
    lastModified: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'f2',
    name: 'Meetings',
    path: '/meetings',
    documentCount: 8,
    lastModified: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'f3',
    name: 'Templates',
    path: '/templates',
    documentCount: 5,
    lastModified: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Near the beginning of the file, add these type definitions
interface Document {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  size: string;
  owner: string;
  tags: string[];
  path: string;
  sharedWith: string[];
}

interface Folder {
  id: string;
  name: string;
  path: string;
  documentCount: number;
  lastModified: string;
}

type DocumentType = 'all' | 'doc' | 'spreadsheet' | 'presentation' | 'pdf';

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<DocumentType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Filter documents based on selected type and search query
  const filteredDocuments = documents.filter(doc => {
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleCreateNewDoc = () => {
    // In a real app, this would open a document editor or template selector
    console.log('Create new document');
  };

  const handleUploadFile = () => {
    setShowUploadModal(true);
  };

  const handleDocumentClick = (docId: string) => {
    // In a real app, this would open the document
    console.log('Open document', docId);
  };

  const handleFolderClick = (folderId: string) => {
    // In a real app, this would navigate to the folder
    console.log('Open folder', folderId);
  };

  // Document card component for grid view
  const DocumentCard = ({ document }: { document: Document }) => {
    // Select icon based on document type
    let TypeIcon = DocumentTextIcon;
    if (document.type === 'spreadsheet') {
      TypeIcon = DocumentDuplicateIcon;
    } else if (document.type === 'presentation') {
      TypeIcon = DocumentTextIcon;
    }
    
    const formattedDate = new Date(document.updatedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    return (
      <Card hover onClick={() => handleDocumentClick(document.id)} className="cursor-pointer h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-3">
            <TypeIcon className="w-8 h-8 text-cco-primary-500 mr-3" />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-cco-neutral-900 truncate">{document.title}</h3>
              <p className="text-xs text-cco-neutral-600">
                {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-cco-neutral-700 mt-auto">
            <span>Updated {formattedDate}</span>
            <span>{document.size}</span>
          </div>
          
          {document.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {document.tags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cco-neutral-100 text-cco-neutral-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    );
  };

  // Folder card component for grid view
  const FolderCard = ({ folder }: { folder: Folder }) => {
    const formattedDate = new Date(folder.lastModified).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    return (
      <Card hover onClick={() => handleFolderClick(folder.id)} className="cursor-pointer h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-3">
            <FolderIcon className="w-8 h-8 text-cco-accent-500 mr-3" />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-cco-neutral-900 truncate">{folder.name}</h3>
              <p className="text-xs text-cco-neutral-600">
                {folder.documentCount} document{folder.documentCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-cco-neutral-700 mt-auto">
            <span>Modified {formattedDate}</span>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <Head>
        <title>Documents | CCO VibeCoder Platform</title>
        <meta
          name="description"
          content="Manage your documents, files, and folders"
        />
      </Head>
      
      <DashboardLayout>
        <div className="container mx-auto px-4">
          {/* Header with actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-cco-neutral-900">Documents</h1>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleUploadFile}
              >
                <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                Upload
              </Button>
              <Button
                variant="default"
                onClick={handleCreateNewDoc}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                New Document
              </Button>
            </div>
          </div>
          
          {/* Filters and search */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <div className="flex space-x-2">
              <Button
                variant={selectedType === 'all' ? 'ghost' : 'ghost'}
                size="sm"
                onClick={() => setSelectedType('all')}
                className={selectedType === 'all' ? 'bg-cco-neutral-100' : ''}
              >
                All
              </Button>
              <Button
                variant={selectedType === 'doc' ? 'ghost' : 'ghost'}
                size="sm"
                onClick={() => setSelectedType('doc')}
                className={selectedType === 'doc' ? 'bg-cco-neutral-100' : ''}
              >
                Documents
              </Button>
              <Button
                variant={selectedType === 'spreadsheet' ? 'ghost' : 'ghost'}
                size="sm"
                onClick={() => setSelectedType('spreadsheet')}
                className={selectedType === 'spreadsheet' ? 'bg-cco-neutral-100' : ''}
              >
                Spreadsheets
              </Button>
              <Button
                variant={selectedType === 'presentation' ? 'ghost' : 'ghost'}
                size="sm"
                onClick={() => setSelectedType('presentation')}
                className={selectedType === 'presentation' ? 'bg-cco-neutral-100' : ''}
              >
                Presentations
              </Button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full px-4 py-2 rounded-md border border-cco-neutral-300 focus:outline-none focus:ring-2 focus:ring-cco-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Folders section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-cco-neutral-900 mb-4">Folders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.map(folder => (
                <FolderCard key={folder.id} folder={folder} />
              ))}
            </div>
          </div>
          
          {/* Recent documents section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-cco-neutral-900">Recent Documents</h2>
              <Button 
                variant="ghost"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </div>
            
            {filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map(doc => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            ) : (
              <Card className="bg-cco-neutral-50 border-dashed">
                <div className="flex flex-col items-center justify-center py-8">
                  <DocumentTextIcon className="w-12 h-12 text-cco-neutral-400 mb-4" />
                  <h3 className="font-medium text-cco-neutral-700 mb-2">No documents found</h3>
                  <p className="text-sm text-cco-neutral-600 text-center max-w-md mb-4">
                    {searchQuery ? 
                      `No documents match your search for "${searchQuery}".` : 
                      "You don&apos;t have any documents yet. Upload or create a new document to get started."}
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={handleUploadFile}
                    >
                      <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                      Upload File
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleCreateNewDoc}
                    >
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Create New
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
          
          {/* File Upload Modal - simplified version */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
                <div className="border-2 border-dashed border-cco-neutral-300 rounded-md p-6 text-center">
                  <ArrowUpTrayIcon className="w-12 h-12 text-cco-neutral-400 mx-auto mb-4" />
                  <p className="text-sm text-cco-neutral-600 mb-4">
                    Drag and drop files here, or click to select files
                  </p>
                  <Button variant="default" size="sm">
                    Select Files
                  </Button>
                </div>
                <div className="flex justify-end mt-6 space-x-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="default">
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default DocumentsPage; 