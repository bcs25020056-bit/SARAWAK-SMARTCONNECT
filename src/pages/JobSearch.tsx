import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Terminal, Brush, Bookmark, Star, History, Check, HelpCircle, Lock, Loader2, Briefcase, MapPin, DollarSign } from 'lucide-react';
import { collection, query, getDocs, addDoc, serverTimestamp, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from '../contexts/FirebaseContext';
import { cn } from '../lib/utils';

interface Job {
  id: string;
  title: string;
  company: string;
  tags: string[];
  desc: string;
  icon: string;
  featured?: boolean;
  internship?: boolean;
  salary?: string;
  location?: string;
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: string;
  progress: number;
  appliedAt: any;
}

const JobSearch = () => {
  const { user } = useFirebase();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const categories = ['All', 'Tech', 'Design', 'Marketing', 'Admin', 'Tourism'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsCol = collection(db, 'jobs');
        const jobsSnapshot = await getDocs(jobsCol);
        
        if (jobsSnapshot.empty) {
          // Seed initial jobs if empty
          const initialJobs = [
            {
              title: 'Senior Frontend Dev',
              company: 'TechSarawak Hub',
              tags: ['Full-time', 'Remote friendly'],
              desc: 'Join our vibrant team building the next generation of digital services for the people of Sarawak. Modern stack: React, Tailwind, and Node.',
              icon: 'Terminal',
              featured: true,
              salary: 'RM 8k - 12k',
              location: 'Kuching'
            },
            {
              title: 'UI/UX Design Intern',
              company: 'Creative Borneo',
              tags: ['Hybrid'],
              desc: 'Looking for a creative soul with a passion for bubbly interfaces and playful brand stories. Learn from the best designers in the region.',
              icon: 'Brush',
              internship: true,
              salary: 'RM 1k - 1.5k',
              location: 'Kuching'
            },
            {
              title: 'Data Analyst',
              company: 'Sarawak Energy',
              tags: ['Full-time'],
              desc: 'Help us power the future of Sarawak through data-driven insights. Experience with SQL and Python preferred.',
              icon: 'Briefcase',
              salary: 'RM 5k - 7k',
              location: 'Kuching'
            }
          ];

          for (const job of initialJobs) {
            await addDoc(jobsCol, job);
          }
          
          const newSnapshot = await getDocs(jobsCol);
          setJobs(newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job)));
        } else {
          setJobs(jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job)));
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'applications'),
      where('userId', '==', user.uid),
      orderBy('appliedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'applications');
    });

    return () => unsubscribe();
  }, [user]);

  const handleApply = async (job: Job) => {
    if (!user) return;
    
    // Check if already applied
    if (applications.some(app => app.jobId === job.id)) {
      alert('You have already applied for this position!');
      return;
    }

    setApplyingId(job.id);
    try {
      await addDoc(collection(db, 'applications'), {
        userId: user.uid,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        status: 'Review',
        progress: 15,
        appliedAt: serverTimestamp()
      });
      
      // Add a notification
      await addDoc(collection(db, 'notifications'), {
        userId: user.uid,
        title: 'Application Sent!',
        message: `Your application for ${job.title} at ${job.company} has been received.`,
        type: 'success',
        read: false,
        createdAt: serverTimestamp()
      });

    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'applications');
    } finally {
      setApplyingId(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.title.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return Terminal;
      case 'Brush': return Brush;
      default: return Briefcase;
    }
  };

  return (
    <div className="pt-8 pb-12 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-72 shrink-0">
        <div className="bg-surface-container-highest rounded-3xl inked-border p-6 flex flex-col gap-8 sticky top-32 inked-shadow">
          <div>
            <h3 className="font-headline font-extrabold text-xl mb-6">Job Filters</h3>
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white rounded-full border-2 border-outline px-6 py-3 focus:border-primary focus:ring-0 transition-all font-medium"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full font-bold text-sm inked-border bubble-press",
                    selectedCategory === cat ? "bg-primary text-on-primary inked-shadow" : "bg-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant">Job Type</p>
            {['Full-time', 'Internship', 'Contract'].map((type, i) => (
              <label key={type} className="flex items-center gap-3 group cursor-pointer">
                <input 
                  type="checkbox" 
                  defaultChecked={i === 0}
                  className="w-6 h-6 rounded-md border-2 border-outline text-primary focus:ring-primary" 
                />
                <span className="font-bold group-hover:text-primary transition-colors">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-10">
        <header className="relative">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-headline font-extrabold text-5xl lg:text-6xl text-on-surface leading-none mb-2">Career Path</h1>
              <p className="text-xl font-medium text-on-surface-variant">Find your dream job in Sarawak's growing ecosystem.</p>
            </div>
            <div className="bg-tertiary-container rounded-full inked-border px-6 py-2 flex items-center gap-3 inked-shadow">
              <Star className="text-on-tertiary-container" size={20} fill="currentColor" />
              <span className="font-bold text-on-tertiary-container">{filteredJobs.length} Roles Found!</span>
            </div>
          </div>
        </header>

        {/* Job Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : (
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {filteredJobs.map((job, i) => {
              const Icon = getIcon(job.icon);
              const hasApplied = applications.some(app => app.jobId === job.id);
              
              return (
                <motion.article 
                  key={job.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl inked-border p-6 inked-shadow flex flex-col gap-6 relative overflow-hidden group"
                >
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-container/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-surface-container rounded-2xl inked-border flex items-center justify-center">
                        <Icon size={32} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-headline font-extrabold text-xl leading-tight">{job.title}</h4>
                        <p className="font-bold text-on-surface-variant text-sm">{job.company}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {job.featured && <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-black inked-border">FEATURED</span>}
                      {job.internship && <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-black inked-border uppercase">Internship</span>}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.location && (
                      <span className="bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-bold border-2 border-outline/30 flex items-center gap-1">
                        <MapPin size={12} /> {job.location}
                      </span>
                    )}
                    {job.salary && (
                      <span className="bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-bold border-2 border-outline/30 flex items-center gap-1">
                        <DollarSign size={12} /> {job.salary}
                      </span>
                    )}
                    {job.tags.map(tag => (
                      <span key={tag} className="bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-bold border-2 border-outline/30">{tag}</span>
                    ))}
                  </div>

                  <p className="text-sm line-clamp-2 text-on-surface-variant font-medium">
                    {job.desc}
                  </p>

                  <div className="mt-auto flex gap-4 pt-4 border-t-2 border-dashed border-outline/20">
                    <button 
                      onClick={() => handleApply(job)}
                      disabled={hasApplied || applyingId === job.id}
                      className={cn(
                        "flex-1 rounded-full font-extrabold py-3 inked-border inked-shadow bubble-press flex items-center justify-center gap-2 transition-all",
                        hasApplied ? "bg-surface-container-high text-outline cursor-not-allowed" : "bg-primary text-on-primary"
                      )}
                    >
                      {applyingId === job.id ? <Loader2 className="animate-spin" size={20} /> : null}
                      {hasApplied ? 'Applied' : 'Apply Now'}
                    </button>
                    <button className="w-12 h-12 rounded-full inked-border flex items-center justify-center hover:bg-surface-container transition-colors active:scale-95">
                      <Bookmark size={24} />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </section>
        )}

        {/* Application History */}
        <section className="mt-6">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-headline font-extrabold text-3xl">Application History</h2>
            <div className="h-1 flex-1 bg-outline/20 rounded-full" />
          </div>
          
          <div className="flex flex-col gap-6">
            {applications.length === 0 ? (
              <div className="bg-white rounded-3xl inked-border p-12 text-center inked-shadow">
                <p className="font-bold text-on-surface-variant">No applications yet. Start your journey today!</p>
              </div>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="bg-white rounded-3xl inked-border overflow-hidden inked-shadow">
                  <div className="p-6 border-b-2 border-outline/10 flex items-center justify-between bg-surface-container-low">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full inked-border flex items-center justify-center">
                        <History className="text-primary" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold">{app.jobTitle}</h4>
                        <p className="text-xs text-on-surface-variant font-semibold">
                          {app.company} • Applied {app.appliedAt ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-tertiary uppercase tracking-wider">{app.status}</span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center inked-border", app.progress >= 25 ? "bg-tertiary text-on-tertiary" : "bg-white text-outline opacity-50")}>
                          <Check size={16} />
                        </div>
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center inked-border", app.progress >= 50 ? "bg-tertiary text-on-tertiary" : "bg-white text-outline opacity-50")}>
                          <Check size={16} />
                        </div>
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center inked-border", app.progress >= 75 ? "bg-tertiary text-on-tertiary" : "bg-white text-outline opacity-50")}>
                          <HelpCircle size={16} />
                        </div>
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center inked-border", app.progress >= 100 ? "bg-tertiary text-on-tertiary" : "bg-white text-outline opacity-50")}>
                          <Lock size={16} />
                        </div>
                      </div>
                      <span className="font-bold text-sm">Progress: {app.progress}%</span>
                    </div>
                    
                    <div className="relative h-6 bg-surface-container rounded-full border-2 border-outline overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${app.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute left-0 top-0 h-full bg-tertiary-container border-r-4 border-on-tertiary-container rounded-full" 
                      />
                    </div>
                    
                    <div className="mt-4 flex justify-between text-[10px] font-black uppercase tracking-widest text-outline">
                      <span className={cn(app.progress >= 25 && "text-primary")}>Review</span>
                      <span className={cn(app.progress >= 50 && "text-primary")}>Shortlist</span>
                      <span className={cn(app.progress >= 75 && "text-primary")}>Interview</span>
                      <span className={cn(app.progress >= 100 && "text-primary")}>Offer</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobSearch;
