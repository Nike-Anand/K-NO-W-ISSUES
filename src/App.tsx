/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { TrendingView } from './components/TrendingView';
import { EvidenceGalleryView } from './components/EvidenceGalleryView';
import { CrossBricsView } from './components/CrossBricsView';
import { MyIssuesView } from './components/MyIssuesView';
import { GovConsoleView } from './components/GovConsoleView';
import { ReportIssueModal } from './components/ReportIssueModal';
import { IssueDetailModal } from './components/IssueDetailModal';
import { AssignIssueModal } from './components/AssignIssueModal';
import { AiExplanationModal } from './components/AiExplanationModal';
import { GovReportPreviewModal } from './components/GovReportPreviewModal';
import { Toast } from './components/Toast';
import { ShieldCheck, Globe2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8FC] selection:bg-[#6D4AFF]/15 selection:text-[#6D4AFF]">
      <Navbar />

      <main className="flex-1">
        {activeView === 'home' && <HomeView />}
        {activeView === 'explore' && <ExploreView />}
        {activeView === 'trending' && <TrendingView />}
        {activeView === 'evidence' && <EvidenceGalleryView />}
        {activeView === 'cross-brics' && <CrossBricsView />}
        {activeView === 'my-issues' && <MyIssuesView />}
        {activeView === 'gov-console' && <GovConsoleView />}
      </main>

      {/* Global Footer (Quiet, editorial, WCAG compliant) */}
      <footer className="bg-white border-t border-neutral-200/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-neutral-900 text-sm">LokDrishti</span>
            <span className="text-neutral-300">·</span>
            <span>BRICS Public Signal & Development Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200/50">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Evidence Without Exposure
            </span>
            <span className="text-neutral-300">|</span>
            <span>Report it. See it. Track it.</span>
          </div>
        </div>
      </footer>

      {/* Interactive Overlays & Modals */}
      <ReportIssueModal />
      <IssueDetailModal />
      <AssignIssueModal />
      <AiExplanationModal />
      <GovReportPreviewModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
