import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Search, 
  MapPin, 
  ExternalLink, 
  Briefcase,
  Users,
  Star,
  ChevronRight,
  TrendingUp,
  Globe,
  User,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

const RegisteredJobs = () => {
  const { user, profile } = useFirebase();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const industries = ['All', 'Technology', 'E-commerce', 'Transport', 'Logistics', 'Finance'];

  // Fetch all applications and jobs if admin or company
  useEffect(() => {
    if (!user || (profile?.role !== 'admin' && profile?.role !== 'company')) {
      setLoading(false);
      return;
    }

    const appsUnsubscribe = onSnapshot(collection(db, 'applications'), (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const jobsQuery = profile?.role === 'admin' 
      ? query(collection(db, 'jobs'))
      : query(collection(db, 'jobs'), where('companyId', '==', user.uid));

    const jobsUnsubscribe = onSnapshot(jobsQuery, (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      appsUnsubscribe();
      jobsUnsubscribe();
    };
  }, [user, profile]);

  const getJobStats = (jobId: string) => {
    const jobApps = applications.filter(app => app.jobId === jobId);
    return {
      total: jobApps.length,
      pending: jobApps.filter(app => app.status === 'pending').length,
      pendingApps: jobApps.filter(app => app.status === 'pending')
    };
  };

  const handleUpdateStatus = async (app: any, newStatus: string) => {
    try {
      // 1. Update application status
      await updateDoc(doc(db, 'applications', app.id), { 
        status: newStatus,
        progress: newStatus === 'approved' ? 100 : newStatus === 'rejected' ? 100 : 50,
        updatedAt: serverTimestamp()
      });

      // 2. Create notification for the candidate
      await addDoc(collection(db, 'notifications'), {
        userId: app.userId,
        title: `Job Application ${newStatus.toUpperCase()}`,
        message: newStatus === 'approved' 
          ? `Congratulations! Your application for "${app.jobTitle}" at ${app.company} has been approved.`
          : `We regret to inform you that your application for "${app.jobTitle}" at ${app.company} was not successful at this time.`,
        type: newStatus === 'approved' ? 'success' : 'alert',
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${app.id}`);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = (job.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                         (job.company?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const companies = [
    {
      id: 'yayasan-sarawak',
      name: 'Yayasan Sarawak',
      industry: 'Scholarships / Education',
      location: 'Kuching, Sarawak',
      desc: 'Financial assistance and scholarships for Sarawakian students to pursue higher education.',
      jobs: '5+ Schemes',
      rating: 4.8,
      website: 'https://yayasansarawak.org.my/',
      color: 'bg-primary',
      logo: '🎓',
      isScholarship: true
    },
    {
      id: 'shopee',
      name: 'Shopee',
      industry: 'E-commerce',
      location: 'Kuala Lumpur, Malaysia',
      desc: 'Leading e-commerce platform in Southeast Asia and Taiwan.',
      jobs: 12,
      rating: 4.5,
      website: 'https://careers.shopee.com.my/',
      color: 'bg-orange-500',
      logo: '🧡'
    },
    {
      id: 'petronas',
      name: 'PETRONAS',
      industry: 'Energy / Scholarships',
      location: 'Kuala Lumpur, Malaysia',
      desc: 'Global energy partner offering prestigious education sponsorship programs.',
      jobs: 24,
      rating: 4.6,
      website: 'https://www.petronas.com/sustainability/powering-knowledge',
      color: 'bg-teal-500',
      logo: '💧',
      isScholarship: true
    },
    {
      id: 'grab',
      name: 'Grab',
      industry: 'Transport / Technology',
      location: 'Petaling Jaya, Malaysia',
      desc: 'Southeast Asia\'s leading superapp, providing everyday services for consumers.',
      jobs: 8,
      rating: 4.3,
      website: 'https://grab.careers/',
      color: 'bg-green-600',
      logo: '💚'
    },
    {
      id: 'maybank',
      name: 'Maybank',
      industry: 'Finance',
      location: 'Kuala Lumpur, Malaysia',
      desc: 'Largest financial services group in Malaysia and one of the largest in SE Asia.',
      jobs: 15,
      rating: 4.4,
      website: 'https://www.maybank.com/en/careers/overview.page',
      color: 'bg-yellow-400',
      logo: '🦁'
    }
  ];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         company.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || company.industry.includes(selectedIndustry);
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="flex-1 px-4 lg:px-12 py-8 lg:py-12 bg-surface overflow-x-hidden">
      {/* Header */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-4"
            >
              <TrendingUp size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Hiring Directly</span>
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-black font-headline text-on-surface tracking-tighter leading-none mb-4">
              {profile?.role === 'student' ? 'Recommended' : 'Pending'} <br /> 
              {profile?.role === 'student' ? 'Opportunities.' : 'Approval.'}
            </h1>
            <p className="text-xl font-medium text-on-surface-variant max-w-xl">
              {profile?.role === 'student' 
                ? 'Explore partner organizations and scholarship providers across Malaysia.'
                : 'Review and manage candidates who have applied for your posted positions.'}
            </p>
          </div>
          
          <div className="flex flex-col gap-4 min-w-[300px]">
            {profile?.role !== 'student' && (
              <div className="flex gap-4">
                <div className="flex-1 bg-primary/5 rounded-2xl p-4 inked-border border-primary/20">
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Total Applicants</div>
                  <div className="text-2xl font-black font-headline text-primary">{applications.length}</div>
                </div>
                <div className="flex-1 bg-red-500/5 rounded-2xl p-4 inked-border border-red-500/20">
                  <div className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">Pending Review</div>
                  <div className="text-2xl font-black font-headline text-red-500">
                    {applications.filter(app => app.status === 'pending').length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {profile?.role === 'student' ? (
            filteredCompanies.map((company, i) => (
              <motion.div 
                key={company.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white rounded-[2.5rem] inked-border p-8 hover:-translate-y-2 transition-all relative overflow-hidden"
              >
                <div className={cn(
                  "absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 transition-opacity group-hover:opacity-20",
                  company.color
                )} />
                
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl inked-border flex items-center justify-center text-3xl",
                    company.color,
                    "bg-opacity-10 border-opacity-20"
                  )}>
                    {company.logo}
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-3 py-1 rounded-full text-xs font-black">
                      <Star size={12} fill="currentColor" />
                      {company.rating}
                    </div>
                    {company.isScholarship && (
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter animate-pulse">
                        Recommended for You
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-3xl font-black font-headline text-on-surface mb-2 tracking-tight group-hover:text-primary transition-colors">
                  {company.name}
                </h3>
                
                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-4">
                  <Building2 size={16} />
                  {company.industry}
                </div>
                
                <p className="text-on-surface-variant font-medium mb-6 line-clamp-2">
                  {company.desc}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                    <MapPin size={14} />
                    {company.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-xl">
                    <Briefcase size={14} />
                    {company.jobs} Vacancies
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Link 
                      to={`/job-search?q=${company.name}`}
                      className="flex-1 bg-white text-primary border-2 border-primary py-4 rounded-2xl font-black font-headline text-center hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                    >
                      View Details
                      <ChevronRight size={18} />
                    </Link>
                    <a 
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-2xl border-2 border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all"
                    >
                      <Globe size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            filteredJobs.map((job, i) => (
              <motion.div 
                key={job.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white rounded-[2.5rem] inked-border p-8 hover:-translate-y-2 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-3xl opacity-5" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-2xl inked-border flex items-center justify-center text-3xl bg-primary/10 border-primary/20">
                    {job.icon || '💼'}
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black">
                    {job.type || 'Full Time'}
                  </div>
                </div>
                
                <h3 className="text-3xl font-black font-headline text-on-surface mb-2 tracking-tight group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                
                <div className="flex items-center gap-2 text-on-surface-variant font-bold text-sm mb-4">
                  <Building2 size={16} />
                  {job.company}
                </div>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                    <MapPin size={14} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-xl">
                    <Users size={14} />
                    {getJobStats(job.id).total} Applicants
                    {getJobStats(job.id).pending > 0 && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Pending Applications" />
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  {getJobStats(job.id).pending > 0 ? (
                    <div className="mt-2 border-t-2 border-slate-100 pt-6">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <Clock size={14} /> Pending Review ({getJobStats(job.id).pending})
                      </h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {getJobStats(job.id).pendingApps.map(app => (
                          <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl inked-border border-slate-200">
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-on-surface truncate">{app.candidateName}</p>
                              <p className="text-[10px] text-slate-400 font-medium truncate">Applied {app.appliedAt ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString() : 'recently'}</p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0 ml-2">
                              <button 
                                onClick={() => handleUpdateStatus(app, 'approved')}
                                className="p-2 rounded-lg bg-green-500 text-white hover:scale-110 transition-all shadow-sm active:scale-95"
                                title="Approve"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(app, 'rejected')}
                                className="p-2 rounded-lg bg-red-500 text-white hover:scale-110 transition-all shadow-sm active:scale-95"
                                title="Reject"
                              >
                                <XCircle size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-slate-50 rounded-3xl inked-border border-2 border-dashed">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No pending applicants</p>
                    </div>
                  )}
                  
                  <Link 
                    to={`/applications?q=${job.title}`}
                    className="w-full mt-4 bg-white text-on-surface-variant py-4 rounded-2xl font-black font-headline text-center inked-border hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    View All History
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {filteredCompanies.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Building2 size={48} className="text-slate-300" />
          </div>
          <h3 className="text-2xl font-black font-headline text-on-surface mb-2">No Pending Approval Found</h3>
          <p className="text-on-surface-variant font-medium">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
};

export default RegisteredJobs;
