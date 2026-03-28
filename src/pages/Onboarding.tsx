import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Sparkles, ArrowRight, Plus, X, CheckCircle2, Loader2, User, Briefcase, Building2, Globe, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { cn } from '../lib/utils';

const Onboarding = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useFirebase();
  const [step, setStep] = useState(0); // Step 0: Role Selection
  const [isSaving, setIsSaving] = useState(false);

  // Role
  const [role, setRole] = useState<'student' | 'company' | null>(null);

  // Step 1: Education (Student) / Company Info (Company)
  const [education, setEducation] = useState<any[]>([]);
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', date: '' });
  
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    industry: '',
    website: '',
    location: '',
    description: ''
  });

  // Step 2: Skills (Student) / First Job (Company - Optional)
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const addEducation = () => {
    if (newEdu.institution && newEdu.degree) {
      setEducation([...education, { ...newEdu, status: 'VERIFIED', statusColor: 'bg-white text-secondary inked-border' }]);
      setNewEdu({ institution: '', degree: '', date: '' });
    }
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      const updateData: any = {
        role,
        onboarded: true
      };

      if (role === 'student') {
        updateData.education = education;
        updateData.skills = skills;
      } else {
        updateData.companyInfo = companyInfo;
      }

      await updateProfile(updateData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep0 = () => (
    <motion.div
      key="step0"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => { setRole('student'); setStep(1); }}
          className={cn(
            "p-8 rounded-[2.5rem] inked-border inked-shadow text-left transition-all hover:-translate-y-1 group",
            role === 'student' ? "bg-primary text-on-primary" : "bg-white text-on-surface"
          )}
        >
          <div className={cn(
            "w-16 h-16 rounded-2xl inked-border mb-6 flex items-center justify-center transition-colors",
            role === 'student' ? "bg-primary-container text-primary" : "bg-surface-container-low text-primary"
          )}>
            <User size={32} />
          </div>
          <h3 className="text-2xl font-black font-headline mb-2">Student / Graduate</h3>
          <p className={cn(
            "font-medium leading-relaxed",
            role === 'student' ? "text-on-primary/80" : "text-on-surface-variant"
          )}>
            I'm looking for internships, jobs, and scholarships to boost my career.
          </p>
        </button>

        <button
          onClick={() => { setRole('company'); setStep(1); }}
          className={cn(
            "p-8 rounded-[2.5rem] inked-border inked-shadow text-left transition-all hover:-translate-y-1 group",
            role === 'company' ? "bg-secondary text-on-secondary" : "bg-white text-on-surface"
          )}
        >
          <div className={cn(
            "w-16 h-16 rounded-2xl inked-border mb-6 flex items-center justify-center transition-colors",
            role === 'company' ? "bg-secondary-container text-secondary" : "bg-surface-container-low text-secondary"
          )}>
            <Building2 size={32} />
          </div>
          <h3 className="text-2xl font-black font-headline mb-2">Company / Employer</h3>
          <p className={cn(
            "font-medium leading-relaxed",
            role === 'company' ? "text-on-secondary/80" : "text-on-surface-variant"
          )}>
            I want to post job openings and find the best talent in Sarawak.
          </p>
        </button>
      </div>
    </motion.div>
  );

  const renderStudentStep1 = () => (
    <motion.div
      key="studentStep1"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="bg-white rounded-[2.5rem] inked-border p-8 inked-shadow"
    >
      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">Institution</label>
            <input 
              type="text" 
              placeholder="e.g. UNIMAS"
              value={newEdu.institution}
              onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
              className="w-full bg-surface-container-low rounded-xl inked-border px-4 py-3 font-bold focus:border-primary focus:ring-0 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">Degree / Certificate</label>
            <input 
              type="text" 
              placeholder="e.g. Computer Science"
              value={newEdu.degree}
              onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
              className="w-full bg-surface-container-low rounded-xl inked-border px-4 py-3 font-bold focus:border-primary focus:ring-0 outline-none"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">Year / Date</label>
          <input 
            type="text" 
            placeholder="e.g. 2020 - 2024"
            value={newEdu.date}
            onChange={(e) => setNewEdu({ ...newEdu, date: e.target.value })}
            className="w-full bg-surface-container-low rounded-xl inked-border px-4 py-3 font-bold focus:border-primary focus:ring-0 outline-none"
          />
        </div>
        <button 
          type="button"
          onClick={addEducation}
          className="w-full py-4 bg-secondary-container text-on-secondary-container rounded-xl inked-border font-headline font-black flex items-center justify-center gap-2 hover:bg-secondary-container/80 transition-all"
        >
          <Plus size={20} /> Add Education
        </button>
      </div>

      <div className="space-y-4">
        {education.map((edu, i) => (
          <div key={i} className="flex items-center justify-between bg-surface-container-highest p-4 rounded-2xl inked-border">
            <div>
              <p className="font-black text-on-surface">{edu.institution}</p>
              <p className="text-sm font-bold text-on-surface-variant">{edu.degree} • {edu.date}</p>
            </div>
            <button onClick={() => removeEducation(i)} className="text-error hover:scale-110 transition-transform">
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-between">
        <button 
          onClick={() => setStep(0)}
          className="px-10 py-4 bg-white text-on-surface rounded-full font-headline font-black inked-border hover:bg-surface transition-all"
        >
          Back
        </button>
        <button 
          onClick={() => setStep(2)}
          disabled={education.length === 0}
          className="px-10 py-4 bg-primary text-on-primary rounded-full font-headline font-black inked-border inked-shadow pressed-shadow flex items-center gap-3 disabled:opacity-50"
        >
          Next Step <ArrowRight size={24} />
        </button>
      </div>
    </motion.div>
  );

  const renderStudentStep2 = () => (
    <motion.div
      key="studentStep2"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="bg-white rounded-[2.5rem] inked-border p-8 inked-shadow"
    >
      <div className="space-y-6 mb-8">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Type a skill (e.g. React, Design, Marketing)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            className="flex-1 bg-surface-container-low rounded-xl inked-border px-4 py-4 font-bold focus:border-primary focus:ring-0 outline-none"
          />
          <button 
            type="button"
            onClick={addSkill}
            className="w-14 h-14 bg-primary text-on-primary rounded-xl inked-border flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
          >
            <Plus size={28} />
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div 
              key={skill}
              className="px-6 py-3 bg-primary-container text-on-primary-container rounded-full font-black text-sm inked-border inked-shadow flex items-center gap-2"
            >
              {skill}
              <button onClick={() => removeSkill(skill)} className="hover:text-error">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <button 
          onClick={() => setStep(1)}
          className="px-10 py-4 bg-white text-on-surface rounded-full font-headline font-black inked-border hover:bg-surface transition-all"
        >
          Back
        </button>
        <button 
          onClick={handleComplete}
          disabled={skills.length === 0 || isSaving}
          className="px-10 py-4 bg-primary text-on-primary rounded-full font-headline font-black inked-border inked-shadow pressed-shadow flex items-center gap-3 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
          {isSaving ? 'Saving...' : 'Complete Setup'}
        </button>
      </div>
    </motion.div>
  );

  const renderCompanyStep1 = () => (
    <motion.div
      key="companyStep1"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="bg-white rounded-[2.5rem] inked-border p-8 inked-shadow"
    >
      <div className="space-y-6 mb-8">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">Company Name</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
            <input 
              type="text" 
              placeholder="e.g. Sarawak Tech Solutions"
              value={companyInfo.name}
              onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
              className="w-full bg-surface-container-low rounded-xl inked-border pl-12 pr-4 py-3 font-bold focus:border-secondary focus:ring-0 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">Industry</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input 
                type="text" 
                placeholder="e.g. Technology"
                value={companyInfo.industry}
                onChange={(e) => setCompanyInfo({ ...companyInfo, industry: e.target.value })}
                className="w-full bg-surface-container-low rounded-xl inked-border pl-12 pr-4 py-3 font-bold focus:border-secondary focus:ring-0 outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input 
                type="text" 
                placeholder="e.g. Kuching, Sarawak"
                value={companyInfo.location}
                onChange={(e) => setCompanyInfo({ ...companyInfo, location: e.target.value })}
                className="w-full bg-surface-container-low rounded-xl inked-border pl-12 pr-4 py-3 font-bold focus:border-secondary focus:ring-0 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">Website</label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
            <input 
              type="text" 
              placeholder="e.g. https://sarawaktech.com"
              value={companyInfo.website}
              onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
              className="w-full bg-surface-container-low rounded-xl inked-border pl-12 pr-4 py-3 font-bold focus:border-secondary focus:ring-0 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">Company Bio</label>
          <textarea 
            placeholder="Tell us about your company mission..."
            value={companyInfo.description}
            onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
            rows={4}
            className="w-full bg-surface-container-low rounded-xl inked-border px-4 py-3 font-bold focus:border-secondary focus:ring-0 outline-none resize-none"
          />
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <button 
          onClick={() => setStep(0)}
          className="px-10 py-4 bg-white text-on-surface rounded-full font-headline font-black inked-border hover:bg-surface transition-all"
        >
          Back
        </button>
        <button 
          onClick={handleComplete}
          disabled={!companyInfo.name || !companyInfo.industry || isSaving}
          className="px-10 py-4 bg-secondary text-on-secondary rounded-full font-headline font-black inked-border inked-shadow pressed-shadow flex items-center gap-3 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
          {isSaving ? 'Saving...' : 'Complete Setup'}
        </button>
      </div>
    </motion.div>
  );

  const getStepTitle = () => {
    if (step === 0) return "Choose your path";
    if (role === 'student') {
      return step === 1 ? "Tell us about your education" : "What are your superpowers?";
    } else {
      return "Tell us about your company";
    }
  };

  const getStepSubtitle = () => {
    if (step === 0) return "Are you here to grow your career or grow your team?";
    if (role === 'student') {
      return step === 1 ? "This helps us recommend the best scholarships and jobs for you." : "List your skills so mentors and employers can find you.";
    } else {
      return "Help talent find you by providing some basic details about your organization.";
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-container px-4 py-2 rounded-full inked-border text-primary font-black text-xs uppercase tracking-widest mb-4">
            Step {step + 1} of {role === 'student' ? 3 : 2}
          </div>
          <h1 className="text-4xl font-black font-headline tracking-tighter text-on-surface">
            {getStepTitle()}
          </h1>
          <p className="text-on-surface-variant font-medium mt-2">
            {getStepSubtitle()}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && renderStep0()}
          {step === 1 && role === 'student' && renderStudentStep1()}
          {step === 2 && role === 'student' && renderStudentStep2()}
          {step === 1 && role === 'company' && renderCompanyStep1()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
