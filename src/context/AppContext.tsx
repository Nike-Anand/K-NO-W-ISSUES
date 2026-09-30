/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { INITIAL_ISSUES, CROSS_BRICS_SIGNALS } from '../data/mockData';
import { Issue, IssueCategory, IssueStatus, CitizenReportSubmission, BRICSSignal } from '../types';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  issues: Issue[];
  selectedIssue: Issue | null;
  selectedIssueId: string | null;
  activeView: 'home' | 'explore' | 'trending' | 'evidence' | 'cross-brics' | 'my-issues' | 'gov-console';
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
  // Actions
  setActiveView: (view: 'home' | 'explore' | 'trending' | 'evidence' | 'cross-brics' | 'my-issues' | 'gov-console') => void;
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
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'explore' | 'trending' | 'evidence' | 'cross-brics' | 'my-issues' | 'gov-console'>('home');
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
  const [bricsSignals] = useState<BRICSSignal[]>(CROSS_BRICS_SIGNALS);

  // Default citizen submitted reports
  const [userReports, setUserReports] = useState<CitizenReportSubmission[]>([
    {
      id: 'rep-user-01',
      issueId: 'issue-energy-01',
      category: 'energy',
      title: 'Power Outage & Delayed Gas Refill',
      evidenceType: 'image',
      evidenceContent: 'Substation meter box tripping photograph',
      location: 'Anna Nagar West, Chennai',
      timestamp: 'Today, 08:30 IST',
      status: 'Under Review',
      groupedWithCount: 1248,
      privacyProtected: true,
    },
    {
      id: 'rep-user-02',
      issueId: 'issue-water-02',
      category: 'water',
      title: 'Low Tap Water Pressure on 2nd Floor',
      evidenceType: 'text',
      evidenceContent: 'Pressure meter showing 0.4 bar instead of normal 1.8 bar',
      location: 'Kilpauk Garden, Chennai',
      timestamp: 'Yesterday, 14:15 IST',
      status: 'Action in Progress',
      groupedWithCount: 640,
      privacyProtected: true,
    },
  ]);

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

    // Find if matches an existing issue
    let matchedIssue = issues.find(
      (iss) => iss.category === reportData.category && iss.locationName.toLowerCase().includes(reportData.location.toLowerCase().split(' ')[0] || '')
    );

    if (!matchedIssue) {
      matchedIssue = issues.find((iss) => iss.category === reportData.category) || issues[0];
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

    setUserReports((prev) => [newReport, ...prev]);

    // Update Issue reportCount and trend in state
    setIssues((prev) =>
      prev.map((iss) => {
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
      })
    );

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

  return (
    <AppContext.Provider
      value={{
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
        showToast,
        dismissToast,
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
