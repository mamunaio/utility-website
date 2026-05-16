import { create } from 'zustand';
import { db, type Subscription, type Reminder, type Expense, type Document, type UserSettings } from '@/lib/db';

interface LifeManagerState {
  subscriptions: Subscription[];
  reminders: Reminder[];
  expenses: Expense[];
  documents: Document[];
  settings: UserSettings;
  loading: boolean;
  
  // Actions
  fetchData: () => Promise<void>;
  addSubscription: (sub: Subscription) => Promise<void>;
  addReminder: (reminder: Reminder) => Promise<void>;
  addExpense: (expense: Expense) => Promise<void>;
  addDocument: (doc: Document) => Promise<void>;
  deleteDocument: (id: number) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

const DEFAULT_SETTINGS: UserSettings = {
  userName: 'User',
  currency: '$',
  monthlyBudget: 500,
  theme: 'dark'
};

export const useStore = create<LifeManagerState>((set, get) => ({
  subscriptions: [],
  reminders: [],
  expenses: [],
  documents: [],
  settings: DEFAULT_SETTINGS,
  loading: false,

  fetchData: async () => {
    set({ loading: true });
    const [subs, rems, exps, docs, settings] = await Promise.all([
      db.subscriptions.toArray(),
      db.reminders.toArray(),
      db.expenses.toArray(),
      db.documents.toArray(),
      db.settings.toArray(),
    ]);

    const userSettings = settings[0] || DEFAULT_SETTINGS;
    if (settings.length === 0) {
      await db.settings.add(DEFAULT_SETTINGS);
    }

    set({ 
      subscriptions: subs, 
      reminders: rems, 
      expenses: exps, 
      documents: docs, 
      settings: userSettings,
      loading: false 
    });
  },

  addSubscription: async (sub) => {
    await db.subscriptions.add(sub);
    get().fetchData();
  },

  addReminder: async (reminder) => {
    await db.reminders.add(reminder);
    get().fetchData();
  },

  addExpense: async (expense) => {
    await db.expenses.add(expense);
    get().fetchData();
  },

  addDocument: async (doc) => {
    await db.documents.add(doc);
    get().fetchData();
  },

  deleteDocument: async (id) => {
    await db.documents.delete(id);
    get().fetchData();
  },

  updateSettings: async (newSettings) => {
    const current = get().settings;
    const updated = { ...current, ...newSettings };
    await db.settings.put(updated);
    set({ settings: updated });
  },
}));
