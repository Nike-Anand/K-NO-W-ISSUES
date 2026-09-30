/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { INITIAL_ISSUES, CROSS_BRICS_SIGNALS } from '../data/mockData';
import { Issue, IssueCategory, IssueStatus, CitizenReportSubmission, BRICSSignal } from '../types';

export type ThemeMode = 'light' | 'dark';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  isLoading: boolean;
  theme: ThemeMode;
  issues: Issue[];
  selectedIssue: Issue | null;
  selectedIssueId: string | null;
  activeView: 'landing' | 'home' | 'explore' | 'trending' | 'evidence' | 'cross-brics' | 'my-issues' | 'gov-console';
  govConsoleSubTab: 'overview' | 'map' | 'clusters' | 'briefs' | 'cross-brics' | 'responses' | 'analytics';
  searchQuery: string;
  selectedCategoryFilter: string;
  selectedArea: string;
  isReportModalOpen: boolean;
  isAssignModalOpen: boolean;
  isGovReportModalOpen: boolean;
  isAiExplanationOpen: boolean;
  activeAssignIssue: Issue | null;
  userReports: CitizenReportSubmission[];
  userConfirmations: Record<string, 'experienced' | 'not_affected' | null>;
  bricsSignals: BRICSSignal[];
  toasts: ToastItem[];
  briefs: any[];
  responses: any[];
  departments: any[];
  appConfig: any;
  // Actions
  setActiveView: (view: 'landing' | 'home' | 'explore' | 'trending' | 'evidence' | 'cross-brics' | 'my-issues' | 'gov-console') => void;
  setGovConsoleSubTab: (tab: 'overview' | 'map' | 'clusters' | 'briefs' | 'cross-brics' | 'responses' | 'analytics') => void;
  setSelectedIssueId: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategoryFilter: (cat: string) => void;
  setSelectedArea: (area: string) => void;
  setIsReportModalOpen: (open: boolean) => void;
  setIsAssignModalOpen: (open: boolean) => void;
  setIsGovReportModalOpen: (open: boolean) => void;
  setIsAiExplanationOpen: (open: boolean) => void;
  openAssignModal: (issue: Issue) => void;
  confirmIssue: (issueId: string, type: 'experienced' | 'not_affected') => void;
  addCitizenReport: (report: Omit<CitizenReportSubmission, 'id' | 'timestamp'>) => void;
  assignIssue: (issueId: string, authorityName: string, officerName: string) => void;
  publishOfficialUpdate: (issueId: string, content: string, department: string, designation: string) => void;
  changeIssueStatus: (issueId: string, newStatus: IssueStatus) => void;
  addResponse: (region: string, msg: string) => void;
  addBrief: (title: string, type: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'landing' | 'home' | 'explore' | 'trending' | 'evidence' | 'cross-brics' | 'my-issues' | 'gov-console'>('landing');
  const [govConsoleSubTab, setGovConsoleSubTab] = useState<'overview' | 'map' | 'clusters' | 'briefs' | 'cross-brics' | 'responses' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedArea, setSelectedArea] = useState('Chennai');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isGovReportModalOpen, setIsGovReportModalOpen] = useState(false);
  const [isAiExplanationOpen, setIsAiExplanationOpen] = useState(false);
  const [activeAssignIssue, setActiveAssignIssue] = useState<Issue | null>(null);
  const [userConfirmations, setUserConfirmations] = useState<Record<string, 'experienced' | 'not_affected' | null>>({});
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [bricsSignals, setBricsSignals] = useState<BRICSSignal[]>([]);
  const [briefs, setBriefs] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [appConfig, setAppConfig] = useState<any>(null);

  // Default citizen submitted reports
  const [userReports, setUserReports] = useState<CitizenReportSubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem('ld-theme');
      if (stored === 'light' || stored === 'dark') return stored;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('ld-theme', next);
    } catch {
      /* storage unavailable — theme still toggles for the session */
    }
    showToast(next === 'dark' ? 'Switched to Dark color grade' : 'Switched to Light color grade', 'info');
  };

  // Try to fetch dynamic data from configured API endpoints. Falls back to mock data.
  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || '';
    setIsLoading(true);

    const fetchJson = async (path: string) => {
      try {
        const res = await fetch(base + path);
        if (!res.ok) throw new Error('bad');
        return await res.json();
      } catch (e) {
        return null;
      }
    };

    (async () => {
      const [issuesRes, bricsRes, reportsRes, briefsRes, responsesRes, deptsRes, configRes] = await Promise.all([
        fetchJson('/api/issues'),
        fetchJson('/api/brics'),
        fetchJson('/api/reports'),
        fetchJson('/api/briefs'),
        fetchJson('/api/responses'),
        fetchJson('/api/departments'),
        fetchJson('/api/config'),
      ]);

      if (issuesRes && Array.isArray(issuesRes)) {
        setIssues(issuesRes);
      } else {
        setIssues(INITIAL_ISSUES);
      }

      if (bricsRes && Array.isArray(bricsRes)) {
        setBricsSignals(bricsRes);
      } else {
        setBricsSignals(CROSS_BRICS_SIGNALS);
      }

      if (reportsRes && Array.isArray(reportsRes)) {
        setUserReports(reportsRes);
      } else {
        setUserReports([]);
      }

      if (briefsRes && Array.isArray(briefsRes)) setBriefs(briefsRes);
      if (responsesRes && Array.isArray(responsesRes)) setResponses(responsesRes);
      if (deptsRes && Array.isArray(deptsRes)) setDepartments(deptsRes);

      if (configRes && Array.isArray(configRes)) {
        const configMap: any = {};
        configRes.forEach((item: any) => { configMap[item.id] = item; });
        setAppConfig(configMap);
      }

      setIsLoading(false);
    })();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const selectedIssue = issues.find((i) => i.id === selectedIssueId) || null;

  const openAssignModal = (issue: Issue) => {
    setActiveAssignIssue(issue);
    setIsAssignModalOpen(true);
  };

  const confirmIssue = (issueId: string, type: 'experienced' | 'not_affected') => {
    const current = userConfirmations[issueId];
    if (current === type) {
      // Toggle off
      setUserConfirmations((prev) => ({ ...prev, [issueId]: null }));
      setIssues((prev) =>
        prev.map((iss) => {
          if (iss.id !== issueId) return iss;
          return {
            ...iss,
            confirmationsCount: type === 'experienced' ? iss.confirmationsCount - 1 : iss.confirmationsCount,
            notAffectedCount: type === 'not_affected' ? iss.notAffectedCount - 1 : iss.notAffectedCount,
          };
        })
      );
      showToast('Confirmation vote removed', 'info');
      return;
    }

    setUserConfirmations((prev) => ({ ...prev, [issueId]: type }));
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id !== issueId) return iss;
        const deltaExp = type === 'experienced' ? 1 : current === 'experienced' ? -1 : 0;
        const deltaNot = type === 'not_affected' ? 1 : current === 'not_affected' ? -1 : 0;
        return {
          ...iss,
          confirmationsCount: iss.confirmationsCount + deltaExp,
          notAffectedCount: iss.notAffectedCount + deltaNot,
        };
      })
    );

    if (type === 'experienced') {
      showToast('Recorded: "I\'m experiencing this too" (+1)', 'success');
    } else {
      showToast('Recorded: "Not affected" feedback logged (+1)', 'info');
    }
  };

  const addCitizenReport = (reportData: Omit<CitizenReportSubmission, 'id' | 'timestamp'>) => {
    const newReportId = `rep-${Date.now()}`;
    const timestampStr = 'Just now';

    // Find if matches an existing issue exactly by location and category
    let matchedIssue = issues.find(
      (iss) => iss.category === reportData.category && iss.locationName.toLowerCase().includes(reportData.location.toLowerCase().split(' ')[0] || '')
    );

    let isNewIssue = false;
    if (!matchedIssue) {
      isNewIssue = true;
      matchedIssue = {
        id: `iss-${Date.now()}`,
        title: reportData.title,
        category: reportData.category,
        locationName: reportData.location,
        district: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        coordinates: { x: 50, y: 50, lat: 13.0827, lng: 80.2707 },
        status: 'Under Review',
        severity: 'Medium',
        reportCount: 0, // Will be incremented below
        confirmationsCount: 1,
        notAffectedCount: 0,
        trendPercentage: 100,
        timeWindow: 'Just now',
        description: reportData.evidenceContent,
        impactDescription: 'New localized issue reported by citizen.',
        aiSummary: reportData.evidenceContent || 'Automated AI Summary for new issue.',
        aiObservations: ['Newly ingested citizen report'],
        suggestedFollowUp: 'Verify with local authorities.',
        confidenceScore: 85,
        limitations: 'Limited initial data.',
        updates: [],
        timeline: [],
        evidence: [],
        sparklineData: [0],
        affectedWards: [reportData.location]
      };
    }

    const newReport: CitizenReportSubmission = {
      ...reportData,
      id: newReportId,
      issueId: matchedIssue.id,
      timestamp: timestampStr,
      status: matchedIssue.status,
      groupedWithCount: matchedIssue.reportCount + 1,
      privacyProtected: true,
    };

    fetch('/api/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newReport) }).catch(console.error);
    if (isNewIssue) {
        fetch('/api/issues', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(matchedIssue) }).catch(console.error);
    }

    setUserReports((prev) => [newReport, ...prev]);

    // Update Issue reportCount and trend in state
    setIssues((prev) => {
      let nextIssues = prev;
      if (isNewIssue && matchedIssue) {
        nextIssues = [matchedIssue, ...prev];
      }
      return nextIssues.map((iss) => {
        if (iss.id === matchedIssue!.id) {
          return {
            ...iss,
            reportCount: iss.reportCount + 1,
            sparklineData: [...iss.sparklineData, iss.reportCount + 1],
            timeline: [
              ...iss.timeline,
              {
                id: `t-add-${Date.now()}`,
                stage: 'Submitted',
                title: 'Citizen Signal Influx Incremented',
                description: `New sanitized evidence report attached from ${reportData.location}.`,
                timestamp: 'Just now',
                completed: true,
                current: false,
              },
            ],
          };
        }
        return iss;
      });
    });

    showToast(`Report received & protected. Grouped with ${matchedIssue.reportCount + 1} signals.`, 'success');
  };

  const assignIssue = (issueId: string, authorityName: string, officerName: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id !== issueId) return iss;
        const updatedTimeline = iss.timeline.map((item) => {
          if (item.stage === 'Assigned') {
            return {
              ...item,
              completed: true,
              current: false,
              description: `Assigned to ${authorityName} (${officerName}).`,
              timestamp: 'Just now',
            };
          }
          if (item.stage === 'Under Review') {
            return { ...item, current: true };
          }
          return item;
        });

        return {
          ...iss,
          assignedAuthority: authorityName,
          assignedOfficer: officerName,
          assignedDate: 'Just now',
          timeline: updatedTimeline,
        };
      })
    );

    setIsAssignModalOpen(false);
    showToast(`Successfully assigned to ${authorityName}`, 'success');
  };

  const publishOfficialUpdate = (issueId: string, content: string, department: string, designation: string) => {
    const newUpdate = {
      id: `upd-${Date.now()}`,
      department,
      designation,
      verified: true,
      content,
      timestamp: 'Just now (Official)',
      actionItem: 'Official dispatch active.',
    };

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id !== issueId) return iss;
        return {
          ...iss,
          status: 'Action in Progress',
          updates: [newUpdate, ...iss.updates],
          timeline: iss.timeline.map((item) => {
            if (item.stage === 'Action in Progress') {
              return { ...item, completed: true, current: true, timestamp: 'Just now' };
            }
            return item;
          }),
        };
      })
    );

    showToast('Verified official update published to public signal feed', 'success');
  };

  const changeIssueStatus = (issueId: string, newStatus: IssueStatus) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id !== issueId) return iss;
        return {
          ...iss,
          status: newStatus,
          timeline: iss.timeline.map((item) => ({
            ...item,
            completed: item.stage === newStatus ? true : item.completed,
            current: item.stage === newStatus,
          })),
        };
      })
    );

    showToast(`Status updated to: ${newStatus}`, 'info');
  };

  const addResponse = (region: string, msg: string) => {
    const newResponse = {
      id: `r-${Date.now()}`,
      region,
      msg,
      time: 'Just now'
    };
    fetch('/api/responses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newResponse) }).catch(console.error);
    setResponses(prev => [newResponse, ...prev]);
    showToast(`Broadcast sent to ${region}`, 'success');
  };

  const addBrief = (title: string, type: string) => {
    const newBrief = {
      id: `b-${Date.now()}`,
      title,
      type,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    fetch('/api/briefs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newBrief) }).catch(console.error);
    setBriefs(prev => [newBrief, ...prev]);
    showToast(`Generated new brief: ${title}`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        isLoading,
        theme,
        issues,
        selectedIssue,
        selectedIssueId,
        activeView,
        govConsoleSubTab,
        searchQuery,
        selectedCategoryFilter,
        selectedArea,
        isReportModalOpen,
        isAssignModalOpen,
        isGovReportModalOpen,
        isAiExplanationOpen,
        activeAssignIssue,
        userReports,
        userConfirmations,
        bricsSignals,
        toasts,
        briefs,
        responses,
        departments,
        appConfig,
        setActiveView,
        setGovConsoleSubTab,
        setSelectedIssueId,
        setSearchQuery,
        setSelectedCategoryFilter,
        setSelectedArea,
        setIsReportModalOpen,
        setIsAssignModalOpen,
        setIsGovReportModalOpen,
        setIsAiExplanationOpen,
        openAssignModal,
        confirmIssue,
        addCitizenReport,
        assignIssue,
        publishOfficialUpdate,
        changeIssueStatus,
        addResponse,
        addBrief,
        showToast,
        dismissToast,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
