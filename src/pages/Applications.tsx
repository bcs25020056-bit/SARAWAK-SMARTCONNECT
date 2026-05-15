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
import { collection, query, onSnapshot, orderBy, updateDoc, doc, where, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../contexts/FirebaseContext';

const Applications = () => {
  const { user, profile } = useFirebase();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get('type') as 'Job' | 'Scholarship' | null;
  const initialSearch = queryParams.get('q') || '';

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const fetchCandidateProfile = async (uid: string) => {
    setLoadingProfile(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setCandidateProfile(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching candidate profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleReviewApp = (app: any) => {
    setSelectedApp(app);
    fetchCandidateProfile(app.userId);
  };

  useEffect(() => {
    // If query param changes, update state
    const q = queryParams.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [location.search]);

  useEffect(() => {
    if (!user || !profile) return;
    
    let q;

    if (profile.role === 'admin') {
      q = query(collection(db, 'applications'), orderBy('appliedAt', 'desc'));
    } else if (profile.role === 'student') {
      q = query(collection(db, 'applications'), where('userId', '==', user.uid), orderBy('appliedAt', 'desc'));
    } else if (profile.role === 'company') {
      q = query(collection(db, 'applications'), where('companyId', '==', user.uid), orderBy('appliedAt', 'desc'));
    } else {
      // Fallback
      setLoading(false);
      return;
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

  const handleUpdateStatus = async (app: any, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'applications', app.id), { 
        status: newStatus,
        progress: newStatus === 'approved' ? 100 : newStatus === 'rejected' ? 100 : 50,
        updatedAt: serverTimestamp()
      });

      // Create notification for the candidate
      await addDoc(collection(db, 'notifications'), {
        userId: app.userId,
        title: `Application ${newStatus.toUpperCase()}`,
        message: newStatus === 'approved' 
          ? `Congratulations! Your application for "${app.jobTitle}" at ${app.company} has been approved.`
          : `We regret to inform you that your application for "${app.jobTitle}" at ${app.company} was not successful.`,
        type: newStatus === 'approved' ? 'success' : 'alert',
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${app.id}`);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesTab = activeTab === 'all' || app.status?.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = (app.candidateName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                         (app.jobTitle?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (app.company?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
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
    <>
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
        <div className="md:col-span-2 flex gap-2">
          {['all', 'pending', 'approved'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "flex-1 px-4 py-4 rounded-2xl font-bold inked-border transition-all capitalize text-xs",
                activeTab === tab ? "bg-primary text-on-primary" : "bg-white text-on-surface hover:bg-surface"
              )}
            >
              {tab === 'approved' ? 'Success' : tab}
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
                          {(profile?.role === 'company' || profile?.role === 'admin') && app.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(app, 'approved')}
                                className="p-2 rounded-xl bg-green-500 text-white hover:scale-110 transition-all font-black text-[10px] uppercase tracking-widest px-3"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(app, 'rejected')}
                                className="p-2 rounded-xl bg-red-500 text-white hover:scale-110 transition-all font-black text-[10px] uppercase tracking-widest px-3"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleReviewApp(app)}
                            className="p-2 rounded-xl border-2 border-slate-200 text-slate-400 hover:text-primary transition-all active:scale-95"
                            title="Review Profile"
                          >
                            <User size={18} />
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

      {/* Candidate Profile Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-surface rounded-[3rem] inked-border inked-shadow-lg overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b-2 border-outline/10 flex items-center justify-between bg-surface-container-low">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-container rounded-2xl inked-border flex items-center justify-center text-3xl">
                    {candidateProfile?.photoURL ? (
                      <img src={candidateProfile.photoURL} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : '👤'}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black font-headline text-on-surface leading-tight">
                      {selectedApp.candidateName}
                    </h2>
                    <p className="font-bold text-on-surface-variant flex items-center gap-2">
                       Reviewing Application for <span className="text-primary">{selectedApp.jobTitle}</span>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="w-12 h-12 rounded-full inked-border flex items-center justify-center hover:bg-surface-container transition-colors active:scale-95"
                >
                  <XCircle size={24} className="text-on-surface-variant" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                {loadingProfile ? (
                  <div className="py-20 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="font-bold text-outline uppercase tracking-widest text-xs">Fetching Profile...</p>
                  </div>
                ) : candidateProfile ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 flex flex-col gap-10">
                      <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                          <User size={14} /> Personal Bio
                        </h3>
                        <p className="text-lg font-medium text-on-surface leading-relaxed italic border-l-4 border-primary/20 pl-6">
                           "{candidateProfile.bio || 'This student hasn\'t provided a bio yet.'}"
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                          <GraduationCap size={14} /> Education History
                        </h3>
                        <div className="space-y-4">
                          {candidateProfile.education && candidateProfile.education.length > 0 ? (
                            candidateProfile.education.map((edu: any, i: number) => (
                              <div key={i} className="p-6 bg-surface-container rounded-2xl inked-border flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl inked-border flex items-center justify-center">
                                  <GraduationCap className="text-secondary" />
                                </div>
                                <div>
                                  <p className="text-lg font-black">{edu.degree}</p>
                                  <p className="text-sm font-bold text-on-surface-variant">{edu.institution} • {edu.year}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-on-surface-variant font-medium">No education history listed.</p>
                          )}
                        </div>
                      </section>

                      <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                          <CheckCircle2 size={14} /> Key Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {candidateProfile.skills && candidateProfile.skills.length > 0 ? (
                            candidateProfile.skills.map((skill: string) => (
                              <span key={skill} className="bg-primary/5 text-primary px-4 py-2 rounded-xl text-sm font-black inked-border border-primary/20">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-on-surface-variant font-medium">No skills showcased yet.</p>
                          )}
                        </div>
                      </section>
                    </div>

                    <div className="flex flex-col gap-6">
                       <div className="p-6 bg-surface-container-lowest rounded-3xl inked-border inked-shadow border-4 border-primary/10">
                          <h4 className="text-xs font-black uppercase tracking-widest text-center mb-6">Contact Info</h4>
                          <div className="space-y-4">
                             <div className="p-4 bg-white rounded-2xl inked-border">
                                <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">Email</p>
                                <p className="text-sm font-bold truncate">{candidateProfile.email}</p>
                             </div>
                             <div className="p-4 bg-white rounded-2xl inked-border">
                                <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">XP Points</p>
                                <p className="text-sm font-bold">{candidateProfile.xp || 0} Exploration Points</p>
                             </div>
                             <div className="p-4 bg-white rounded-2xl inked-border">
                                <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">Explorer Level</p>
                                <p className="text-sm font-bold">Level {candidateProfile.level || 1}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-red-500 font-bold">Failed to load student profile.</p>
                  </div>
                )}
              </div>

              {profile?.role !== 'student' && selectedApp.status === 'pending' && (
                <div className="p-8 bg-surface-container-low border-t-2 border-outline/10 flex gap-4">
                  <button 
                    onClick={() => {
                      handleUpdateStatus(selectedApp, 'approved');
                      setSelectedApp(null);
                    }}
                    className="flex-1 bg-green-500 text-white py-5 rounded-2xl font-black font-headline text-xl inked-border inked-shadow bubble-press flex items-center justify-center gap-3"
                  >
                    <CheckCircle2 size={24} />
                    Approve Application
                  </button>
                  <button 
                    onClick={() => {
                      handleUpdateStatus(selectedApp, 'rejected');
                      setSelectedApp(null);
                    }}
                    className="flex-1 bg-white text-red-500 py-5 rounded-2xl font-black font-headline text-xl inked-border inked-shadow bubble-press border-red-500 flex items-center justify-center gap-3"
                  >
                    <XCircle size={24} />
                    Reject Application
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Applications;
