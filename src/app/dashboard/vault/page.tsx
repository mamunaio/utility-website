'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Modal } from '@/components/ui/Modal';
import { 
  ShieldCheck, 
  Plus, 
  Calendar, 
  FileText, 
  Tag, 
  AlertTriangle,
  Trash2,
  FileCheck,
  Search,
  ExternalLink
} from 'lucide-react';

const DOC_TYPES = [
  'Passport',
  'National ID',
  'Driving License',
  'Trade License',
  'Insurance Policy',
  'Contract/Agreement',
  'Other'
];

export default function DocumentVaultPage() {
  const { documents, addDocument, deleteDocument, fetchData, loading } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newDoc, setNewDoc] = useState({
    name: '',
    type: 'Passport',
    documentNumber: '',
    expiryDate: '',
    issueDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const expiryDate = new Date(newDoc.expiryDate);
    const now = new Date();
    const monthsUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    let status: 'active' | 'expiring_soon' | 'expired' = 'active';
    if (expiryDate < now) status = 'expired';
    else if (monthsUntilExpiry <= 3) status = 'expiring_soon';

    await addDocument({
      ...newDoc,
      expiryDate,
      issueDate: newDoc.issueDate ? new Date(newDoc.issueDate) : undefined,
      status
    });

    setNewDoc({
      name: '',
      type: 'Passport',
      documentNumber: '',
      expiryDate: '',
      issueDate: '',
      notes: ''
    });
    setIsModalOpen(false);
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.documentNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired': return 'text-red-400 bg-red-400/10';
      case 'expiring_soon': return 'text-amber-400 bg-amber-400/10';
      default: return 'text-emerald-400 bg-emerald-400/10';
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Document Vault</h1>
          <p className="text-muted-foreground">Keep your important documents safe and track their expiry.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Add Document</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-dark p-6 rounded-3xl border border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <span className="text-muted-foreground font-medium">Total Active</span>
          </div>
          <p className="text-3xl font-bold">{documents.filter(d => d.status === 'active').length}</p>
        </div>
        <div className="glass-dark p-6 rounded-3xl border border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <span className="text-muted-foreground font-medium">Expiring Soon</span>
          </div>
          <p className="text-3xl font-bold">{documents.filter(d => d.status === 'expiring_soon').length}</p>
        </div>
        <div className="glass-dark p-6 rounded-3xl border border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-muted-foreground font-medium">Expired</span>
          </div>
          <p className="text-3xl font-bold">{documents.filter(d => d.status === 'expired').length}</p>
        </div>
      </div>

      {/* Search & List */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search documents by name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode='popLayout'>
            {filteredDocs.map((doc) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-dark p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getStatusColor(doc.status)}`}>
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold">{doc.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(doc.status)}`}>
                        {doc.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-4 h-4" />
                        {doc.type}
                      </span>
                      {doc.documentNumber && (
                        <span className="font-mono bg-white/5 px-2 py-0.5 rounded italic">
                          #{doc.documentNumber}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => doc.id && deleteDocument(doc.id)}
                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredDocs.length === 0 && !loading && (
            <div className="text-center py-20 glass-dark rounded-3xl border border-dashed border-white/10">
              <FileCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-medium text-muted-foreground">No documents found</h3>
              <p className="text-sm text-muted-foreground/60 mt-1">Start by adding your first document to the vault.</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Document"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Document Name</label>
            <input 
              required
              type="text"
              placeholder="e.g. Passport - Mamun"
              value={newDoc.name}
              onChange={(e) => setNewDoc({...newDoc, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Document Type</label>
              <select 
                value={newDoc.type}
                onChange={(e) => setNewDoc({...newDoc, type: e.target.value})}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {DOC_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Document Number</label>
              <input 
                type="text"
                placeholder="Optional"
                value={newDoc.documentNumber}
                onChange={(e) => setNewDoc({...newDoc, documentNumber: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Issue Date</label>
              <input 
                type="date"
                value={newDoc.issueDate}
                onChange={(e) => setNewDoc({...newDoc, issueDate: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
              <input 
                required
                type="date"
                value={newDoc.expiryDate}
                onChange={(e) => setNewDoc({...newDoc, expiryDate: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Notes</label>
            <textarea 
              placeholder="Any extra info..."
              value={newDoc.notes}
              onChange={(e) => setNewDoc({...newDoc, notes: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-24 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            Save to Vault
          </button>
        </form>
      </Modal>
    </div>
  );
}
