'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  Plus, 
  Trash2, 
  Share2, 
  Copy,
  Check
} from 'lucide-react';

export default function BillSplitPage() {
  const [amount, setAmount] = useState('');
  const [participants, setParticipants] = useState(['You', 'Friend 1']);
  const [copied, setCopied] = useState(false);

  const addParticipant = () => {
    setParticipants([...participants, `Friend ${participants.length}`]);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const updateParticipant = (index: number, name: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = name;
    setParticipants(newParticipants);
  };

  const splitAmount = amount ? (parseFloat(amount) / participants.length).toFixed(2) : '0.00';

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bill Split</h1>
          <p className="text-muted-foreground">Split expenses instantly with friends.</p>
        </div>
        <button 
          onClick={copyLink}
          className="flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 rounded-2xl font-bold transition-all"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
          {copied ? 'Copied!' : 'Share Tool'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-dark p-8 rounded-[2.5rem] space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground ml-1">Total Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <input 
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-5 text-2xl font-black focus:outline-none focus:border-primary transition-colors"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-muted-foreground ml-1">Participants</label>
                <button 
                  onClick={addParticipant}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Person
                </button>
              </div>
              
              <div className="space-y-3">
                {participants.map((name, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                      value={name}
                      onChange={(e) => updateParticipant(index, e.target.value)}
                    />
                    <button 
                      onClick={() => removeParticipant(index)}
                      className="p-3 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] bg-primary/10 border-primary/20 text-center flex flex-col justify-center min-h-[300px]">
            <div className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">Each Person Pays</div>
            <div className="text-7xl font-black tracking-tighter mb-4">${splitAmount}</div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <Users className="w-4 h-4" />
              <span>Splitting between {participants.length} people</span>
            </div>
          </div>

          <div className="glass-dark p-6 rounded-3xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Copy className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium">Auto-save to history</div>
            </div>
            <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
