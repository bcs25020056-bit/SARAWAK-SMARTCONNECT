import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, CircleDollarSign, Brain, Megaphone, Star, Rocket, Palette, BarChart3, ChevronLeft, ChevronRight, Plus, Loader2, Building2, Briefcase, Landmark, GraduationCap, Award, Users } from 'lucide-react';
import { collection, query, limit, onSnapshot, orderBy, where, deleteDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../contexts/FirebaseContext';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import JobModal from '../components/JobModal';

const Dashboard = () => {
  const { user, profile, loading: authLoading } = useFirebase();
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<any>(null);

  useEffect(() => {
    if (!user || !profile) return;

    // Fetch jobs
    let jobsQuery;
    if (profile.role === 'company') {
      // Companies see their own jobs
      jobsQuery = query(
        collection(db, 'jobs'), 
        where('companyId', '==', user.uid),
        orderBy('postedAt', 'desc')
      );
    } else {
      // Students see recommended jobs
      jobsQuery = query(collection(db, 'jobs'), limit(5));
    }

    const unsubscribeJobs = onSnapshot(jobsQuery, (snapshot) => {
      setRecommendedJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'jobs');
    });

    // Fetch recent notifications as alerts
    const alertsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    const unsubscribeAlerts = onSnapshot(alertsQuery, (snapshot) => {
      setRecentAlerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notifications');
      setLoading(false);
    });

    return () => {
      unsubscribeJobs();
      unsubscribeAlerts();
    };
  }, [user]);

  const scholarships = [
    { title: 'PTPTN Loan', icon: Landmark, color: 'bg-primary-container', applicants: 1240, desc: 'National higher education fund for Malaysian students.' },
    { title: 'Yayasan Sarawak', icon: GraduationCap, color: 'bg-secondary-container', applicants: 850, desc: 'Special scholarships and loans for Sarawakian students.' },
    { title: 'Petronas Scholarship', icon: Award, color: 'bg-tertiary-container', applicants: 3200, desc: 'Full scholarship for high-achieving students in STEM fields.' },
  ];

  const handleDeleteJob = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `jobs/${jobId}`);
    }
  };

  const handleEditJob = (job: any) => {
    setJobToEdit(job);
    setIsJobModalOpen(true);
  };

  const handleCreateJob = () => {
    setJobToEdit(null);
    setIsJobModalOpen(true);
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const xpProgress = profile ? (profile.xp % 1000) / 10 : 0;
  const xpToNext = profile ? 1000 - (profile.xp % 1000) : 1000;

  if (profile?.role === 'company') {
    return (
      <div className="flex-1 px-4 lg:px-12 pb-20 overflow-x-hidden">
        {/* Company Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 mt-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="lg:col-span-2 bg-secondary text-on-secondary p-10 rounded-3xl inked-border relative overflow-hidden flex flex-col justify-center"
          >
            <div className="relative z-10">
              <h1 className="text-5xl font-black font-headline mb-4">Hello, {profile?.companyInfo?.name || 'Partner'}! 🏢</h1>
              <p className="text-xl font-medium opacity-90 max-w-md">Ready to find your next star employee? You have {recommendedJobs.length} active job postings.</p>
            </div>
            <Building2 className="absolute right-8 top-8 text-8xl opacity-20 rotate-12" />
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-container-highest p-8 rounded-3xl inked-border flex flex-col justify-between"
          >
            <div>
              <h3 className="font-headline font-extrabold text-2xl mb-2 text-secondary">Recruitment Stats</h3>
              <p className="text-on-surface-variant font-semibold">Company Account</p>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 bg-white p-4 rounded-2xl inked-border text-center">
                <p className="text-3xl font-black text-secondary font-headline">{recommendedJobs.length}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Active Jobs</p>
              </div>
              <div className="flex-1 bg-white p-4 rounded-2xl inked-border text-center">
                <p className="text-3xl font-black text-secondary font-headline">0</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Applications</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Company Actions */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-black font-headline text-on-surface">Manage Postings</h2>
            <button 
              onClick={handleCreateJob}
              className="px-8 py-3 bg-secondary text-on-secondary font-black rounded-full inked-border inked-shadow flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Plus size={24} /> Post New Job
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {recommendedJobs.length === 0 ? (
              <div className="col-span-full py-20 bg-white rounded-3xl inked-border border-2 border-dashed flex flex-col items-center justify-center text-center">
                <Briefcase size={48} className="text-on-surface-variant mb-4 opacity-20" />
                <h3 className="text-xl font-black font-headline mb-2">No jobs posted yet</h3>
                <p className="text-on-surface-variant max-w-xs">Start by posting your first job opening to attract top talent in Sarawak.</p>
              </div>
            ) : (
              recommendedJobs.map((job, i) => (
                <motion.div 
                  key={job.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => handleEditJob(job)}
                  className="bg-white rounded-3xl inked-border p-8 hover:-translate-y-2 transition-transform cursor-pointer group relative"
                >
                  <button 
                    onClick={(e) => handleDeleteJob(e, job.id)}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error hover:text-white"
                  >
                    <Plus size={20} className="rotate-45" />
                  </button>
                  <div className="w-16 h-16 bg-secondary-container rounded-2xl inked-border mb-6 flex items-center justify-center text-3xl">
                    {job.icon || '💼'}
                  </div>
                  <h3 className="font-headline font-extrabold text-2xl mb-1">{job.title}</h3>
                  <p className="text-on-surface-variant mb-4 font-bold">{job.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-secondary-container/30 text-secondary text-xs font-black rounded-full uppercase">
                      {job.type || 'Full Time'}
                    </span>
                    <span className="text-sm font-bold text-on-surface-variant">0 Applicants</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        <JobModal 
          isOpen={isJobModalOpen} 
          onClose={() => setIsJobModalOpen(false)} 
          jobToEdit={jobToEdit} 
        />
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 lg:px-12 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 mt-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="lg:col-span-2 bg-primary text-on-primary p-10 rounded-3xl inked-border relative overflow-hidden flex flex-col justify-center"
        >
          <div className="relative z-10">
            <h1 className="text-5xl font-black font-headline mb-4">Welcome Back, {profile?.displayName?.split(' ')[0] || 'Explorer'}! 👋</h1>
            <p className="text-xl font-medium opacity-90 max-w-md">You're doing amazing! You've already completed {profile?.badges?.length || 0} milestones. Keep that momentum going!</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl" />
          <Star className="absolute right-8 top-8 text-8xl opacity-20 rotate-12" fill="currentColor" />
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-container-highest p-8 rounded-3xl inked-border flex flex-col justify-between"
        >
          <div>
            <h3 className="font-headline font-extrabold text-2xl mb-2 text-primary">Your Progress</h3>
            <p className="text-on-surface-variant font-semibold">Level {profile?.level || 1} {profile?.role || 'Explorer'}</p>
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-end mb-2">
              <span className="font-black text-4xl text-primary font-headline">{Math.round(xpProgress)}%</span>
              <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">{xpToNext}xp to next level</span>
            </div>
            <div className="h-10 w-full bg-white rounded-full inked-border p-1.5 overflow-hidden">
              <div 
                className="h-full bg-tertiary-container rounded-full inked-border flex items-center justify-end px-3 transition-all duration-1000" 
                style={{ width: `${xpProgress}%` }}
              >
                <div className="w-3 h-3 bg-white/50 rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Scholarships Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black font-headline text-on-surface">Available Scholarships</h2>
          <Link to="/scholarships" className="px-6 py-2 bg-white text-primary font-bold rounded-full inked-border hover:bg-surface-container transition-colors">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {scholarships.map((scholarship, i) => (
            <motion.div 
              key={scholarship.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white rounded-3xl inked-border p-8 hover:-translate-y-2 transition-transform cursor-pointer group"
            >
              <div className={cn("w-20 h-20 rounded-2xl inked-border mb-6 flex items-center justify-center group-hover:rotate-6 transition-transform", scholarship.color)}>
                <scholarship.icon size={40} className="text-on-surface" />
              </div>
              <h3 className="font-headline font-extrabold text-2xl mb-3">{scholarship.title}</h3>
              <p className="text-on-surface-variant mb-6 font-medium">{scholarship.desc}</p>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-400">{scholarship.applicants} applicants</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Alerts */}
        <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-3xl inked-border">
          <div className="flex items-center gap-3 mb-8">
            <Megaphone className="text-error" size={32} />
            <h2 className="text-2xl font-black font-headline">Recent Alerts</h2>
          </div>
          <div className="space-y-6">
            {recentAlerts.length === 0 ? (
              <p className="text-on-surface-variant font-medium text-center py-8">No recent alerts.</p>
            ) : (
              recentAlerts.map((alert, i) => (
                <div key={i} className={cn(
                  "bg-white p-6 rounded-2xl inked-border border-l-[12px] flex gap-4",
                  alert.type === 'alert' ? 'border-secondary' : alert.type === 'success' ? 'border-tertiary' : 'border-primary'
                )}>
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-1">{alert.title}</p>
                    <p className="text-sm text-on-surface-variant line-clamp-2">{alert.message}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {alert.createdAt ? new Date(alert.createdAt.seconds * 1000).toLocaleDateString() : 'Now'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Jobs */}
        <div className="lg:col-span-3 bg-white p-8 rounded-3xl inked-border overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Rocket className="text-primary" size={32} />
              <h2 className="text-2xl font-black font-headline">Recommended Jobs</h2>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full inked-border flex items-center justify-center hover:bg-surface-container transition-colors">
                <ChevronLeft size={24} />
              </button>
              <button className="w-10 h-10 rounded-full inked-border flex items-center justify-center hover:bg-surface-container transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {recommendedJobs.length === 0 ? (
              <p className="text-on-surface-variant font-medium text-center py-8 w-full">No recommended jobs yet.</p>
            ) : (
              recommendedJobs.map((job, i) => (
                <Link to="/jobs" key={i} className="min-w-[280px] bg-surface p-6 rounded-3xl inked-border flex flex-col gap-4 hover:scale-[1.02] transition-transform">
                  <div className="w-14 h-14 bg-white rounded-xl inked-border flex items-center justify-center text-3xl">
                    {job.icon || '🚀'}
                  </div>
                  <div>
                    <h4 className="font-bold text-xl">{job.title}</h4>
                    <p className="text-sm text-on-surface-variant">{job.company}</p>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="px-3 py-1 bg-primary-container/30 text-primary text-xs font-black rounded-full uppercase">
                      {job.internship ? 'Internship' : 'Full Time'}
                    </span>
                    <span className="text-lg font-bold">{job.salary}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FAB */}
      <Link to="/jobs" className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-full inked-border shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-50">
        <Plus size={32} />
      </Link>
    </div>
  );
};

export default Dashboard;
