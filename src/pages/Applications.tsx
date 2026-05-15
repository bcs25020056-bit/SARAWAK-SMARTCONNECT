import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  ChevronRight,
  MessageSquare,
  FileText,
  User,
  GraduationCap,
  Briefcase,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { collection, query, onSnapshot, orderBy, updateDoc, doc, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../contexts/FirebaseContext';

const Applications = () => {
  const { user, profile } = useFirebase();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get('type') as 'Job' | 'Scholarship' | null;
  const initialSearch = queryParams.get('q') || '';

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [activeType, setActiveType] = useState<'all' | 'Job' | 'Scholarship'>(initialType || 'all');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If query param changes, update state
    const type = queryParams.get('type') as 'Job' | 'Scholarship' | null;
    const q = queryParams.get('q');
    if (type) {
      setActiveType(type);
    }
    if (q) {
      setSearchQuery(q);
    }
  }, [location.search]);

  useEffect(() => {
    if (!user) return;
    
    let q = query(collection(db, 'applications'), orderBy('appliedAt', 'desc'));

    if (profile?.role === 'student') {
      q = query(collection(db, 'applications'), where('userId', '==', user.uid), orderBy('appliedAt', 'desc'));
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'applications');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, profile]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'applications', id), { 
        status: newStatus,
        progress: newStatus === 'approved' ? 100 : newStatus === 'rejected' ? 100 : 50
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${id}`);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesTab = activeTab === 'all' || app.status?.toLowerCase() === activeTab.toLowerCase();
    const matchesType = activeType === 'all' || app.type === activeType;
    const matchesSearch = (app.candidateName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                         (app.jobTitle?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (app.company?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesTab && matchesType && matchesSearch;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={14} />;
      case 'approved': return <CheckCircle2 size={14} />;
      case 'rejected': return <XCircle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 px-4 lg:px-12 pb-20 mx-auto max-w-7xl">
      <header className="mb-12 mt-8">
        <h1 className="text-5xl font-black font-headline tracking-tighter text-on-surface mb-4">
          {profile?.role === 'student' ? 'My Applications' : 'Application Management'}
        </h1>
        <p className="text-on-surface-variant font-medium text-lg max-w-2xl">
          {profile?.role === 'student' 
            ? 'Track the status of your scholarship and job applications here.'
            : 'Review and manage all scholarship and job applications from students across Sarawak.'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text" 
            placeholder="Search candidates or opportunities..." 
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl inked-border font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="md:col-span-1 flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "flex-1 px-4 py-4 rounded-2xl font-bold inked-border transition-all capitalize text-xs",
                activeTab === tab ? "bg-primary text-on-primary" : "bg-white text-on-surface hover:bg-surface"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="md:col-span-1 flex gap-2">
          {['all', 'Job', 'Scholarship'].map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type as any)}
              className={cn(
                "flex-1 px-4 py-4 rounded-2xl font-bold inked-border transition-all capitalize text-xs",
                activeType === type ? "bg-secondary text-on-secondary" : "bg-white text-on-surface hover:bg-surface"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="mt-4 font-bold text-on-surface-variant">Loading applications...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] inked-border overflow-hidden inked-shadow">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-[3px] border-slate-200">
                  <th className="px-8 py-6 text-left font-black font-headline text-xs uppercase tracking-widest text-slate-500">Candidate</th>
                  <th className="px-8 py-6 text-left font-black font-headline text-xs uppercase tracking-widest text-slate-500">Type</th>
                  <th className="px-8 py-6 text-left font-black font-headline text-xs uppercase tracking-widest text-slate-500">Opportunity</th>
                  <th className="px-8 py-6 text-left font-black font-headline text-xs uppercase tracking-widest text-slate-500">Status</th>
                  <th className="px-8 py-6 text-left font-black font-headline text-xs uppercase tracking-widest text-slate-500">Date</th>
                  <th className="px-8 py-6 text-right font-black font-headline text-xs uppercase tracking-widest text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredApps.map((app, i) => (
                    <motion.tr 
                      key={app.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b-2 border-slate-100 hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full inked-border bg-primary-container flex items-center justify-center">
                            <User size={20} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-on-surface leading-tight">{app.candidateName || 'Unknown candidate'}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{app.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {app.type === 'Scholarship' ? (
                            <GraduationCap size={16} className="text-secondary" />
                          ) : (
                            <Briefcase size={16} className="text-tertiary" />
                          )}
                          <span className="text-sm font-bold text-on-surface-variant font-headline">{app.type}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-on-surface line-clamp-1">{app.jobTitle}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 text-[10px] font-black uppercase tracking-widest",
                          getStatusStyle(app.status)
                        )}>
                          {getStatusIcon(app.status)}
                          {app.status}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <p className="text-sm font-bold text-on-surface-variant">
                          {app.appliedAt ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {app.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(app.id, 'approved')}
                                className="p-2 rounded-xl bg-green-500 text-white hover:scale-110 transition-all font-black text-[10px] uppercase tracking-widest px-3"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                className="p-2 rounded-xl bg-red-500 text-white hover:scale-110 transition-all font-black text-[10px] uppercase tracking-widest px-3"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button className="p-2 rounded-xl border-2 border-slate-200 text-slate-400 hover:text-primary transition-all">
                            <FileText size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredApps.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant">
                <ClipboardList size={48} className="text-outline mb-4 opacity-20" />
                <h3 className="text-xl font-black font-headline">No applications found</h3>
                <p className="font-bold">Adjust your filters or try a different search query.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
