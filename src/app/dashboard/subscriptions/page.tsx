'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Modal } from '@/components/ui/Modal';
import { Plus, CreditCard, Calendar, Tag, DollarSign, Trash2 } from 'lucide-react';
import { db } from '@/lib/db';

export default function SubscriptionsPage() {
  const { subscriptions, fetchData, addSubscription } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'USD',
    billingCycle: 'monthly',
    nextBillingDate: '',
    category: 'Streaming'
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addSubscription({
      name: formData.name,
      price: parseFloat(formData.price),
      currency: formData.currency,
      billingCycle: formData.billingCycle as 'monthly' | 'yearly',
      nextBillingDate: new Date(formData.nextBillingDate),
      category: formData.category
    });
    setIsModalOpen(false);
    setFormData({
      name: '',
      price: '',
      currency: 'USD',
      billingCycle: 'monthly',
      nextBillingDate: '',
      category: 'Streaming'
    });
  };

  const deleteSubscription = async (id: number) => {
    await db.subscriptions.delete(id);
    fetchData();
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground">Manage your monthly and yearly services.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add Subscription
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {subscriptions.length === 0 ? (
          <div className="py-20 text-center glass-dark rounded-[2.5rem] border-2 border-dashed border-white/5">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">No subscriptions tracked yet.</p>
          </div>
        ) : (
          subscriptions.map((sub) => (
            <motion.div 
              layout
              key={sub.id}
              className="glass-dark p-6 rounded-[2rem] flex items-center justify-between group"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-black">
                  {sub.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{sub.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-widest mt-1">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {sub.category}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {sub.billingCycle}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-xl font-black">${sub.price}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Next: {new Date(sub.nextBillingDate).toLocaleDateString()}</div>
                </div>
                <button 
                  onClick={() => sub.id && deleteSubscription(sub.id)}
                  className="p-3 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="New Subscription"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground ml-1">Service Name</label>
            <input 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-colors"
              placeholder="Netflix, Spotify, Gym..."
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground ml-1">Price</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  required
                  type="number"
                  step="0.01"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-5 py-4 focus:outline-none focus:border-primary transition-colors"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground ml-1">Cycle</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-colors appearance-none"
                value={formData.billingCycle}
                onChange={(e) => setFormData({...formData, billingCycle: e.target.value})}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground ml-1">Next Billing Date</label>
            <input 
              required
              type="date"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-colors"
              value={formData.nextBillingDate}
              onChange={(e) => setFormData({...formData, nextBillingDate: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-primary text-white rounded-2xl py-4 font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            Save Subscription
          </button>
        </form>
      </Modal>
    </div>
  );
}
