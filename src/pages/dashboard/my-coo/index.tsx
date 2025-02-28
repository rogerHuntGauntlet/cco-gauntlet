import React, { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { DataIntegrationNodeEditor } from '../../../components/dashboard/DataIntegrationNodeEditor';
import { integrationWorkflows } from '../../../utils/mockData';
import { PlusIcon, ArrowPathIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import { IntegrationWorkflow } from '../../../types';

export default function MyCOOPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<IntegrationWorkflow | null>(null);
  const [mode, setMode] = useState<'list' | 'edit' | 'create'>('list');
  
  const handleCreateNew = () => {
    setSelectedWorkflow(null);
    setMode('create');
  };
  
  const handleEditWorkflow = (workflow: IntegrationWorkflow) => {
    setSelectedWorkflow(workflow);
    setMode('edit');
  };
  
  const handleBackToList = () => {
    setMode('list');
  };
  
  return (
    <>
      <Head>
        <title>My COO | CCO VibeCoder Platform</title>
        <meta
          name="description"
          content="Integrate with external services and import data"
        />
      </Head>
      
      <DashboardLayout>
        <div className="space-y-6">
          {mode === 'list' ? (
            <>
              <div className="bg-white rounded-xl p-6 shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-cco-neutral-900">My COO</h1>
                    <p className="text-cco-neutral-700">
                      Manage your data integration workflows and connect to external services.
                    </p>
                  </div>
                  <button 
                    onClick={handleCreateNew}
                    className="bg-cco-primary-600 text-white px-4 py-2 rounded-md hover:bg-cco-primary-700 transition-colors flex items-center"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Workflow
                  </button>
                </div>
              </div>
              
              {/* Workflows List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {integrationWorkflows.map((workflow) => (
                  <div key={workflow.id} className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-semibold text-cco-neutral-900">{workflow.name}</h2>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          workflow.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : workflow.status === 'paused'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-cco-neutral-700 mb-4">
                        {workflow.description}
                      </p>
                      
                      <div className="bg-cco-neutral-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-cco-neutral-700">
                            <span className="font-medium">Source:</span> {workflow.nodes[0]?.data.label}
                          </span>
                          <span className="text-cco-neutral-700">
                            <span className="font-medium">Destination:</span> {workflow.nodes[workflow.nodes.length - 1]?.data.label}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-cco-neutral-600">
                        <span>Updated {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                        <span>{workflow.nodes.length} nodes</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-cco-neutral-200">
                        <div className="flex space-x-2">
                          {workflow.status === 'active' ? (
                            <button className="p-2 text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors">
                              <PauseIcon className="w-5 h-5" />
                            </button>
                          ) : (
                            <button className="p-2 text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors">
                              <PlayIcon className="w-5 h-5" />
                            </button>
                          )}
                          <button className="p-2 text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">
                            <ArrowPathIcon className="w-5 h-5" />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleEditWorkflow(workflow)}
                          className="px-4 py-2 bg-cco-neutral-100 text-cco-neutral-700 rounded-md hover:bg-cco-neutral-200 transition-colors"
                        >
                          Edit Workflow
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl p-6 shadow">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h1 className="text-2xl font-bold text-cco-neutral-900">
                      {mode === 'create' ? 'Create New Workflow' : `Edit: ${selectedWorkflow?.name}`}
                    </h1>
                    <p className="text-cco-neutral-700">
                      {mode === 'create' 
                        ? 'Create data integration workflows by adding and connecting nodes.' 
                        : selectedWorkflow?.description}
                    </p>
                  </div>
                  <button 
                    onClick={handleBackToList}
                    className="bg-cco-neutral-100 text-cco-neutral-700 px-4 py-2 rounded-md hover:bg-cco-neutral-200 transition-colors"
                  >
                    Back to All Workflows
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow h-[600px]">
                <DataIntegrationNodeEditor 
                  workflow={selectedWorkflow} 
                  mode={mode} 
                />
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </>
  );
} 