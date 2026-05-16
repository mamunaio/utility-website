'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Modal } from '@/components/ui/Modal';
import { Plus, Bell, Calendar, Trash2, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import { db } from '@/lib/db';

export default function RemindersPage() {
  const { reminders, fetchData, addReminder } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    type: 'document' as 'document' | 'task' | 'bill',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addReminder({
      title: formData.title,
      description: formData.description,
      date: new Date(formData.date),
      type: formData.type,
      priority: formData.priority,
      completed: false
    });
    setIsModalOpen(false);
    setFormData({
      title: '',
      description: '',
      date: '',
      type: 'document',
      priority: 'medium'
    });
  };

  const toggleComplete = async (id: number, completed: boolean) => {
    await db.reminders.update(id, { completed: !completed });
    fetchData();
  };

  const deleteReminder = async (id: number) => {
    await db.reminders.delete(id);
    fetchData();
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
          <p className="text-muted-foreground">Never miss a deadline or renewal again.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-2xl font-bold transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add Reminder
        </button>
      </div>

      <div className="space-y-4">
        {reminders.length === 0 ? (
          <div className="py-20 text-center glass-dark rounded-[2.5rem] border-2 border-dashed border-white/5">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Your schedule is clear.</p>
          </div>
        ) : (
          reminders.map((rem) => (
            <motion.div 
              layout
              key={rem.id}
              className={`glass-dark p-6 rounded-[2rem] flex items-center justify-between group transition-all ${rem.completed ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => rem.id && toggleComplete(rem.id, rem.completed)}
                  className="text-secondary hover:scale-110 transition-transform"
                >
                  {rem.completed ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                </button>
                <div>
                  <h3 className={`text-lg font-bold ${rem.completed ? 'line-through' : ''}`}>{rem.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-widest mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> 
                      {new Date(rem.date).toLocaleDateString()}
                    </span>
                    <span className={`flex items-center gap-1 font-black ${
                      rem.priority === 'high' ? 'text-destructive' : 
                      rem.priority === 'medium' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      <AlertTriangle className="w-3 h-3" /> 
                      {rem.priority}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => rem.id && deleteReminder(rem.id)}
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
        title="New Reminder"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground ml-1">Title</label>
            <input 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-secondary transition-colors"
              placeholder="Passport Expiry, Rent Due..."
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground ml-1">Type</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-secondary transition-colors appearance-none"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="document">Document</option>
                <option value="bill">Bill</option>
                <option value="task">Task</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground ml-1">Priority</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-secondary transition-colors appearance-none"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground ml-1">Date</label>
            <input 
              required
              type="date"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-secondary transition-colors"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-secondary text-white rounded-2xl py-4 font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-secondary/20"
          >
            Save Reminder
          </button>
        </form>
      </Modal>
    </div>
  );
}
