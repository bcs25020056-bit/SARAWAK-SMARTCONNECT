import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signInWithEmail, signUpWithEmail, user, profile, loading } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (user && !loading && profile) {
      if (profile.onboarded) {
        navigate('/');
      } else {
        navigate('/onboarding');
      }
    }
  }, [user, loading, profile, navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === '1234') {
      const adminEmail = 'admin@smartconnect.sarawak';
      const adminPass = 'AdminPass123!';
      
      try {
        setIsSubmitting(true);
        setError('');
        await signInWithEmail(adminEmail, adminPass);
      } catch (err: any) {
        // If user doesn't exist, try to create it
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || (err.message && err.message.includes('INVALID_LOGIN_CREDENTIALS'))) {
          try {
            await signUpWithEmail(adminEmail, adminPass);
          } catch (signUpErr: any) {
             setError('Failed to create admin account. Contact support.');
          }
        } else {
          setError('Admin gateway failed: ' + (err.message || 'Unknown error'));
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setError('Invalid Admin Passcode');
    }
  };

  const handleTitleClick = () => {
    setClicks(prev => prev + 1);
    if (clicks >= 4) {
      setIsAdminMode(true);
      setClicks(0);
    }
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
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
      <section className="hidden lg:flex flex-1 bg-primary-container rounded-[3rem] relative overflow-hidden flex-col p-12 inked-border">
        {/* Background Accents */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-tertiary-container rounded-full opacity-30 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-secondary-container rounded-full opacity-20 blur-[120px]" />
        
        {/* Logo at the top */}
        <div className="relative z-20 mb-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-on-primary-container rounded-xl flex items-center justify-center text-primary-container shadow-lg">
              <Rocket size={24} />
            </div>
            <span className="font-headline font-black text-3xl text-on-primary-container tracking-tighter">Smart Connect</span>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="mb-12 relative"
          >
            {/* Using a cleaner illustration setup */}
            <div className="w-80 h-80 relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse" />
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop" 
                alt="Sarawak Education"
                className="w-full h-full object-cover rounded-[3rem] inked-border shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -right-6 bg-secondary text-on-secondary p-6 rounded-2xl inked-border shadow-xl rotate-[-6deg]">
                <Rocket size={40} />
              </div>
            </div>
          </motion.div>
          
          <div className="max-w-md">
            <h1 className="font-headline font-black text-6xl text-on-primary-container leading-[0.9] tracking-tighter mb-8 bg-gradient-to-br from-on-primary-container to-on-primary-container/60 bg-clip-text text-transparent">
              Empowering <br /> Sarawak's Next.
            </h1>
            <p className="text-xl font-medium text-on-primary-container/70 leading-relaxed">
              Your gateway to local education and career opportunities with Sarawak Smart Connect.
            </p>
          </div>
        </div>

        {/* Footer info in illustration */}
        <div className="mt-auto pt-8 border-t border-on-primary-container/10">
          <p className="text-xs font-black uppercase tracking-widest text-on-primary-container/40">© 2024 Sarawak State Government</p>
        </div>
      </section>

      {/* Right Side: Form */}
      <section className="flex-1 flex items-center justify-center py-12 px-6">
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-surface-container-highest rounded-[2.5rem] p-8 md:p-12 inked-border relative shadow-2xl">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white inked-border w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl z-10">
              {isAdminMode ? '🛡️' : '👋'}
            </div>
            
            <div className="text-center mt-6 mb-10">
              <h2 
                className="font-headline font-extrabold text-3xl tracking-tight text-on-surface cursor-pointer select-none"
                onClick={handleTitleClick}
              >
                {isAdminMode ? 'Admin Gateway' : 'Welcome Back!'}
              </h2>
              <p className="text-on-surface-variant font-medium mt-2">
                {isAdminMode ? 'Secure access for Sarawak officials' : 'Ready to continue your adventure?'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-2xl inked-border text-sm font-bold">
                {error}
              </div>
            )}

            {isAdminMode ? (
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold ml-4 text-on-surface">Secret Passcode</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="text-outline group-focus-within:text-primary transition-colors" size={20} />
                    </div>
                    <input 
                      type="password" 
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      placeholder="Enter Admin PIN"
                      className="block w-full pl-12 pr-4 py-4 bg-surface border-4 border-outline rounded-2xl focus:ring-0 focus:border-primary font-medium transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsAdminMode(false)}
                    className="w-full bg-slate-200 text-slate-700 font-headline font-extrabold text-base py-4 rounded-2xl inked-border hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-on-primary font-headline font-extrabold text-base py-4 rounded-2xl inked-border pressed-shadow flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? '...' : 'Verify'}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            ) : (
              <>
                <form onSubmit={handleLogin} className="space-y-6">
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
                <div className="text-right">
                  <a href="#" className="text-sm font-bold text-primary hover:underline">Forgot Password?</a>
                </div>
              </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-on-primary font-headline font-extrabold text-lg py-5 rounded-full inked-border pressed-shadow flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign Into Portal'}
                  <ArrowRight size={24} />
                </button>
              </form>

              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-4 border-outline/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-surface-container-highest font-bold text-outline uppercase tracking-widest">Or login with</span>
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
            </>
          )}

            <div className="mt-10 text-center">
              <p className="font-medium text-on-surface-variant">
                New here? <Link to="/register" className="text-primary font-black hover:underline">Join the club!</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Login;
