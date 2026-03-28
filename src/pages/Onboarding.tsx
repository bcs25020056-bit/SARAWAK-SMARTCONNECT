import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Sparkles, ArrowRight, Plus, X, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { cn } from '../lib/utils';

const Onboarding = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useFirebase();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Step 1: Education
  const [education, setEducation] = useState<any[]>([]);
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', date: '' });

  // Step 2: Skills
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
      await updateProfile({
        education,
        skills,
        onboarded: true
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-container px-4 py-2 rounded-full inked-border text-primary font-black text-xs uppercase tracking-widest mb-4">
            Step {step} of 2
          </div>
          <h1 className="text-4xl font-black font-headline tracking-tighter text-on-surface">
            {step === 1 ? "Tell us about your education" : "What are your superpowers?"}
          </h1>
          <p className="text-on-surface-variant font-medium mt-2">
            {step === 1 ? "This helps us recommend the best courses and jobs for you." : "List your skills so mentors and employers can find you."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
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

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setStep(2)}
                  disabled={education.length === 0}
                  className="px-10 py-4 bg-primary text-on-primary rounded-full font-headline font-black inked-border inked-shadow pressed-shadow flex items-center gap-3 disabled:opacity-50"
                >
                  Next Step <ArrowRight size={24} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="bg-white rounded-[2.5rem] inked-border p-8 inked-shadow"
            >
              <div className="space-y-6 mb-8">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Type a skill (e.g. React, Design, Marketing)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                    className="w-full bg-surface-container-low rounded-xl inked-border pl-4 pr-16 py-4 font-bold focus:border-primary focus:ring-0 outline-none"
                  />
                  <button 
                    onClick={addSkill}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-on-primary rounded-lg flex items-center justify-center"
                  >
                    <Plus size={24} />
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
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
