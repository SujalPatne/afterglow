export type Role = 'Founder' | 'Investor' | 'Hiring Manager' | 'Operator' | 'Media';

export interface Attendee {
  id: string;
  name: string;
  company: string;
  role: Role;
  avatar: string;
  clusterId?: number; // For graph grouping
}

export enum MatchStatus {
  SUGGESTED = 'Suggested',
  ACCEPTED = 'Accepted',
  SCHEDULED = 'Scheduled',
  HELD = 'Held',
  OUTCOME_LOGGED = 'Outcome Logged',
}

export interface TimelineEvent {
  date: string;
  type: 'status_change' | 'note' | 'email_sent';
  description: string;
}

export interface Match {
  id: string;
  sourceId: string; // Attendee ID
  targetId: string; // Attendee ID
  status: MatchStatus;
  lastActivity: string;
  confidenceScore: number; // 0-100
  notes: string;
  timeline: TimelineEvent[];
  nextAction?: string;
}

export interface Outcome {
  id: string;
  matchId: string;
  type: 'Partnership' | 'Investment' | 'Hire' | 'Pilot' | 'Advisory' | 'Other';
  value?: string; // e.g. "$50k - $100k"
  notes: string;
  nextStepDate?: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface GraphNode {
  id: string;
  group: number;
  role: Role;
  name: string;
  val: number; // influence/size
  // d3-force properties
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphEdge {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number; // strength
  // d3-force properties
  index?: number;
}

export interface AppState {
  attendees: Attendee[];
  matches: Match[];
  outcomes: Outcome[];
  selectedMatchId: string | null;
}

export interface AiInsights {
  bottleneck: string;
  graphSummary: string;
  bridgingSuggestions: string[];
}