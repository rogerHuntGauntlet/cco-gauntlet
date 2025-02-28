import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { DocumentTextIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';
import { Card } from '../ui/Card';
import { Document } from '../../types';

interface DocumentCardProps {
  document: Document;
}

const documentTypeIcons = {
  prd: "📊",
  meeting_notes: "📝",
  code_scaffold: "🏗️",
  requirements: "📋",
  other: "📄"
};

const documentTypeNames = {
  prd: "Product Requirements",
  meeting_notes: "Meeting Notes",
  code_scaffold: "Code Scaffold",
  requirements: "Requirements",
  other: "Document"
};

export function DocumentCard({ document }: DocumentCardProps) {
  const updatedDate = new Date(document.updatedAt);
  const formattedDate = format(updatedDate, 'MMM d, yyyy');
  
  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    review: 'bg-blue-100 text-blue-800',
    final: 'bg-green-100 text-green-800',
  };

  return (
    <Card hover={true} className="overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex items-start mb-3">
          <div className="flex-shrink-0 text-2xl mr-3">
            {documentTypeIcons[document.type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-cco-neutral-700">
                {documentTypeNames[document.type]}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[document.status]}`}>
                {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
              </span>
            </div>
            <h3 className="text-lg font-semibold mt-1 truncate text-cco-neutral-900">{document.title}</h3>
          </div>
        </div>
        
        <div className="flex items-center text-xs text-cco-neutral-700 mb-3">
          <ClockIcon className="w-4 h-4 mr-1.5" />
          <span>Updated {formattedDate}</span>
        </div>
        
        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {document.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-0.5 bg-cco-neutral-100 text-cco-neutral-700 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-auto pt-3 border-t border-cco-neutral-200 flex justify-between">
          <Link 
            href={`/documents/${document.id}`}
            className="text-sm font-medium text-cco-primary-600 hover:text-cco-primary-700"
          >
            View document
          </Link>
          
          <button 
            className="text-sm font-medium text-cco-neutral-700 hover:text-cco-neutral-900"
          >
            Download
          </button>
        </div>
      </div>
    </Card>
  );
} 