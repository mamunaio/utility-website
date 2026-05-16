'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { 
  CreditCard, 
  Bell, 
  Users, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  PieChart
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3" />
            AI-Powered Life Assistant
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
          >
            Manage your life <br /> without the clutter.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 leading-relaxed"
          >
            The ultimate life manager for common people. Track subscriptions, split bills, 
            and manage document expiries. Zero signup required to get started.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/dashboard"
              className="group relative px-8 py-4 bg-primary text-white rounded-2xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <span className="flex items-center gap-2">
                Get Started for Free <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
            <button className="px-8 py-4 glass hover:bg-white/10 rounded-2xl font-bold transition-all">
              Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<CreditCard className="w-6 h-6" />}
              title="Subscription Tracker"
              description="Monitor all your streaming and digital services in one place."
              badge="Viral Hook"
            />
            <FeatureCard 
              icon={<Bell className="w-6 h-6" />}
              title="Smart Reminders"
              description="Never miss a passport renewal or utility bill again."
              badge="AI-Powered"
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6" />}
              title="Family Workspace"
              description="Share subscriptions and tasks with your family members."
              badge="Paid"
            />
            <FeatureCard 
              icon={<PieChart className="w-6 h-6" />}
              title="Spending Insights"
              description="Get AI-driven analysis of your monthly expenses."
              badge="AI-Powered"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">5+</div>
            <div className="text-muted-foreground text-sm uppercase tracking-widest">Free Reminders</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">$4/mo</div>
            <div className="text-muted-foreground text-sm uppercase tracking-widest">Premium Tier</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">8%</div>
            <div className="text-muted-foreground text-sm uppercase tracking-widest">Conv. Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">No</div>
            <div className="text-muted-foreground text-sm uppercase tracking-widest">Signup Needed</div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description, badge }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  badge?: string
}) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-dark p-8 rounded-[2rem] flex flex-col items-start gap-4 hover:border-primary/50 transition-colors"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      {badge && (
        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-bold text-white/40 uppercase tracking-tighter">
          {badge}
        </span>
      )}
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">
        {description}
      </p>
    </motion.div>
  );
}
