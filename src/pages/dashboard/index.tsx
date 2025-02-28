import React from 'react';
import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Dashboard } from '../../components/dashboard/Dashboard';
import { dashboardData } from '../../utils/mockData';

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Dashboard | CCO VibeCoder Platform</title>
        <meta
          name="description"
          content="View your recent meetings, documents, and projects"
        />
      </Head>
      
      <DashboardLayout>
        <Dashboard data={dashboardData} />
      </DashboardLayout>
    </>
  );
} 