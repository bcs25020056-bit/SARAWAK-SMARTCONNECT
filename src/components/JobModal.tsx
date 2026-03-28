import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, Briefcase, MapPin, DollarSign, AlignLeft, Smile } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '../contexts/FirebaseContext';
import { cn } from '../lib/utils';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobToEdit?: any;
}

const JobModal: React.FC<JobModalProps> = ({ isOpen, onClose, jobToEdit }) => {
  const { user, profile } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: 'Full Time',
    salary: '',
    description: '',
    icon: '💼',
    tags: '',
  });

  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title || '',
        location: jobToEdit.location || '',
        type: jobToEdit.type || 'Full Time',
        salary: jobToEdit.salary || '',
        description: jobToEdit.description || '',
        icon: jobToEdit.icon || '💼',
        tags: jobToEdit.tags?.join(', ') || '',
      });
    } else {
      setFormData({
        title: '',
        location: '',
        type: 'Full Time',
        salary: '',
        description: '',
        icon: '💼',
        tags: '',
      });
    }
  }, [jobToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    try {
      const jobData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        company: profile.companyInfo?.name || 'Unknown Company',
        companyId: user.uid,
        postedAt: jobToEdit ? jobToEdit.postedAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (jobToEdit) {
        await updateDoc(doc(db, 'jobs', jobToEdit.id), jobData);
      } else {
        await addDoc(collection(db, 'jobs'), jobData);
      }
      onClose();
    } catch (error) {
      handleFirestoreError(error, jobToEdit ? OperationType.UPDATE : OperationType.CREATE, jobToEdit ? `jobs/${jobToEdit.id}` : 'jobs');
    } finally {
      setLoading(false);
    }
  };

  const icons = ['💼', '🚀', '💻', '🎨', '📊', '🛠️', '🏥', '🎓', '🌱', '⚡'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] inked-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b-4 border-slate-900/10 flex items-center justify-between bg-secondary/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary text-on-secondary rounded-2xl inked-border flex items-center justify-center text-2xl">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black font-headline text-primary">
                    {jobToEdit ? 'Edit Job Posting' : 'Post New Job'}
                  </h2>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    {profile?.companyInfo?.name || 'Company Portal'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Job Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl inked-border focus:bg-white transition-all font-bold"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Kuching, Sarawak"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl inked-border focus:bg-white transition-all font-bold"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Job Type</label>
                  <select
                    className="w-full px-4 py-4 bg-slate-50 rounded-2xl inked-border focus:bg-white transition-all font-bold appearance-none"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Salary Range</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      required
                      type="text"
                      placeholder="e.g. RM 4,000 - RM 6,000"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl inked-border focus:bg-white transition-all font-bold"
                      value={formData.salary}
                      onChange={e => setFormData({ ...formData, salary: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Remote, React, Urgent"
                    className="w-full px-4 py-4 bg-slate-50 rounded-2xl inked-border focus:bg-white transition-all font-bold"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Job Icon</label>
                <div className="flex flex-wrap gap-3">
                  {icons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={cn(
                        "w-12 h-12 text-2xl rounded-xl inked-border transition-all flex items-center justify-center",
                        formData.icon === icon ? "bg-secondary text-on-secondary scale-110" : "bg-white hover:bg-slate-50"
                      )}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Job Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-6 text-slate-400" size={20} />
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe the role, requirements, and benefits..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-3xl inked-border focus:bg-white transition-all font-bold resize-none"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 font-headline font-black text-slate-600 rounded-full inked-border hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-4 bg-secondary text-on-secondary font-headline font-black rounded-full inked-border pressed-shadow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      {jobToEdit ? 'Update Posting' : 'Publish Job'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JobModal;
