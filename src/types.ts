/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type IssueCategory =
  | 'energy'
  | 'water'
  | 'transport'
  | 'healthcare'
  | 'infrastructure'
  | 'food'
  | 'sanitation'
  | 'education'
  | 'emergency'
  | 'other';

export type IssueStatus =
  | 'Submitted'
  | 'AI Grouped'
  | 'Assigned'
  | 'Under Review'
  | 'Action in Progress'
  | 'Resolved'
  | 'Citizen Verified';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface OfficialUpdate {
  id: string;
  department: string;
  designation?: string;
  verified: boolean;
  content: string;
  timestamp: string;
  actionItem?: string;
}

export interface TimelineEvent {
  id: string;
  stage: IssueStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface EvidenceMedia {
  id: string;
  type: 'image' | 'voice' | 'text' | 'document';
  title: string;
  description: string;
  sanitizedTag: string;
  timestamp: string;
  location: string;
  attributesRedacted: string[];
  audioDuration?: string;
  previewType?: 'lpg_depot' | 'water_pipeline' | 'bus_terminal' | 'power_grid' | 'road_repair';
}

export interface Issue {
  id: string;
  title: string;
  category: IssueCategory;
  locationName: string;
  district: string;
  state: string;
  country: string;
  coordinates: { x: number; y: number; lat: number; lng: number }; // x,y are 0-100 relative SVG coordinates
  status: IssueStatus;
  severity: SeverityLevel;
  reportCount: number;
  confirmationsCount: number;
  notAffectedCount: number;
  trendPercentage: number;
  timeWindow: string;
  description: string;
  impactDescription: string;
  aiSummary: string;
  aiObservations: string[];
  suggestedFollowUp: string;
  confidenceScore: number;
  limitations: string;
  assignedAuthority?: string;
  assignedOfficer?: string;
  assignedDate?: string;
  updates: OfficialUpdate[];
  timeline: TimelineEvent[];
  evidence: EvidenceMedia[];
  sparklineData: number[];
  affectedWards: string[];
}

export interface CitizenReportSubmission {
  id: string;
  issueId?: string;
  category: IssueCategory;
  title: string;
  evidenceType: 'image' | 'voice' | 'text' | 'document';
  evidenceContent: string;
  location: string;
  timestamp: string;
  status: IssueStatus;
  groupedWithCount: number;
  privacyProtected: boolean;
}

export interface BRICSSignal {
  id: string;
  country: 'India' | 'Brazil' | 'South Africa';
  flag: string;
  code: 'IN' | 'BR' | 'ZA';
  topic: string;
  category: IssueCategory;
  signalVolume: number;
  trend: number;
  severity: SeverityLevel;
  confidence: number;
  comparativeContext: string;
  potentialCorrelations: string;
  lastUpdated: string;
}
