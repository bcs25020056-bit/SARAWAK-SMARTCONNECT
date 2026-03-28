import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';

const Register = () => {
  const navigate = useNavigate();
  const { signUpWithEmail, signIn, user, profile, loading } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !loading && profile) {
      if (profile.onboarded) {
        navigate('/');
      } else {
        navigate('/onboarding');
      }
    }
  }, [user, loading, profile, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await signUpWithEmail(email, password);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-surface">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row p-4 md:p-8 gap-8 bg-surface">
      {/* Left Side: Illustration */}
      <section className="flex-1 bg-secondary-container rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-12 inked-border">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary-container rounded-full opacity-50 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-tertiary-container rounded-full opacity-40 blur-3xl" />
        
        <div className="relative z-10 text-center max-w-lg">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwGiZ7vypbqyLduOHQz_sNMzrGHe7wRJTqSScGTFkcZi_01YWyk87bTXPA2mOSrPQIOgkL3qEpauoEhdBfQdTYfICPxNhhU14ZCG8kAsvFnqo0Hyw5gDFiiVjsBkobELcFub1Y3sBFVJlHUcU8QB25YPFw1sPLQpGn9R-aA37ZjxuxOy7qjKKWM3-6ql0p9HQTmK4IS6Z4ZIGPTrfLmSUy4ypydGNsMt6YPBj5Lo2hR6aZx1HpofgthuXErY0y1RCUPR2VQQQm45sk" 
              alt="Rocket"
              className="w-64 h-64 mx-auto drop-shadow-2xl"
            />
          </motion.div>
          <h1 className="font-headline font-black text-4xl md:text-6xl text-on-secondary-container leading-tight tracking-tighter mb-6">
            Start Your Journey Today
          </h1>
          <p className="text-xl font-medium text-on-secondary-container/80 leading-relaxed max-w-sm mx-auto">
            Join thousands of Sarawakians building their future with Sarawak Smart Connect.
          </p>
        </div>
        
        <div className="absolute top-8 left-8">
          <span className="font-headline font-black text-2xl text-on-secondary-container tracking-tighter">Smart Connect</span>
        </div>
      </section>

      {/* Right Side: Form */}
      <section className="flex-1 flex items-center justify-center py-12 px-6">
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-surface-container-highest rounded-3xl p-8 md:p-12 inked-border relative shadow-xl">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary-container inked-border w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl">
              🚀
            </div>
            
            <div className="text-center mt-6 mb-10">
              <h2 className="font-headline font-extrabold text-3xl tracking-tight text-on-surface">Create Account</h2>
              <p className="text-on-surface-variant font-medium mt-2">Join the next generation of Sarawak</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-2xl inked-border text-sm font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold ml-4 text-on-surface">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-outline group-focus-within:text-primary transition-colors" size={20} />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@awesome.com"
                    className="block w-full pl-12 pr-4 py-4 bg-surface border-4 border-outline rounded-2xl focus:ring-0 focus:border-primary font-medium transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold ml-4 text-on-surface">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-outline group-focus-within:text-primary transition-colors" size={20} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-12 pr-12 py-4 bg-surface border-4 border-outline rounded-2xl focus:ring-0 focus:border-primary font-medium transition-all outline-none"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:text-primary"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-on-surface-variant ml-4">Must be at least 6 characters</p>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary font-headline font-extrabold text-lg py-5 rounded-full inked-border pressed-shadow flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Account...' : 'Join the Club!'}
                <ArrowRight size={24} />
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-4 border-outline/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface-container-highest font-bold text-outline uppercase tracking-widest">Or join with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center p-4 bg-surface-container-low border-4 border-outline rounded-2xl hover:border-primary transition-all active:scale-95 gap-3 font-bold"
              >
                <img 
                  src={`https://www.svgrepo.com/show/475656/google-color.svg`} 
                  alt="google"
                  className="w-6 h-6"
                />
                Continue with Google
              </button>
            </div>

            <div className="mt-10 text-center">
              <p className="font-medium text-on-surface-variant">
                Already a member? <Link to="/login" className="text-primary font-black hover:underline">Sign in here!</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Register;
