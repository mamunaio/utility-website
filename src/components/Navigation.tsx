'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutGrid, Bell, CreditCard, Users } from 'lucide-react';

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-dark px-6 py-3 rounded-full flex items-center gap-8 pointer-events-auto"
      >
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg">LifeManager</span>
        </Link>
        
        <div className="h-4 w-[1px] bg-white/10" />
        
        <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/dashboard" className="text-white bg-primary/20 hover:bg-primary/30 px-4 py-1.5 rounded-full border border-primary/20 transition-all">
            Dashboard
          </Link>
        </div>
      </motion.div>
    </nav>
  );
};
