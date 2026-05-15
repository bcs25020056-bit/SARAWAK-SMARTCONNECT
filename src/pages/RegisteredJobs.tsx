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
  Clock,
  GraduationCap,
  PlusCircle,
  X,
  Loader2,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

const RegisteredJobs = () => {
  const { user, profile } = useFirebase();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState<'all' | 'job' | 'scholarship'>('all');
  const [appStatusFilter, setAppStatusFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [appSortOrder, setAppSortOrder] = useState<'date' | 'name'>('date');
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    type: 'Full Time',
    category: 'Technology',
    icon: '💼',
    isScholarship: false
  });

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || profile?.role !== 'company') return;
    
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'jobs'), {
        ...newJob,
        company: profile.companyInfo?.name || profile.displayName || 'Our Company',
        companyId: user.uid,
        postedAt: serverTimestamp(),
        featured: false
      });
      setShowPostModal(false);
      setNewJob({
        title: '',
        description: '',
        location: '',
        salary: '',
        type: 'Full Time',
        category: 'Technology',
        icon: '💼',
        isScholarship: false
      });
      alert('Job posted successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'jobs');
    } finally {
      setIsSaving(false);
    }
  };

  const industries = ['All', 'Technology', 'E-commerce', 'Transport', 'Logistics', 'Finance'];

  const fetchStudentProfile = async (uid: string) => {
    setLoadingProfile(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setStudentProfile(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching student profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleReviewApplication = (app: any) => {
    setSelectedApplication(app);
    fetchStudentProfile(app.userId);
  };

  // Fetch all applications and jobs if admin or company
  useEffect(() => {
    if (!user || (profile?.role !== 'admin' && profile?.role !== 'company')) {
      setLoading(false);
      return;
    }

    const appsQuery = profile?.role === 'admin' 
      ? query(collection(db, 'applications'))
      : query(collection(db, 'applications'), where('companyId', '==', user.uid));

    const appsUnsubscribe = onSnapshot(appsQuery, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'applications');
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
    
    // Filter by search query
    let filteredApps = jobApps.filter(app => 
      (app.candidateName?.toLowerCase() || '').includes(appSearchQuery.toLowerCase())
    );

    // Filter by status if not 'all'
    if (appStatusFilter !== 'all') {
      filteredApps = filteredApps.filter(app => app.status === appStatusFilter);
    }

    // Sort
    filteredApps.sort((a, b) => {
      if (appSortOrder === 'name') {
        return (a.candidateName || '').localeCompare(b.candidateName || '');
      }
      return (b.appliedAt?.seconds || 0) - (a.appliedAt?.seconds || 0);
    });

    return {
      total: jobApps.length,
      pending: jobApps.filter(app => app.status === 'pending').length,
      approved: jobApps.filter(app => app.status === 'approved').length,
      displayApps: filteredApps
    };
  };

  const handleUpdateStatus = async (app: any, newStatus: string) => {
    setIsUpdatingStatus(true);
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
      
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${app.id}`);
      return false;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = (job.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                         (job.company?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesType = jobTypeFilter === 'all' || 
                       (jobTypeFilter === 'job' && !job.isScholarship) || 
                       (jobTypeFilter === 'scholarship' && job.isScholarship);
    return matchesSearch && matchesType;
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
    <div className="flex-1 px-4 lg:px-12 py-8 lg:py-20 bg-slate-50/50 overflow-x-hidden min-h-screen">
      {/* Dynamic Header */}
      <section className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6"
            >
              <TrendingUp size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Management Console</span>
            </motion.div>
            <h1 className="text-6xl lg:text-8xl font-black font-headline text-on-surface tracking-tightest leading-[0.85] mb-6">
              {profile?.role === 'student' ? 'Recommended' : 'Hiring'} <br /> 
              <span className="text-primary">{profile?.role === 'student' ? 'Bound.' : 'Pipeline.'}</span>
            </h1>
            <p className="text-lg font-medium text-slate-500 leading-relaxed">
              {profile?.role === 'student' 
                ? 'Your gateway to premium internships and career-launching scholarships across Malaysia.'
                : 'Centralized hub for managing your organization\'s applicant flow and job inventory.'}
            </p>
          </div>

          {profile?.role === 'company' && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPostModal(true)}
              className="bg-primary text-white p-2 rounded-[2.5rem] inked-border inked-shadow bubble-press flex items-center pr-10 gap-6 transition-all group"
            >
              <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center group-hover:bg-white/40 transition-colors">
                <PlusCircle size={40} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">Create New</span>
                <span className="block text-3xl font-black font-headline tracking-tight">Post Opening</span>
              </div>
            </motion.button>
          )}
        </div>

        {profile?.role === 'company' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Applicants', val: applications.length, icon: Users, color: 'text-primary' },
              { label: 'Shortlisted / Hired', val: applications.filter(a => a.status === 'approved').length, icon: CheckCircle2, color: 'text-green-600' },
              { label: 'Pending Review', val: applications.filter(a => a.status === 'pending').length, icon: Clock, color: 'text-red-500' },
              { label: 'Active Openings', val: jobs.length, icon: Briefcase, color: 'text-slate-800' }
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[2rem] inked-border border-slate-100 shadow-sm flex items-center gap-6"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50", stat.color)}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                  <div className={cn("text-3xl font-black font-headline", stat.color)}>{stat.val}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Master Control Bar */}
        {profile?.role === 'company' && (
          <div className="bg-white rounded-[2.5rem] inked-border inked-shadow-sm p-6 lg:p-8 mb-12 border-2 border-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
              {/* Search Section */}
              <div className="lg:col-span-2 w-full">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2 flex items-center gap-2">
                  <Search size={14} className="text-primary" /> Active Job Pipeline Search
                </p>
                <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-2xl border-2 border-slate-100 focus-within:border-primary focus-within:bg-white transition-all shadow-sm">
                  <input 
                    type="text"
                    placeholder="Search candidate name or job title..."
                    value={appSearchQuery}
                    onChange={(e) => {
                      setAppSearchQuery(e.target.value);
                      setSearchQuery(e.target.value); // Sync both
                    }}
                    className="bg-transparent border-none outline-none font-bold text-lg w-full placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Status Filter Only */}
              <div className="w-full">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2 flex items-center gap-2">
                  <Filter size={14} className="text-secondary" /> Workflow Status
                </p>
                <div className="flex bg-slate-50 p-1.5 rounded-2xl border-2 border-slate-100 min-h-[64px]">
                  {['all', 'pending', 'approved'].map((st) => (
                    <button 
                      key={st}
                      onClick={() => setAppStatusFilter(st as any)}
                      className={cn(
                        "flex-1 px-1 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all",
                        appStatusFilter === st 
                          ? (st === 'pending' ? "bg-red-500 text-white shadow-md shadow-red-100" : st === 'approved' ? "bg-green-600 text-white shadow-md shadow-green-100" : "bg-slate-800 text-white shadow-md shadow-slate-100")
                          : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {st === 'all' ? 'All' : st === 'approved' ? 'Approved' : st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student View Controls */}
        {profile?.role === 'student' && (
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
              <input 
                type="text"
                placeholder="Search companies or roles..."
                className="w-full bg-white rounded-3xl inked-border pl-16 pr-4 py-5 font-bold outline-none border-2 border-slate-100 focus:border-primary transition-all text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
              {industries.map(industry => (
                <button 
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={cn(
                    "px-8 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap",
                    selectedIndustry === industry 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-white border-slate-100 text-slate-400 hover:border-primary/40"
                  )}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
              <motion.article 
                key={job.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white rounded-[3rem] inked-border p-10 hover:-translate-y-2 transition-all relative overflow-hidden flex flex-col shadow-sm hover:shadow-xl"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary blur-[100px] opacity-[0.03] pointer-events-none" />
                
                <div className="flex justify-between items-start mb-8">
                  <div className="w-20 h-20 rounded-3xl inked-border flex items-center justify-center text-4xl bg-slate-50 border-slate-100 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                    {job.icon || '💼'}
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className="bg-primary/5 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                      {job.type || 'Full Time'}
                    </span>
                    {job.isScholarship && (
                      <span className="bg-secondary/10 text-secondary px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter">
                        Scholarship Program
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-4xl font-black font-headline text-on-surface mb-3 tracking-tightest group-hover:text-primary transition-colors leading-none">
                  {job.title}
                </h3>
                
                <div className="flex items-center gap-2 text-on-surface-variant font-bold text-sm mb-6 opacity-70">
                  <Building2 size={16} className="text-primary" />
                  {job.company}
                </div>
                
                <div className="flex flex-wrap gap-3 mb-10 pb-6 border-b border-slate-50">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-2xl">
                    <MapPin size={12} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
                    <Users size={12} />
                    {getJobStats(job.id).total}
                  </div>
                  {getJobStats(job.id).pending > 0 && (
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-4 py-2 rounded-2xl animate-pulse">
                      <Clock size={12} />
                      {getJobStats(job.id).pending} Review
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col gap-6">
                  {getJobStats(job.id).displayApps.length > 0 ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                          {appStatusFilter === 'pending' ? <Clock size={12} className="text-red-400" /> : appStatusFilter === 'approved' ? <CheckCircle2 size={12} className="text-green-500" /> : <Users size={12} />}
                          {appStatusFilter === 'pending' ? 'Review Queue' : appStatusFilter === 'approved' ? 'Talent Pool' : 'Consolidated List'}
                        </h4>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black border border-slate-100">
                          {getJobStats(job.id).displayApps.length}
                        </div>
                      </div>
                      
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {getJobStats(job.id).displayApps.map(app => (
                          <motion.div 
                            layout
                            key={app.id} 
                            className={cn(
                              "group/item flex items-center justify-between p-5 rounded-[1.5rem] inked-border transition-all hover:bg-white hover:border-primary/20 hover:translate-x-1",
                              app.status === 'approved' ? "bg-green-50/30 border-green-100/50" : "bg-slate-50/50 border-slate-100"
                            )}
                          >
                            <div className="min-w-0">
                              <button 
                                onClick={() => handleReviewApplication(app)}
                                className="text-left group/name flex flex-col"
                              >
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "text-lg font-black font-headline text-on-surface truncate group-hover/name:text-primary transition-colors tracking-tight",
                                    app.status === 'approved' && "text-green-900"
                                  )}>
                                    {app.candidateName}
                                  </span>
                                  {app.status !== 'pending' && (
                                    <span className={cn(
                                      "px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter",
                                      app.status === 'approved' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    )}>
                                      {app.status === 'approved' ? 'Successful' : 'Rejected'}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-80 flex items-center gap-1.5">
                                  <Clock size={10} className="text-slate-300" />
                                  {app.appliedAt ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pending Timestamp'}
                                </span>
                              </button>
                            </div>
                            <div className="flex gap-2 flex-shrink-0 ml-4">
                              {app.status === 'pending' && (
                                <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => handleUpdateStatus(app, 'approved')}
                                    className="w-11 h-11 rounded-2xl bg-green-500 text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-green-500/20 active:scale-95"
                                  >
                                    <CheckCircle2 size={20} />
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateStatus(app, 'rejected')}
                                    className="w-11 h-11 rounded-2xl bg-white text-red-500 flex items-center justify-center border-2 border-red-500/10 hover:bg-red-50 transition-all active:scale-95"
                                  >
                                    <XCircle size={20} />
                                  </button>
                                </div>
                              )}
                              <button 
                                onClick={() => handleReviewApplication(app)}
                                className={cn(
                                  "w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95",
                                  app.status === 'approved' ? "bg-green-600 text-white shadow-lg shadow-green-600/20" : "bg-white text-primary border-2 border-primary/10 hover:border-primary/40"
                                )}
                              >
                                <ChevronRight size={20} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-16 text-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 mt-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-50">
                        <Users size={24} className="text-slate-200" />
                      </div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                        {appSearchQuery ? 'No Results' : 'Queue Empty'}
                      </p>
                    </div>
                  )}
                  
                  <Link 
                    to={`/applications?q=${job.title}`}
                    className="w-full mt-8 bg-slate-900 text-white py-5 rounded-[1.5rem] font-black font-headline text-center transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98]"
                  >
                    View Pipeline History
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </motion.article>
            ))
          )}
        </AnimatePresence>
      </div>

      {profile?.role === 'company' && filteredJobs.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Building2 size={48} className="text-slate-300" />
          </div>
          <h3 className="text-2xl font-black font-headline text-on-surface mb-2">No Active Job Openings</h3>
          <p className="text-on-surface-variant font-medium">Post a new opening to start receiving applications.</p>
        </div>
      )}

      {profile?.role === 'student' && filteredCompanies.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Building2 size={48} className="text-slate-300" />
          </div>
          <h3 className="text-2xl font-black font-headline text-on-surface mb-2">No Opportunities Found</h3>
          <p className="text-on-surface-variant font-medium">Try adjusting your filters or search query.</p>
        </div>
      )}

      {/* Candidate Profile Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApplication(null)}
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
                    {studentProfile?.photoURL ? (
                      <img src={studentProfile.photoURL} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : '👤'}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black font-headline text-on-surface leading-tight">
                      {selectedApplication.candidateName}
                    </h2>
                    <p className="font-bold text-on-surface-variant flex items-center gap-2">
                       Reviewing Application for <span className="text-primary">{selectedApplication.jobTitle}</span>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedApplication(null)}
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
                ) : studentProfile ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 flex flex-col gap-10">
                      {/* Bio */}
                      <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                          <User size={14} /> Personal Bio
                        </h3>
                        <p className="text-lg font-medium text-on-surface leading-relaxed italic border-l-4 border-primary/20 pl-6">
                           "{studentProfile.bio || 'This student hasn\'t provided a bio yet.'}"
                        </p>
                      </section>

                      {/* Education */}
                      <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                          <GraduationCap size={14} /> Education History
                        </h3>
                        <div className="space-y-4">
                          {studentProfile.education && studentProfile.education.length > 0 ? (
                            studentProfile.education.map((edu: any, i: number) => (
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

                      {/* Skills */}
                      <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                          <CheckCircle2 size={14} /> Key Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {studentProfile.skills && studentProfile.skills.length > 0 ? (
                            studentProfile.skills.map((skill: string) => (
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
                                <p className="text-sm font-bold truncate">{studentProfile.email}</p>
                             </div>
                             <div className="p-4 bg-white rounded-2xl inked-border">
                                <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">XP Points</p>
                                <p className="text-sm font-bold">{studentProfile.xp || 0} Exploration Points</p>
                             </div>
                             <div className="p-4 bg-white rounded-2xl inked-border">
                                <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">Explorer Level</p>
                                <p className="text-sm font-bold">Level {studentProfile.level || 1}</p>
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

              <div className="p-8 bg-surface-container-low border-t-2 border-outline/10 flex gap-4">
                <button 
                  disabled={isUpdatingStatus}
                  onClick={async () => {
                    const success = await handleUpdateStatus(selectedApplication, 'approved');
                    if (success) setSelectedApplication(null);
                  }}
                  className="flex-1 bg-green-500 text-white py-5 rounded-2xl font-black font-headline text-xl inked-border inked-shadow bubble-press flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isUpdatingStatus ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
                  Approve Application
                </button>
                <button 
                  disabled={isUpdatingStatus}
                  onClick={async () => {
                    const success = await handleUpdateStatus(selectedApplication, 'rejected');
                    if (success) setSelectedApplication(null);
                  }}
                  className="flex-1 bg-white text-red-500 py-5 rounded-2xl font-black font-headline text-xl inked-border inked-shadow bubble-press border-red-500 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isUpdatingStatus ? <Loader2 className="animate-spin" size={24} /> : <XCircle size={24} />}
                  Reject Application
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Post Job Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPostModal(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-surface rounded-[3rem] inked-border inked-shadow-lg overflow-hidden"
            >
              <div className="p-8 border-b-2 border-outline/10 flex items-center justify-between bg-surface-container-low">
                <h2 className="text-3xl font-black font-headline text-on-surface">Post New Job Opening</h2>
                <button onClick={() => setShowPostModal(false)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                  <X />
                </button>
              </div>

              <form onSubmit={handlePostJob} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary ml-2">Job Title</label>
                    <input 
                      required
                      type="text" 
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      placeholder="e.g. Software Engineer Intern"
                      className="w-full bg-surface-container-highest rounded-2xl inked-border px-4 py-3 font-bold focus:border-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary ml-2">Location</label>
                    <input 
                      required
                      type="text" 
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      placeholder="e.g. Kuching, Sarawak"
                      className="w-full bg-surface-container-highest rounded-2xl inked-border px-4 py-3 font-bold focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary ml-2">Category</label>
                    <select 
                      value={newJob.category}
                      onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                      className="w-full bg-surface-container-highest rounded-2xl inked-border px-4 py-3 font-bold focus:border-primary outline-none"
                    >
                      <option>Technology</option>
                      <option>E-commerce</option>
                      <option>Transport</option>
                      <option>Finance</option>
                      <option>Education</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary ml-2">Job Type</label>
                    <select 
                      value={newJob.type}
                      onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                      className="w-full bg-surface-container-highest rounded-2xl inked-border px-4 py-3 font-bold focus:border-primary outline-none"
                    >
                      <option>Full Time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                      <option>Part Time</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary ml-2">Listing Category</label>
                    <div className="flex gap-2 p-1 bg-surface-container-highest rounded-2xl inked-border">
                      <button
                        type="button"
                        onClick={() => setNewJob({ ...newJob, isScholarship: false })}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                          !newJob.isScholarship ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-200"
                        )}
                      >
                        Standard Job
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewJob({ ...newJob, isScholarship: true })}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                          newJob.isScholarship ? "bg-secondary text-white" : "text-slate-400 hover:bg-slate-200"
                        )}
                      >
                        Scholarship
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-primary ml-2">Job Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    placeholder="Describe the role and requirements..."
                    className="w-full bg-surface-container-highest rounded-2xl inked-border px-4 py-3 font-bold focus:border-primary outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary ml-2">Salary Estimate</label>
                    <input 
                      type="text" 
                      value={newJob.salary}
                      onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                      placeholder="e.g. RM 2,000 - RM 3,500"
                      className="w-full bg-surface-container-highest rounded-2xl inked-border px-4 py-3 font-bold focus:border-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary ml-2">Small Icon (Emoji)</label>
                    <input 
                      type="text" 
                      value={newJob.icon}
                      onChange={(e) => setNewJob({ ...newJob, icon: e.target.value })}
                      placeholder="e.g. 💻, 🎨, 📊"
                      className="w-full bg-surface-container-highest rounded-2xl inked-border px-4 py-3 font-bold focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-primary text-on-primary py-5 rounded-2xl font-black font-headline text-xl inked-border inked-shadow bubble-press flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : <PlusCircle />}
                  {isSaving ? 'Posting...' : 'Confirm and Post Opening'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegisteredJobs;
