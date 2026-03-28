import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Mail, Lock, Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row p-4 md:p-8 gap-8 bg-surface">
      {/* Left Side: Illustration */}
      <section className="flex-1 bg-primary-container rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-12 inked-border">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-tertiary-container rounded-full opacity-50 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary-container rounded-full opacity-40 blur-3xl" />
        
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
          <h1 className="font-headline font-black text-4xl md:text-6xl text-on-primary-container leading-tight tracking-tighter mb-6">
            Empowering Sarawak's Next Generation
          </h1>
          <p className="text-xl font-medium text-on-primary-container/80 leading-relaxed max-w-sm mx-auto">
            Your gateway to local education and career opportunities with Sarawak Smart Connect.
          </p>
        </div>
        
        <div className="absolute top-8 left-8">
          <span className="font-headline font-black text-2xl text-on-primary-container tracking-tighter">Smart Connect</span>
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
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-secondary-container inked-border w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl">
              👋
            </div>
            
            <div className="text-center mt-6 mb-10">
              <h2 className="font-headline font-extrabold text-3xl tracking-tight text-on-surface">Welcome Back!</h2>
              <p className="text-on-surface-variant font-medium mt-2">Ready to continue your adventure?</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold ml-4 text-on-surface">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-outline group-focus-within:text-primary transition-colors" size={20} />
                  </div>
                  <input 
                    type="email" 
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
                    type="password" 
                    placeholder="••••••••"
                    className="block w-full pl-12 pr-12 py-4 bg-surface border-4 border-outline rounded-2xl focus:ring-0 focus:border-primary font-medium transition-all outline-none"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:text-primary">
                    <Eye size={20} />
                  </div>
                </div>
                <div className="text-right">
                  <a href="#" className="text-sm font-bold text-primary hover:underline">Forgot Password?</a>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary text-on-primary font-headline font-extrabold text-lg py-5 rounded-full inked-border pressed-shadow flex items-center justify-center gap-3"
              >
                Sign Into Portal
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

            <div className="grid grid-cols-3 gap-4">
              {['google', 'facebook', 'apple'].map((provider) => (
                <button 
                  key={provider}
                  className="flex items-center justify-center p-4 bg-surface-container-low border-4 border-outline rounded-2xl hover:border-primary transition-all active:scale-95"
                >
                  <img 
                    src={`https://www.svgrepo.com/show/475656/${provider}-color.svg`} 
                    alt={provider}
                    className="w-6 h-6"
                  />
                </button>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="font-medium text-on-surface-variant">
                New here? <a href="#" className="text-primary font-black hover:underline">Join the club!</a>
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Login;
