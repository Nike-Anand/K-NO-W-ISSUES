/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { observeScrollReveals } from './utils/motion';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
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
  const { activeView, theme } = useApp();

  // Refresh scroll-reveal observation whenever the view swaps.
  useEffect(() => {
    observeScrollReveals();
  }, [activeView]);

  return (
    <div
      data-theme={theme}
      className="theme-transition min-h-screen flex flex-col themed-page selection:brand selection:text-brand"
    >
      {activeView !== 'landing' && <Navbar />}

      <main className="flex-1">
        {activeView === 'landing' && <LandingView />}
        {activeView === 'home' && <HomeView />}
        {activeView === 'explore' && <ExploreView />}
        {activeView === 'trending' && <TrendingView />}
        {activeView === 'evidence' && <EvidenceGalleryView />}
        {activeView === 'cross-brics' && <CrossBricsView />}
        {activeView === 'my-issues' && <MyIssuesView />}
        {activeView === 'gov-console' && <GovConsoleView />}
      </main>

      {activeView !== 'landing' && (
        <footer className="themed-card b-skin border-t py-8 px-4 sm:px-6 lg:px-8 text-xs t-muted">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold t-ink text-sm">LokDrishti</span>
              <span className="t-faint">·</span>
              <span>BRICS Public Signal & Development Intelligence Platform</span>
            </div>

            <div className="flex items-center gap-4 t-faint">
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200/50">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Evidence Without Exposure
              </span>
              <span className="t-faint">|</span>
              <span>Report it. See it. Track it.</span>
            </div>
          </div>
        </footer>
      )}

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
