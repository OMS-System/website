export type CategoryCode = 'SAF' | 'QAL' | 'EQP' | 'MNT' | 'INS';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type ObservationStatus = 'Open' | 'In Review' | 'Closed';

export type PhotoStage = 'initial' | 'rectification' | 'closure';

export interface ObservationPhoto {
  id: string;
  observationId: string;
  dataUrl: string;
  stage: PhotoStage;
  caption?: string;
  createdAt: string;
}

export interface ObservationHistory {
  id: string;
  observationId: string;
  status: ObservationStatus;
  byName: string;
  remarks: string;
  createdAt: string;
}

export interface Observation {
  id: string;
  category: CategoryCode;
  severity: SeverityLevel;
  status: ObservationStatus;
  site: string;
  station?: string;
  asset?: string;
  description: string;
  observedBy: string;
  observerEmail?: string;
  dueDate?: string | null;
  priorityScore?: number;
  locationChainage?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
  closedBy?: string | null;
  photos?: ObservationPhoto[];
  history?: ObservationHistory[];
}

export interface ObservationSummary {
  id: string;
  category: CategoryCode;
  severity: SeverityLevel;
  status: ObservationStatus;
  site: string;
  station?: string;
  asset?: string;
  observedBy: string;
  dueDate?: string | null;
  createdAt: string;
  photoCount?: number;
  latestRemarks?: string;
}

export interface CategoryMeta {
  code: CategoryCode;
  label: string;
  color: string;
  dimColor: string;
  description: string;
  iconName: string;
}

export interface DashboardStats {
  total: number;
  open: number;
  inReview: number;
  closed: number;
  criticalHighOpen: number;
  overdueCount: number;
  byCategory: {
    code: CategoryCode;
    label: string;
    count: number;
    color: string;
  }[];
  bySeverity: {
    level: SeverityLevel;
    count: number;
    color: string;
  }[];
  byStatus: {
    status: ObservationStatus;
    count: number;
    color: string;
  }[];
  byAsset: {
    asset: string;
    count: number;
  }[];
  weeklyTrend: {
    date: string;
    label: string;
    logged: number;
    resolved: number;
  }[];
  recentObservations: ObservationSummary[];
  recentHistory: (ObservationHistory & { site: string; category: CategoryCode })[];
}
