export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Won'
  | 'Lost';

export type LeadPriority = 'Low' | 'Medium' | 'High';

export type LeadSource =
  | 'Website'
  | 'Referral'
  | 'Cold Call'
  | 'Email Campaign'
  | 'Social Media'
  | 'Event';

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  notes: string | null;
  user_id: string;
  created_at: string;
}

export type LeadInput = Omit<Lead, 'id' | 'user_id' | 'created_at'>;

export const LEAD_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Won',
  'Lost',
];

export const LEAD_PRIORITIES: LeadPriority[] = ['Low', 'Medium', 'High'];

export const LEAD_SOURCES: LeadSource[] = [
  'Website',
  'Referral',
  'Cold Call',
  'Email Campaign',
  'Social Media',
  'Event',
];
