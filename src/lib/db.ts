import Dexie, { type Table } from 'dexie';

export interface Subscription {
  id?: number;
  name: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: Date;
  category: string;
}

export interface Reminder {
  id?: number;
  title: string;
  description?: string;
  date: Date;
  type: 'document' | 'task' | 'bill';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export interface Document {
  id?: number;
  name: string;
  type: string; // e.g., 'Passport', 'License', 'NID', 'Contract'
  documentNumber?: string;
  expiryDate: Date;
  issueDate?: Date;
  notes?: string;
  status: 'active' | 'expiring_soon' | 'expired';
}

export interface UserSettings {
  id?: number;
  userName: string;
  currency: string;
  monthlyBudget: number;
  theme: 'dark' | 'light' | 'system';
}

export class LifeManagerDB extends Dexie {
  subscriptions!: Table<Subscription>;
  reminders!: Table<Reminder>;
  expenses!: Table<Expense>;
  documents!: Table<Document>;
  settings!: Table<UserSettings>;

  constructor() {
    super('LifeManagerDB');
    this.version(3).stores({
      subscriptions: '++id, name, nextBillingDate',
      reminders: '++id, title, date, type',
      expenses: '++id, title, date',
      documents: '++id, name, type, expiryDate',
      settings: '++id'
    });
  }
}

export const db = new LifeManagerDB();
