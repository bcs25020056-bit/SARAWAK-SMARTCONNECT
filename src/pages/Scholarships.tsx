import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, ExternalLink, Users, Search, Landmark, MessageSquareX, CircleDollarSign, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../contexts/FirebaseContext';

const Scholarships = () => {
  const { user, profile } = useFirebase();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'scholarships'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setScholarships(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = ['All', 'Government', 'Private', 'University', 'International'];

  const handleApply = async (scholarship: any) => {
    // Open link
    window.open(scholarship.link, '_blank', 'noopener,noreferrer');

    // Also record tracking if logged in
    if (!user) return;
    
    setApplyingId(scholarship.id);
    try {
      await addDoc(collection(db, 'applications'), {
        userId: user.uid,
        candidateName: profile?.displayName || user.email?.split('@')[0] || 'User',
        jobId: scholarship.id,
        jobTitle: scholarship.title,
        company: scholarship.provider,
        companyId: 'admin', // Scholarships belong to admin review or system
        type: 'Scholarship',
        status: 'pending',
        progress: 15,
        appliedAt: serverTimestamp()
      });

      // Add a notification
      await addDoc(collection(db, 'notifications'), {
        userId: user.uid,
        title: 'Scholarship Application Tracked!',
        message: `We've noted your interest in ${scholarship.title}. Your application status is now being tracked.`,
        type: 'info',
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
       handleFirestoreError(error, OperationType.CREATE, 'applications');
    } finally {
      setApplyingId(null);
    }
  };

  const filteredScholarships = scholarships.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 px-4 lg:px-12 pb-20 mx-auto max-w-7xl">
      <header className="mb-12 mt-8 text-center md:text-left">
        <h1 className="text-5xl font-black font-headline tracking-tighter text-on-surface mb-4">Scholarship Portal</h1>
        <p className="text-on-surface-variant font-medium text-lg max-w-2xl">
          Find and apply for the best financial aid opportunities to fuel your educational journey in Sarawak.
        </p>
      </header>

      <div className="flex flex-col xl:flex-row gap-6 mb-12">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text" 
            placeholder="Search for scholarships, providers..." 
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl inked-border font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar text-on-surface">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-3 rounded-2xl font-bold inked-border transition-all whitespace-nowrap",
                cat === selectedCategory ? "bg-primary text-on-primary shadow-lg" : "bg-white text-on-surface hover:bg-surface"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredScholarships.length > 0 ? (
              filteredScholarships.map((scholarship, i) => (
                <motion.div 
                  key={scholarship.id}
                  layout
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="bg-white rounded-[2.5rem] inked-border overflow-hidden group hover:-translate-y-2 transition-all inked-shadow-sm flex flex-col h-full"
                >
                  <div className="p-8 flex flex-col h-full">
                    <div className="mb-6">
                      <span className={cn(
                        "px-3 py-1 text-[10px] font-black rounded-full border-2 uppercase tracking-widest mb-4 inline-block",
                        scholarship.category === 'Government' ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/10 text-secondary border-secondary/20"
                      )}>
                        {scholarship.category}
                      </span>
                      <div>
                        <h3 className="text-2xl font-black font-headline mb-2 group-hover:text-primary transition-colors leading-tight">
                          {scholarship.title}
                        </h3>
                        <p className="text-on-surface-variant font-bold text-sm flex items-center gap-1.5 opacity-70">
                          <Landmark size={14} /> {scholarship.provider}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-8 grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Amount</span>
                        <div className="flex items-center gap-1.5 text-sm font-black text-secondary">
                          <CircleDollarSign size={14} />
                          <span>{scholarship.amount.split(' ')[0]}</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Eligible</span>
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-600 truncate">
                          <Users size={14} />
                          <span>{scholarship.eligibility.split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <button 
                        onClick={() => handleApply(scholarship)}
                        disabled={applyingId === scholarship.id}
                        className="w-full py-4 bg-primary text-on-primary rounded-2xl font-headline font-black inked-border pressed-shadow hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                      >
                        {applyingId === scholarship.id ? <Loader2 className="animate-spin" size={18} /> : 'Apply Now'} <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 flex flex-col items-center justify-center text-on-surface-variant"
              >
                <div className="w-20 h-20 bg-surface rounded-3xl border-2 border-dashed border-outline/30 flex items-center justify-center mb-6">
                  <MessageSquareX size={40} className="text-outline" />
                </div>
                <h3 className="text-2xl font-black font-headline mb-2">No Scholarships Found</h3>
                <p className="font-bold text-on-surface">Try adjusting your filters or search query.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Scholarships;
