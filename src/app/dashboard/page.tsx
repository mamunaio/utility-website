'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { 
  Plus, 
  CreditCard, 
  Bell, 
  PieChart, 
  TrendingUp,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { subscriptions, reminders, documents, settings, fetchData, loading } = useStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalMonthlyCost = subscriptions.reduce((acc, sub) => {
    return acc + (sub.billingCycle === 'monthly' ? sub.price : sub.price / 12);
  }, 0);

  const pendingReminders = reminders.filter(r => !r.completed).length;
  const expiringDocs = documents.filter(d => d.status === 'expiring_soon' || d.status === 'expired').length;

  const budgetProgress = Math.min((totalMonthlyCost / settings.monthlyBudget) * 100, 100);

  return (
    <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hello, {settings.userName}!</h1>
          <p className="text-muted-foreground">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            Quick Add
          </button>
        </div>
      </header>

      {/* Budget Progress Card */}
      <div className="glass-dark p-8 rounded-[2.5rem] border border-white/5 mb-10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <TrendingUp className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold mb-1">Monthly Budget Tracker</h3>
              <p className="text-sm text-muted-foreground">You've spent {settings.currency}{totalMonthlyCost.toFixed(0)} of your {settings.currency}{settings.monthlyBudget} budget.</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-primary">{budgetProgress.toFixed(0)}%</span>
            </div>
          </div>
          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${budgetProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${budgetProgress > 90 ? 'bg-rose-500' : budgetProgress > 70 ? 'bg-amber-500' : 'bg-primary'}`}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard 
          icon={<CreditCard className="w-5 h-5" />}
          label="Subscriptions"
          value={`${settings.currency}${totalMonthlyCost.toFixed(0)}/mo`}
          trend={`${subscriptions.length} active`}
          color="primary"
        />
        <StatsCard 
          icon={<Bell className="w-5 h-5" />}
          label="Reminders"
          value={pendingReminders.toString()}
          trend="Action needed"
          color="secondary"
        />
        <StatsCard 
          icon={<ShieldCheck className="w-5 h-5" />}
          label="Vault Items"
          value={documents.length.toString()}
          trend={expiringDocs > 0 ? `${expiringDocs} urgent` : 'All safe'}
          color="vault"
        />
        <StatsCard 
          icon={<TrendingUp className="w-5 h-5" />}
          label="Budget"
          value={`${settings.currency}${(settings.monthlyBudget / 1000).toFixed(1)}k`}
          trend="Within limit"
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Subscriptions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-dark rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Active Subscriptions
              </h2>
              <button className="text-sm text-primary font-bold">View All</button>
            </div>
            
            {loading ? (
              <div className="py-10 text-center text-muted-foreground">Loading...</div>
            ) : subscriptions.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-muted-foreground mb-4">No subscriptions added yet.</p>
                <button className="text-sm font-bold underline">Add your first one</button>
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptions.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {sub.name[0]}
                      </div>
                      <div>
                        <div className="font-bold">{sub.name}</div>
                        <div className="text-xs text-muted-foreground uppercase">{sub.billingCycle}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{settings.currency}{sub.price}</div>
                      <div className="text-xs text-muted-foreground">Next: {new Date(sub.nextBillingDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

          <div className="glass-dark rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Vault Alerts
              </h2>
            </div>
            
            <div className="space-y-4">
              {documents.filter(d => d.status !== 'active').length === 0 ? (
                <div className="text-sm text-muted-foreground italic">All documents are up to date.</div>
              ) : (
                documents.filter(d => d.status !== 'active').map(doc => (
                  <div key={doc.id} className="flex gap-3 items-start p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${doc.status === 'expired' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                    <div>
                      <div className="text-sm font-medium leading-tight">{doc.name}</div>
                      <div className="text-[10px] text-muted-foreground uppercase mt-1">
                        {doc.status === 'expired' ? 'Expired' : 'Expires Soon'} • {new Date(doc.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass rounded-[2.5rem] p-8 bg-primary/10 border-primary/20">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">AI Tip</span>
            </div>
            <p className="text-sm leading-relaxed">
              {documents.some(d => d.status === 'expiring_soon') 
                ? "Your passport is expiring in 3 months. It's a good time to start the renewal process to avoid travel delays."
                : "Your Netflix subscription is increasing by $2 next month. Consider switching to an annual plan to save 15%."}
            </p>
          </div>
      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, trend, color }: any) {
  const colorMap: any = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    vault: 'text-emerald-400 bg-emerald-400/10',
    accent: 'text-cyan-400 bg-cyan-400/10'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-dark p-6 rounded-[2rem] border border-white/5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
          {trend}
        </div>
      </div>
    </motion.div>
  );
}
