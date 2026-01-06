
export type AuthRole = 'Artist' | 'Manager';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  category: 'Promoter' | 'Venue' | 'Corporate' | 'Agency';
}

export interface Equipment {
  id: string;
  name: string;
  category: 'Audio' | 'Lighting' | 'DJ' | 'Backline' | 'Stage';
  dailyRate: number;
}

export interface QuoteItem {
  id: string;
  equipmentId?: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface JobDocument {
  id: string;
  gigId: string;
  type: 'Invoice' | 'Contract' | 'Rider' | 'Quotation';
  dateGenerated: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Approved';
  fileName: string;
  totalAmount?: number;
  quoteItems?: QuoteItem[];
  includeArtistFee?: boolean;
}

export interface Gig {
  id: string;
  venue: string;
  city: string;
  date: string;
  startTime?: string;
  endTime?: string;
  status: 'Confirmed' | 'Pending' | 'Canceled';
  fee: number;
  currency: string;
  notes?: string;
  clientId?: string;
}

export interface Expense {
  id: string;
  date: string;
  category: 'Travel' | 'Gear' | 'Marketing' | 'Production' | 'Staff' | 'Other';
  description: string;
  amount: number;
  currency: string;
  gigId?: string;
  receiptUrl?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  gigId?: string;
  mood: 'Energetic' | 'Exhausted' | 'Inspired' | 'Frustrated' | 'Neutral';
  theGood: string;
  theBad: string;
  reflection: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Pending' | 'Inactive';
  lastActive: string;
}

export type ViewState = 'dashboard' | 'gigs' | 'finance' | 'epk' | 'access' | 'clients' | 'registry' | 'quotation' | 'journal';
