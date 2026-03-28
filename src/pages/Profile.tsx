import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Calendar, 
  Award, 
  Star, 
  Trophy, 
  Camera, 
  MessageSquare, 
  Plus, 
  BookOpen, 
  CheckCircle2, 
  GraduationCap,
  Sparkles,
  Loader2,
  X,
  Building2,
  Globe,
  Briefcase
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirebase } from '../contexts/FirebaseContext';

const Profile = () => {
  const { profile, updateProfile } = useFirebase();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    bio: '',
    skills: [] as string[],
    education: [] as any[],
    companyInfo: {
      name: '',
      industry: '',
      website: '',
      location: '',
      description: ''
    }
  });

  const [newSkill, setNewSkill] = useState('');
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', date: '' });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        email: profile.email || '',
        bio: profile.bio || '',
        skills: profile.skills || [],
        education: profile.education || [],
        companyInfo: profile.companyInfo || {
          name: '',
          industry: '',
          website: '',
          location: '',
          description: ''
        }
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const addEducation = () => {
    if (newEdu.institution && newEdu.degree) {
      setFormData({ 
        ...formData, 
        education: [...formData.education, { ...newEdu, status: 'VERIFIED', statusColor: 'bg-white text-secondary inked-border' }] 
      });
      setNewEdu({ institution: '', degree: '', date: '' });
    }
  };

  const removeEducation = (index: number) => {
    setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });
  };

  if (!profile) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-8 pb-12 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col gap-10">
      {/* Hero Section */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative bg-surface-container-low rounded-[3rem] inked-border p-10 flex flex-col md:flex-row items-center gap-10 inked-shadow-lg overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="relative">
          <div className="w-48 h-48 rounded-full inked-border-heavy overflow-hidden bg-white">
            <img 
              src={profile.displayName === 'Alex Rivers' ? "https://lh3.googleusercontent.com/aida-public/AB6AXuClwilfi_UrxfCZMklMHvED9Qze-ysjMm5tMS4s1bH6yJqvA5dvLkIzm4E0Jnhb5ESnVZ1MIs0Mw9FZdXMbHdvsa_wbAXplcpqOv8oLIt6osM0aXdCu8O-UCMusPxK32_W_12S9E95WkLExKFeAwyXyYuisLGfnwkrbEUfijQt_OHzoiKkhzww-ES6-41z0HqSMkxMVHQM35FXefciOeb1qaEXkVxjQpUfcF2e-mz--BIlD72B_D5PZ_XeoXIfiQSRfuNyGfxLUal3u" : `https://ui-avatars.com/api/?name=${profile.displayName}&background=random&size=200`} 
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-secondary-container rounded-full inked-border flex items-center justify-center inked-shadow">
            <Star className="text-on-secondary-container" size={24} fill="currentColor" />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="font-headline font-black text-5xl text-on-surface">{profile.role === 'company' ? formData.companyInfo.name : profile.displayName}</h1>
            <div className="inline-flex items-center gap-2 bg-tertiary-container px-4 py-1.5 rounded-full inked-border text-on-tertiary-container font-black text-sm uppercase tracking-wider">
              <Sparkles size={16} />
              {profile.role === 'company' ? 'Verified Employer' : `Level ${profile.level || 1} Explorer`}
            </div>
          </div>
          <p className="text-xl font-medium text-on-surface-variant max-w-2xl">
            {profile.role === 'company' ? formData.companyInfo.description : (profile.bio || "A curious traveler documenting the hidden gems of Sarawak. Passionate about digital storytelling and community heritage. 🌏✨")}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full inked-border font-bold text-sm">
              <MapPin size={18} className="text-primary" />
              {profile.role === 'company' ? formData.companyInfo.location : 'Kuching, MY'}
            </div>
            {profile.role === 'company' && formData.companyInfo.website && (
              <a href={formData.companyInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white px-4 py-2 rounded-full inked-border font-bold text-sm hover:bg-surface transition-colors">
                <Globe size={18} className="text-primary" />
                Website
              </a>
            )}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full inked-border font-bold text-sm">
              <Calendar size={18} className="text-primary" />
              Joined {profile.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024'}
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Personal Info & Education / Company Info */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          {profile.role === 'company' ? (
            <section className="bg-white rounded-[2.5rem] inked-border p-10 inked-shadow">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-secondary-container rounded-full inked-border flex items-center justify-center">
                  <Building2 className="text-secondary" size={24} />
                </div>
                <h2 className="font-headline font-black text-3xl">Company Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col gap-2">
                  <label className="font-headline font-black text-xs uppercase tracking-widest text-on-surface-variant">Company Name</label>
                  <input 
                    type="text" 
                    value={formData.companyInfo.name}
                    onChange={(e) => setFormData({ ...formData, companyInfo: { ...formData.companyInfo, name: e.target.value } })}
                    className="w-full bg-surface-container-low rounded-xl inked-border px-6 py-4 font-bold focus:border-secondary transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-headline font-black text-xs uppercase tracking-widest text-on-surface-variant">Industry</label>
                  <input 
                    type="text" 
                    value={formData.companyInfo.industry}
                    onChange={(e) => setFormData({ ...formData, companyInfo: { ...formData.companyInfo, industry: e.target.value } })}
                    className="w-full bg-surface-container-low rounded-xl inked-border px-6 py-4 font-bold focus:border-secondary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col gap-2">
                  <label className="font-headline font-black text-xs uppercase tracking-widest text-on-surface-variant">Location</label>
                  <input 
                    type="text" 
                    value={formData.companyInfo.location}
                    onChange={(e) => setFormData({ ...formData, companyInfo: { ...formData.companyInfo, location: e.target.value } })}
                    className="w-full bg-surface-container-low rounded-xl inked-border px-6 py-4 font-bold focus:border-secondary transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-headline font-black text-xs uppercase tracking-widest text-on-surface-variant">Website</label>
                  <input 
                    type="text" 
                    value={formData.companyInfo.website}
                    onChange={(e) => setFormData({ ...formData, companyInfo: { ...formData.companyInfo, website: e.target.value } })}
                    className="w-full bg-surface-container-low rounded-xl inked-border px-6 py-4 font-bold focus:border-secondary transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-10">
                <label className="font-headline font-black text-xs uppercase tracking-widest text-on-surface-variant">Company Bio</label>
                <textarea 
                  rows={4}
                  value={formData.companyInfo.description}
                  onChange={(e) => setFormData({ ...formData, companyInfo: { ...formData.companyInfo, description: e.target.value } })}
                  className="w-full bg-surface-container-low rounded-2xl inked-border px-6 py-4 font-bold focus:border-secondary transition-all resize-none"
                />
              </div>

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-secondary text-on-secondary font-headline font-black text-xl py-5 rounded-2xl inked-border inked-shadow bubble-press flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : null}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </section>
          ) : (
            <>
              {/* Personal Info Form */}
              <section className="bg-white rounded-[2.5rem] inked-border p-10 inked-shadow">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-primary-container rounded-full inked-border flex items-center justify-center">
                    <Award className="text-primary" size={24} />
                  </div>
                  <h2 className="font-headline font-black text-3xl">Personal Info</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="flex flex-col gap-2">
                    <label className="font-headline font-black text-xs uppercase tracking-widest text-on-surface-variant">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full bg-surface-container-low rounded-xl inked-border px-6 py-4 font-bold focus:border-primary focus:ring-0 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-headline font-black text-xs uppercase tracking-widest text-on-surface-variant">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled
                      className="w-full bg-surface-container-low rounded-xl inked-border px-6 py-4 font-bold opacity-70 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-10">
                  <label className="font-headline font-black text-xs uppercase tracking-widest text-on-surface-variant">Bio / About Me</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-surface-container-low rounded-2xl inked-border px-6 py-4 font-bold focus:border-primary focus:ring-0 transition-all resize-none"
                  />
                </div>

                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-primary text-on-primary font-headline font-black text-xl py-5 rounded-2xl inked-border inked-shadow bubble-press flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : null}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </section>

              {/* Education Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-tertiary-container rounded-full inked-border flex items-center justify-center">
                      <GraduationCap className="text-tertiary" size={24} />
                    </div>
                    <h2 className="font-headline font-black text-3xl">Education</h2>
                  </div>
                </div>

                {/* Add Education Form */}
                <div className="bg-surface-container-low rounded-3xl inked-border p-6 mb-8 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Institution"
                      value={newEdu.institution}
                      onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                      className="bg-white rounded-xl inked-border px-4 py-2 font-bold"
                    />
                    <input 
                      type="text" 
                      placeholder="Degree"
                      value={newEdu.degree}
                      onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                      className="bg-white rounded-xl inked-border px-4 py-2 font-bold"
                    />
                  </div>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      placeholder="Year (e.g. 2020 - 2024)"
                      value={newEdu.date}
                      onChange={(e) => setNewEdu({ ...newEdu, date: e.target.value })}
                      className="flex-1 bg-white rounded-xl inked-border px-4 py-2 font-bold"
                    />
                    <button 
                      type="button"
                      onClick={addEducation}
                      className="bg-primary text-on-primary px-6 py-2 rounded-xl inked-border font-black flex items-center gap-2"
                    >
                      <Plus size={20} /> Add
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  {formData.education.map((item: any, i: number) => {
                    const Icon = GraduationCap;
                    return (
                      <motion.div 
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-3xl inked-border p-6 inked-shadow flex flex-col md:flex-row items-start md:items-center gap-6"
                      >
                        <div className="w-16 h-16 rounded-2xl inked-border flex items-center justify-center shrink-0 bg-surface-container-low">
                          <Icon className="text-primary" size={32} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h4 className="font-headline font-black text-xl">{item.institution}</h4>
                            <span className={cn("px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest", item.statusColor || 'bg-tertiary-container text-on-tertiary-container')}>
                              {item.status}
                            </span>
                          </div>
                          <p className="font-bold text-on-surface mb-1">{item.degree}</p>
                          <p className="text-sm font-medium text-on-surface-variant">{item.date}</p>
                        </div>
                        <button onClick={() => removeEducation(i)} className="text-error hover:scale-110 transition-transform">
                          <X size={20} />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Right Column: Skills & Progress / Company Stats */}
        <div className="flex flex-col gap-10">
          {profile.role === 'company' ? (
            <section className="bg-surface-container-high rounded-[2.5rem] inked-border p-10 inked-shadow flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary-container rounded-full inked-border flex items-center justify-center">
                  <Briefcase className="text-on-secondary-container" size={24} />
                </div>
                <h2 className="font-headline font-black text-3xl">Recruitment</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-3xl inked-border inked-shadow">
                  <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">Active Postings</p>
                  <p className="text-4xl font-black font-headline text-secondary">0</p>
                </div>
                <div className="bg-white p-6 rounded-3xl inked-border inked-shadow">
                  <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">Total Applicants</p>
                  <p className="text-4xl font-black font-headline text-secondary">0</p>
                </div>
              </div>

              <div className="mt-4 p-6 bg-white/50 rounded-3xl border-2 border-dashed border-on-surface/20 text-center">
                <p className="text-sm font-bold text-on-surface-variant leading-relaxed">
                  Your company profile is visible to all students in Sarawak!
                </p>
              </div>
            </section>
          ) : (
            <>
              {/* Skills Section */}
              <section className="bg-surface-container-high rounded-[2.5rem] inked-border p-10 inked-shadow flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary-container rounded-full inked-border flex items-center justify-center">
                    <Sparkles className="text-on-secondary-container" size={24} />
                  </div>
                  <h2 className="font-headline font-black text-3xl">My Skills</h2>
                </div>

                {/* Add Skill Input */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                    className="flex-1 bg-white rounded-xl inked-border px-4 py-2 font-bold focus:border-primary outline-none"
                  />
                  <button 
                    type="button"
                    onClick={addSkill}
                    className="bg-primary text-on-primary w-10 h-10 rounded-xl inked-border flex items-center justify-center"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {formData.skills.map((skill) => (
                    <div 
                      key={skill}
                      className="px-6 py-3 rounded-full font-black text-sm inked-border inked-shadow bg-primary text-on-primary flex items-center gap-2"
                    >
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-error">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-6 bg-white/50 rounded-3xl border-2 border-dashed border-on-surface/20 text-center">
                  <p className="text-sm font-bold text-on-surface-variant leading-relaxed">
                    New skills unlock as you level up your Exploration rank!
                  </p>
                </div>
              </section>

              {/* Progress Section */}
              <section className="bg-white rounded-[2.5rem] inked-border p-10 inked-shadow flex flex-col gap-8">
                <h2 className="font-headline font-black text-3xl">Adventure Progress</h2>
                
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between font-black text-sm uppercase tracking-widest">
                      <span>Exploration Points</span>
                      <span className="text-primary">{profile.xp || 850}/1000 XP</span>
                    </div>
                    <div className="h-6 bg-surface-container rounded-full inked-border overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((profile.xp || 850) / 1000) * 100}%` }}
                        className="h-full bg-primary-container border-r-4 border-on-primary-container"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between font-black text-sm uppercase tracking-widest">
                      <span>Community Badges</span>
                      <span className="text-tertiary">{profile.badges || 14} Earned</span>
                    </div>
                    <div className="h-6 bg-surface-container rounded-full inked-border overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '60%' }}
                        className="h-full bg-tertiary-container border-r-4 border-on-tertiary-container"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-dashed border-outline/20">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-primary-container rounded-2xl inked-border flex items-center justify-center">
                      <Trophy size={24} className="text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-center">12 Trophies</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-tertiary-container rounded-2xl inked-border flex items-center justify-center">
                      <Camera size={24} className="text-tertiary" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-center">42 Photos</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-secondary-container rounded-2xl inked-border flex items-center justify-center">
                      <MessageSquare size={24} className="text-on-secondary-container" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-center">156 Posts</span>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* CTA Banner */}
          <section className="relative rounded-[2.5rem] inked-border overflow-hidden inked-shadow h-64 group">
            <img 
              src="https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=1000" 
              alt="Sarawak Jungle"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end gap-4">
              <h3 className="font-headline font-black text-2xl text-white leading-tight">
                {profile.role === 'company' ? 'Find Your Next Talent' : 'Join the Next Expedition'}
              </h3>
              <p className="text-white/80 text-sm font-bold">
                {profile.role === 'company' ? 'Post a job and connect with Sarawak\'s best students.' : 'New quests available in Bako National Park!'}
              </p>
              <button className="bg-white text-on-surface font-headline font-black px-6 py-3 rounded-xl inked-border bubble-press self-start">
                {profile.role === 'company' ? 'Post Job' : 'Learn More'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
