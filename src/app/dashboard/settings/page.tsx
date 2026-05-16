'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { db } from '@/lib/db';
import { 
  User, 
  DollarSign, 
  Target, 
  Download, 
  Upload, 
  Shield, 
  Check,
  Save,
  Trash2,
  AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, fetchData } = useStore();
  const [formData, setFormData] = useState(settings);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const exportData = async () => {
    const [subs, rems, exps, docs, sett] = await Promise.all([
      db.subscriptions.toArray(),
      db.reminders.toArray(),
      db.expenses.toArray(),
      db.documents.toArray(),
      db.settings.toArray(),
    ]);

    const data = { subs, rems, exps, docs, sett };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifemanager-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        // Clear and restore
        await Promise.all([
          db.subscriptions.clear(),
          db.reminders.clear(),
          db.expenses.clear(),
          db.documents.clear(),
          db.settings.clear(),
        ]);

        if (data.subs) await db.subscriptions.bulkAdd(data.subs);
        if (data.rems) await db.reminders.bulkAdd(data.rems);
        if (data.exps) await db.expenses.bulkAdd(data.exps);
        if (data.docs) await db.documents.bulkAdd(data.docs);
        if (data.sett) await db.settings.bulkAdd(data.sett);

        fetchData();
        alert('Data imported successfully!');
      } catch (err) {
        alert('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">Personalize your experience and manage your data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar info */}
        <div className="space-y-6">
          <div className="glass-dark p-6 rounded-3xl border border-white/5 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{settings.userName}</h3>
            <p className="text-sm text-muted-foreground">Free Tier Account</p>
          </div>

          <div className="glass-dark p-6 rounded-3xl border border-white/5 space-y-4">
            <h4 className="font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Privacy & Storage
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your data is stored locally in your browser. Clearing browser data will delete all information unless you have a backup.
            </p>
          </div>
        </div>

        {/* Main Settings */}
        <div className="md:col-span-2 space-y-8">
          <form onSubmit={handleSubmit} className="glass-dark p-8 rounded-[2.5rem] border border-white/5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" /> Display Name
                </label>
                <input 
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Preferred Currency
                </label>
                <select 
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="$">USD ($)</option>
                  <option value="৳">BDT (৳)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                  <option value="₹">INR (₹)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4" /> Monthly Budget Target
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">{formData.currency}</span>
                <input 
                  type="number"
                  value={formData.monthlyBudget}
                  onChange={(e) => setFormData({...formData, monthlyBudget: Number(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <p className="text-[10px] text-muted-foreground italic">We'll track your subscription spending against this budget.</p>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              {isSaved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {isSaved ? 'Settings Saved' : 'Save Changes'}
            </button>
          </form>

          {/* Data Management */}
          <div className="glass-dark p-8 rounded-[2.5rem] border border-white/5 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Data Management
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={exportData}
                className="flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
              >
                <Download className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <div className="font-bold text-sm">Backup Data</div>
                  <div className="text-[10px] text-muted-foreground">Download as JSON</div>
                </div>
              </button>

              <label className="flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all cursor-pointer">
                <Upload className="w-5 h-5 text-emerald-400" />
                <div className="text-left">
                  <div className="font-bold text-sm">Restore Data</div>
                  <div className="text-[10px] text-muted-foreground">Upload JSON backup</div>
                </div>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>

            <button 
              onClick={() => {
                if(confirm('Are you sure? This will delete ALL your data!')) {
                   db.delete().then(() => window.location.reload());
                }
              }}
              className="w-full py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Factory Reset App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
