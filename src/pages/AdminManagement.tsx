import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Building2, 
  Search, 
  Edit3, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  SearchX,
  Loader2,
  Trash2,
  GraduationCap,
  Globe,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirebase } from '../contexts/FirebaseContext';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  deleteDoc, 
  doc,
  addDoc,
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

const AdminManagement = () => {
  const { profile, adminUpdateProfile } = useFirebase();
  const [activeTab, setActiveTab] = useState<'students' | 'companies' | 'scholarships'>('students');
  const [users, setUsers] = useState<any[]>([]);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingScholarship, setEditingScholarship] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      console.log("Admin Portal - Current User Profile:", profile);
    }
  }, [profile]);

  useEffect(() => {
    if (profile?.role !== 'admin') return;

    setLoading(true);
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      if (activeTab !== 'scholarships') setLoading(false);
    });

    const unsubScholarships = onSnapshot(collection(db, 'scholarships'), (snapshot) => {
      const scholarshipData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Scholarships updated. IDs found:", scholarshipData.map(s => s.id));
      setScholarships(scholarshipData);
      if (activeTab === 'scholarships') setLoading(false);
    });

    return () => {
      unsubUsers();
      unsubScholarships();
    };
  }, [profile, activeTab]);

  const filteredUsers = users.filter(user => {
    const isModeMatch = activeTab === 'students' 
      ? (user.role === 'student' || !user.role) 
      : user.role === 'company';
    
    const searchLower = searchQuery.toLowerCase();
    const name = user.displayName || user.companyInfo?.name || '';
    const email = user.email || '';
    
    return isModeMatch && (name.toLowerCase().includes(searchLower) || email.toLowerCase().includes(searchLower));
  });

  const filteredScholarships = scholarships.filter(s => {
    const searchLower = searchQuery.toLowerCase();
    return s.title.toLowerCase().includes(searchLower) || s.provider.toLowerCase().includes(searchLower);
  });

  const handleEdit = (user: any) => {
    setEditingUser({ ...user });
  };

  const handleEditScholarship = (s: any) => {
    console.log("Editing scholarship:", s);
    setEditingScholarship({ ...s });
  };

  const handleCreateScholarship = () => {
    setEditingScholarship({
      title: '',
      provider: '',
      category: 'Government',
      amount: '',
      eligibility: '',
      link: ''
    });
  };

  const handleSaveScholarship = async () => {
    if (!editingScholarship) return;
    setIsSaving(true);
    try {
      const { id, ...data } = editingScholarship;
      if (id) {
        await setDoc(doc(db, 'scholarships', id), data, { merge: true });
        alert('Scholarship updated successfully!');
      } else {
        await addDoc(collection(db, 'scholarships'), { ...data, createdAt: serverTimestamp() });
        alert('Scholarship posted successfully!');
      }
      setEditingScholarship(null);
    } catch (error) {
      console.error('Failed to save scholarship:', error);
      handleFirestoreError(error, OperationType.WRITE, 'scholarships');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteScholarship = async (id: string) => {
    console.log("handleDeleteScholarship executing for:", id);
    if (!id) {
      alert('Error: Missing scholarship ID.');
      return;
    }
    
    try {
      console.log(`Executing deletion: ${id}`);
      const scholarshipRef = doc(db, 'scholarships', id);
      await deleteDoc(scholarshipRef);
      console.log('Deletion successful');
      setDeletingId(null);
    } catch (error: any) {
      console.error('Delete operation failed:', error);
      alert(`Delete failed: ${error?.message || 'Unknown error'}`);
      handleFirestoreError(error, OperationType.DELETE, `scholarships/${id}`);
    }
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    setIsSaving(true);
    try {
      await adminUpdateProfile(editingUser.id, editingUser);
      alert('User profile updated successfully!');
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update profile:', error);
      handleFirestoreError(error, OperationType.UPDATE, `users/${editingUser.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      alert('Error: No User ID provided for deletion.');
      return;
    }
    
    try {
      console.log(`Starting deletion for user profile: ${id}`);
      await deleteDoc(doc(db, 'users', id));
      console.log('User deletion successful');
      setDeletingId(null);
    } catch (error: any) {
      console.error('User delete failed:', error);
      alert(`Could not delete user: ${error?.message || 'Unknown error'}`);
      handleFirestoreError(error, OperationType.DELETE, `users/${id}`);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShieldCheck size={80} className="text-error mb-6 opacity-20" />
        <h2 className="text-3xl font-black font-headline text-on-surface mb-2">Restricted Access</h2>
        <p className="text-on-surface-variant font-medium max-w-md">
          Only Sarawak Smart Connect administrators can access this management portal.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 px-4 lg:px-12 py-8 lg:py-12 bg-surface">
        {/* Header */}
        <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-4">
              <ShieldCheck size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Admin Control Center</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black font-headline text-on-surface tracking-tighter leading-none mb-4">
              System <br /> Management.
            </h1>
            <p className="text-xl font-medium text-on-surface-variant max-w-xl">
              Maintain system reliability by managing student and company accounts across the platform.
            </p>
          </div>

          <div className="flex bg-white p-2 rounded-2xl inked-border shadow-sm">
            <button 
              onClick={() => setActiveTab('students')}
              className={cn(
                "px-8 py-3 rounded-xl font-headline font-black text-sm transition-all flex items-center gap-2",
                activeTab === 'students' ? "bg-primary text-on-primary inked-shadow" : "text-on-surface-variant hover:bg-surface"
              )}
            >
              <Users size={18} /> Students
            </button>
            <button 
              onClick={() => setActiveTab('companies')}
              className={cn(
                "px-8 py-3 rounded-xl font-headline font-black text-sm transition-all flex items-center gap-2",
                activeTab === 'companies' ? "bg-primary text-on-primary inked-shadow" : "text-on-surface-variant hover:bg-surface"
              )}
            >
              <Building2 size={18} /> Companies
            </button>
            <button 
              onClick={() => setActiveTab('scholarships')}
              className={cn(
                "px-8 py-3 rounded-xl font-headline font-black text-sm transition-all flex items-center gap-2",
                activeTab === 'scholarships' ? "bg-primary text-on-primary inked-shadow" : "text-on-surface-variant hover:bg-surface"
              )}
            >
              <GraduationCap size={18} /> Scholarships
            </button>
          </div>
        </div>
      </section>

      {/* Action Bar (Only for Scholarships) */}
      {activeTab === 'scholarships' && (
        <div className="mb-10 flex flex-wrap gap-4">
          <button 
            onClick={handleCreateScholarship}
            className="flex items-center gap-2 px-8 py-5 bg-primary text-on-primary rounded-3xl font-headline font-black text-lg inked-border pressed-shadow shadow-xl shadow-primary/20"
          >
            <GraduationCap size={24} />
            Post New Scholarship
          </button>
          <button 
            onClick={async () => {
              if (window.confirm('This will add pre-defined Sarawak scholarships to the database. Continue?')) {
                const initialScholarships = [
                  {
                    title: 'Yayasan Sarawak Tun Taib Scholarship',
                    provider: 'Yayasan Sarawak',
                    category: 'Government',
                    amount: 'Full Tuition + Stipend',
                    eligibility: 'Sarawakian Students',
                    link: 'https://yayasansarawak.org.my/en/programe-loan-and-scholarship/'
                  },
                  {
                    title: 'Yayasan Sarawak Loan-Scholarship',
                    provider: 'Sarawak Foundation',
                    category: 'Government',
                    amount: 'Full Tuition Coverage',
                    eligibility: 'Sarawakian Undergraduates',
                    link: 'https://yayasansarawak.org.my/en/programe-loan-and-scholarship/'
                  },
                  {
                    title: 'Sarawak Energy Scholarship',
                    provider: 'Sarawak Energy Berhad',
                    category: 'Private',
                    amount: 'Full Coverage + Allowance',
                    eligibility: 'Sarawakian Tech/Engineering Students',
                    link: 'https://www.sarawakenergy.com/careers/scholarship'
                  },
                  {
                    title: 'Petronas Education Powering Knowledge',
                    provider: 'Petronas',
                    category: 'Private',
                    amount: 'Full Scholarship',
                    eligibility: 'SPM/STPM Leavers',
                    link: 'https://www.petronas.com/sustainability/powering-knowledge'
                  },
                  {
                    title: 'Shell Malaysia Scholarship',
                    provider: 'Shell Malaysia',
                    category: 'Private',
                    amount: 'RM30,000/year',
                    eligibility: 'Undergraduate Students',
                    link: 'https://www.shell.com.my/careers/students-and-graduates/scholarships.html'
                  },
                  {
                    title: 'PTPTN Education Loan',
                    provider: 'National Higher Education Fund',
                    category: 'Government',
                    amount: 'Up to RM25,000/year',
                    eligibility: 'Malaysian Students',
                    link: 'https://www.ptptn.gov.my/'
                  },
                  {
                    title: 'Yayasan Sarawak BP Bursary',
                    provider: 'Yayasan Sarawak',
                    category: 'Government',
                    amount: 'Targeted Financial Aid',
                    eligibility: 'B40 Sarawakian Students',
                    link: 'https://yayasansarawak.org.my/en/bursary-program/'
                  }
                ];
                
                for (const s of initialScholarships) {
                  await addDoc(collection(db, 'scholarships'), { ...s, createdAt: serverTimestamp() });
                }
                alert('Scholarships seeded successfully!');
              }
            }}
            className="flex items-center gap-2 px-8 py-5 bg-white text-on-surface rounded-3xl font-headline font-black text-lg inked-border hover:bg-slate-50 transition-all shadow-lg"
          >
            <Globe size={24} className="text-secondary" />
            Seed Sarawak Data
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-10 relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={24} />
        <input 
          type="text" 
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-16 pr-6 py-6 bg-white rounded-3xl inked-border font-bold text-xl outline-none focus:border-primary transition-all shadow-sm"
        />
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {activeTab === 'scholarships' ? (
              filteredScholarships.map((s, i) => (
                <motion.div 
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-[2.5rem] inked-border p-8 hover:-translate-y-2 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-3xl opacity-5" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl inked-border flex items-center justify-center text-3xl bg-secondary/10 border-secondary/20">
                      🎓
                    </div>
                      <div className="flex gap-2 relative z-30">
                        {deletingId === s.id ? (
                          <div className="flex items-center gap-2 bg-red-50 p-2 rounded-xl animate-in fade-in zoom-in duration-200">
                             <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">Sure?</span>
                             <button 
                               type="button"
                               onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 handleDeleteScholarship(s.id);
                               }}
                               className="px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-red-700 transition-colors"
                             >
                               Yes
                             </button>
                             <button 
                               type="button"
                               onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 setDeletingId(null);
                               }}
                               className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase hover:bg-slate-300 transition-colors"
                             >
                               No
                             </button>
                          </div>
                        ) : (
                          <>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Edit button clicked for scholarship:", s.id);
                                handleEditScholarship(s);
                              }}
                              className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer"
                              title="Edit Scholarship"
                            >
                              <Edit3 size={18} className="pointer-events-none" />
                            </button>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Delete button clicked for ID:", s.id);
                                setDeletingId(s.id);
                              }}
                              className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer relative z-50"
                              title="Delete Scholarship"
                            >
                              <Trash2 size={18} className="pointer-events-none" />
                            </button>
                          </>
                        )}
                      </div>
                  </div>
                  
                  <h3 className="text-2xl font-black font-headline text-on-surface mb-1 tracking-tight truncate">
                    {s.title}
                  </h3>
                  <p className="text-on-surface-variant font-bold text-sm mb-4 truncate">{s.provider}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                      {s.category}
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                      {s.amount.split(' ')[0]}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Amount</p>
                      <p className="text-sm font-bold text-secondary">{s.amount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Eligibility</p>
                      <p className="text-xs font-bold text-on-surface line-clamp-2">
                        {s.eligibility}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              filteredUsers.map((user, i) => (
                <motion.div 
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-[2.5rem] inked-border p-8 hover:-translate-y-2 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-3xl opacity-5" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl inked-border flex items-center justify-center text-3xl bg-secondary/10 border-secondary/20">
                      {activeTab === 'students' ? (user.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover rounded-xl" /> : '👤') : '🏢'}
                    </div>
          <div className="flex gap-2 relative z-30">
            {deletingId === user.id ? (
              <div className="flex items-center gap-2 bg-red-50 p-2 rounded-xl animate-in fade-in zoom-in duration-200">
                <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">Sure?</span>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(user.id);
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-red-700 transition-colors"
                >
                  Yes
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeletingId(null);
                  }}
                  className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase hover:bg-slate-300 transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Edit user clicked:", user.id);
                    handleEdit(user);
                  }}
                  className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer"
                  title="Edit Account"
                >
                  <Edit3 size={18} className="pointer-events-none" />
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Delete user request:", user.id);
                    setDeletingId(user.id);
                  }}
                  className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer"
                  title="Delete User"
                >
                  <Trash2 size={18} className="pointer-events-none" />
                </button>
              </>
            )}
          </div>
                  </div>
                  
                  <h3 className="text-2xl font-black font-headline text-on-surface mb-1 tracking-tight truncate">
                    {user.displayName || user.companyInfo?.name || 'Unnamed User'}
                  </h3>
                  <p className="text-on-surface-variant font-bold text-sm mb-4 truncate">{user.email}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                      ID: {user.id.slice(0, 8)}...
                    </span>
                    {user.onboarded ? (
                      <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                        Onboarded
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-500/20">
                        Pending Onboarding
                      </span>
                    )}
                  </div>

                  {activeTab === 'companies' && user.companyInfo && (
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Globe size={14} /> {user.companyInfo.website || 'No website'}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <MapPin size={14} /> {user.companyInfo.location || 'No location'}
                      </div>
                    </div>
                  )}

                  {activeTab === 'students' && (
                    <div className="space-y-1 mb-6">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Education Details</p>
                      <p className="text-xs font-bold text-on-surface truncate">
                        {user.education?.[0]?.institution || 'No education listed'}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!loading && activeTab !== 'scholarships' && filteredUsers.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <SearchX size={80} className="text-slate-200 mb-6" />
          <h3 className="text-2xl font-black font-headline text-on-surface mb-2">No Results Found</h3>
          <p className="text-on-surface-variant font-medium">No {activeTab} matched your search criteria.</p>
        </div>
      )}

      {!loading && activeTab === 'scholarships' && filteredScholarships.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <SearchX size={80} className="text-slate-200 mb-6" />
          <h3 className="text-2xl font-black font-headline text-on-surface mb-2">No Scholarships Found</h3>
          <p className="text-on-surface-variant font-medium">No scholarships matched your search criteria.</p>
        </div>
      )}

      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:p-12">
            <motion.div 
              key="user-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
            />
            
            <motion.div 
              key="user-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] inked-border p-8 lg:p-12 shadow-2xl overflow-y-auto max-h-[90vh] z-[210]"
            >
              <button 
                onClick={() => setEditingUser(null)}
                className="absolute top-8 right-8 p-3 rounded-full hover:bg-surface transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 rounded-2xl inked-border flex items-center justify-center text-4xl bg-primary/10">
                  {editingUser.role === 'student' ? '👤' : '🏢'}
                </div>
                <div>
                  <h2 className="text-3xl font-black font-headline text-on-surface">Edit Profile</h2>
                  <p className="font-bold text-on-surface-variant">{editingUser.email}</p>
                </div>
              </div>

              <div className="space-y-8">
                {editingUser.role === 'company' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Company Name</label>
                        <input 
                          type="text"
                          value={editingUser.companyInfo?.name || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, companyInfo: { ...editingUser.companyInfo, name: e.target.value } })}
                          className="w-full px-6 py-4 bg-surface rounded-2xl inked-border font-bold outline-none focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Industry</label>
                        <input 
                          type="text"
                          value={editingUser.companyInfo?.industry || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, companyInfo: { ...editingUser.companyInfo, industry: e.target.value } })}
                          className="w-full px-6 py-4 bg-surface rounded-2xl inked-border font-bold outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Website</label>
                      <input 
                        type="text"
                        value={editingUser.companyInfo?.website || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, companyInfo: { ...editingUser.companyInfo, website: e.target.value } })}
                        className="w-full px-6 py-4 bg-surface rounded-2xl inked-border font-bold outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Location</label>
                      <input 
                        type="text"
                        value={editingUser.companyInfo?.location || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, companyInfo: { ...editingUser.companyInfo, location: e.target.value } })}
                        className="w-full px-6 py-4 bg-surface rounded-2xl inked-border font-bold outline-none focus:border-primary"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Full Name</label>
                      <input 
                        type="text"
                        value={editingUser.displayName || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, displayName: e.target.value })}
                        className="w-full px-6 py-4 bg-surface rounded-2xl inked-border font-bold outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Short Bio</label>
                      <textarea 
                        rows={3}
                        value={editingUser.bio || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })}
                        className="w-full px-6 py-4 bg-surface rounded-2xl inked-border font-bold outline-none focus:border-primary resize-none"
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl inked-border border-slate-200">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">User Role</label>
                    <select 
                      value={editingUser.role || 'student'}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full px-6 py-4 bg-white rounded-2xl inked-border font-bold outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      <option value="student">Student</option>
                      <option value="company">Company</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Onboarding Status</label>
                    <div className="flex items-center gap-4 py-4 px-2">
                      <input 
                        type="checkbox"
                        id="onboarded"
                        checked={editingUser.onboarded || false}
                        onChange={(e) => setEditingUser({ ...editingUser, onboarded: e.target.checked })}
                        className="w-6 h-6 rounded-lg accent-primary cursor-pointer"
                      />
                      <label htmlFor="onboarded" className="font-bold text-on-surface cursor-pointer">Completed Onboarding</label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setEditingUser(null)}
                    className="flex-1 px-8 py-5 rounded-2xl bg-surface text-on-surface font-headline font-black inked-border hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdate}
                    disabled={isSaving}
                    className="flex-[2] px-8 py-5 rounded-2xl bg-primary text-on-primary font-headline font-black inked-border pressed-shadow flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {isSaving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
                    {isSaving ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Scholarship Edit/Create Modal */}
      <AnimatePresence>
        {editingScholarship && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:p-12">
            <motion.div 
              key="scholarship-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingScholarship(null)}
              className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
            />
            
            <motion.div 
              key="scholarship-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] inked-border p-8 lg:p-12 shadow-2xl overflow-y-auto max-h-[90vh] z-[210]"
            >
              <button 
                onClick={() => setEditingScholarship(null)}
                className="absolute top-8 right-8 p-3 rounded-full hover:bg-surface transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 rounded-2xl inked-border flex items-center justify-center text-4xl bg-primary/10">
                  🎓
                </div>
                <div>
                  <h2 className="text-3xl font-black font-headline text-on-surface">
                    {editingScholarship.id ? 'Edit Scholarship' : 'Post Scholarship'}
                  </h2>
                  <p className="font-bold text-on-surface-variant">Update scholarship details for students</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Scholarship Title</label>
                  <input 
                    type="text"
                    value={editingScholarship.title}
                    onChange={(e) => setEditingScholarship({ ...editingScholarship, title: e.target.value })}
                    placeholder="e.g. Yayasan Sarawak Scholarship"
                    className="w-full px-6 py-4 bg-surface rounded-2xl inked-border font-bold outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Provider</label>
                    <input 
                      type="text"
                      value={editingScholarship.provider}
                      onChange={(e) => setEditingScholarship({ ...editingScholarship, provider: e.target.value })}
                      placeholder="Organization name"
                      className="w-full px-6 py-4 bg-surface rounded-2xl inked-border font-bold outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Category</label>
                    <select 
                      value={editingScholarship.category}
                      onChange={(e) => setEditingScholarship({ ...editingScholarship, category: e.target.value })}
                      className="w-full px-6 py-4 bg-surface rounded-2xl inked-border font-bold outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                      <option value="University">University</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Amount</label>
                    <input 
                      type="text"
                      value={editingScholarship.amount}
                      onChange={(e) => setEditingScholarship({ ...editingScholarship, amount: e.target.value })}
                      placeholder="e.g. RM15,000 / Full"
                      className="w-full px-6 py-4 bg-surface rounded-2xl inked-border font-bold outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Eligibility</label>
                    <input 
                      type="text"
                      value={editingScholarship.eligibility}
                      onChange={(e) => setEditingScholarship({ ...editingScholarship, eligibility: e.target.value })}
                      placeholder="e.g. Sarawakian only"
                      className="w-full px-6 py-4 bg-surface rounded-2xl inked-border font-bold outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Application Link</label>
                  <input 
                    type="text"
                    value={editingScholarship.link}
                    onChange={(e) => setEditingScholarship({ ...editingScholarship, link: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-6 py-4 bg-surface rounded-2xl inked-border font-bold outline-none focus:border-primary"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setEditingScholarship(null)}
                    className="flex-1 px-8 py-5 rounded-2xl bg-surface text-on-surface font-headline font-black inked-border hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveScholarship}
                    disabled={isSaving}
                    className="flex-[2] px-8 py-5 rounded-2xl bg-primary text-on-primary font-headline font-black inked-border pressed-shadow flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {isSaving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
                    {isSaving ? 'Saving...' : 'Publish Scholarship'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminManagement;
