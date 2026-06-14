import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, KeyRound, AlertCircle, ShieldCheck, CheckCircle2, Globe, Terminal, ShoppingBag } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (userEmail: string) => void;
  onClose: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Simulate database/API check
    setTimeout(() => {
      setLoading(false);
      
      // Retrieve registered users from local storage
      const registeredUsersJson = localStorage.getItem('xeno_registered_users');
      const registeredUsers = registeredUsersJson ? JSON.parse(registeredUsersJson) : [];

      if (activeTab === 'login') {
        const emailLower = email.toLowerCase();
        
        // 1. Default static credentials
        if (emailLower === 'admin@xeno.co' && password === 'password123') {
          setSuccessMsg('Authentication successful! Loading console...');
          setTimeout(() => onLoginSuccess(email), 600);
          return;
        }

        // 2. Check persistent registered users
        const match = registeredUsers.find(
          (u: any) => u.email.toLowerCase() === emailLower && u.password === password
        );

        if (match) {
          setSuccessMsg(`Welcome back, ${match.name}! Loading console...`);
          setTimeout(() => onLoginSuccess(match.email), 600);
        } else {
          setErrorMsg('Invalid credentials. Check the demo helper at the bottom or create a new account.');
        }
      } else {
        // Sign up logic
        if (!name) {
          setErrorMsg('Please enter your full name.');
          return;
        }
        
        const emailLower = email.toLowerCase();
        const exists = registeredUsers.some((u: any) => u.email.toLowerCase() === emailLower) || emailLower === 'admin@xeno.co';
        
        if (exists) {
          setErrorMsg('This email is already registered. Please sign in instead.');
          return;
        }

        // Store new credentials
        const newUser = { name, email, password };
        registeredUsers.push(newUser);
        localStorage.setItem('xeno_registered_users', JSON.stringify(registeredUsers));

        setSuccessMsg(`Account created successfully! Logging you in as ${name}...`);
        setTimeout(() => onLoginSuccess(email), 800);
      }
    }, 1000);
  };

  // Quick prefill of admin demo account
  const handlePrefillDemo = () => {
    setEmail('admin@xeno.co');
    setPassword('password123');
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Mock social authentication callback
  const handleSocialLogin = (platform: string) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setTimeout(() => {
      setLoading(false);
      const mockEmail = `demo.${platform.toLowerCase()}@xeno.co`;
      setSuccessMsg(`Logged in via ${platform} integration!`);
      setTimeout(() => onLoginSuccess(mockEmail), 600);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-color)]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      {/* Centered Auth Card */}
      <div className="glass-panel w-full max-w-md rounded-3xl border border-dark-700/80 p-8 space-y-6 shadow-2xl relative overflow-hidden my-8">
        
        {/* Decorative corner glows */}
        <div className="absolute top-[-20%] left-[-20%] w-[250px] h-[250px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[200px] h-[200px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Status Header */}
        <div className="flex justify-between items-center text-[10px] text-dark-500 font-mono border-b border-dark-800 pb-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-dark-400">SECURE PORTAL</span>
          </div>
          <div className="flex items-center space-x-1">
            <ShieldCheck size={11} className="text-primary" />
            <span>SANDBOX SESSION</span>
          </div>
        </div>

        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/20">
            X
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome to Xeno AI</h2>
          <p className="text-xs text-dark-500 max-w-xs">
            Sign in to manage shopper segments, trigger campaign webhooks, and track ROI reports.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-dark-850 p-1 rounded-xl border border-dark-750 text-xs">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${activeTab === 'login' ? 'bg-primary text-white shadow-sm' : 'text-dark-500 hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${activeTab === 'signup' ? 'bg-primary text-white shadow-sm' : 'text-dark-500 hover:text-white'}`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="flex items-start space-x-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        
        {successMsg && (
          <div className="flex items-start space-x-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
            <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          {activeTab === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-dark-500 font-semibold uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-500 pointer-events-none">
                  <User size={14} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-dark-800 border border-dark-700 text-white rounded-xl placeholder-dark-500 focus:outline-none focus:border-primary transition"
                  placeholder="Aditya Sharma"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-dark-500 font-semibold uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-500 pointer-events-none">
                <Mail size={14} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-dark-800 border border-dark-700 text-white rounded-xl placeholder-dark-500 focus:outline-none focus:border-primary transition"
                placeholder="admin@xeno.co"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-dark-500 font-semibold uppercase tracking-wider">Password</label>
              {activeTab === 'login' && (
                <a href="#forgot" onClick={(e) => { e.preventDefault(); setErrorMsg('Password recovery is disabled in this CRM local sandbox.'); }} className="text-[10px] text-primary hover:underline font-semibold">
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-500 pointer-events-none">
                <Lock size={14} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-dark-800 border border-dark-700 text-white rounded-xl placeholder-dark-500 focus:outline-none focus:border-primary transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-dark-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm transition flex items-center justify-center space-x-2 shadow-md shadow-primary/10"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{activeTab === 'login' ? 'Sign In to Dashboard' : 'Create Account'}</span>
            )}
          </button>
        </form>

        {/* Alternative Mock Social Logins */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center text-dark-500 text-[10px] font-mono">
            <div className="flex-1 h-px bg-dark-800" />
            <span className="px-2">OR SIMULATE CONNECT</span>
            <div className="flex-1 h-px bg-dark-800" />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="py-2 bg-dark-800 hover:bg-dark-750 text-white border border-dark-700 rounded-xl transition flex items-center justify-center gap-1 text-[10px] font-semibold"
              title="Sign in with Mock Google Account"
            >
              <Globe size={12} className="text-red-400" />
              <span>Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              className="py-2 bg-dark-800 hover:bg-dark-750 text-white border border-dark-700 rounded-xl transition flex items-center justify-center gap-1 text-[10px] font-semibold"
              title="Sign in with Mock GitHub Account"
            >
              <Terminal size={12} className="text-gray-300" />
              <span>GitHub</span>
            </button>
            <button
              onClick={() => handleSocialLogin('Shopify')}
              className="py-2 bg-dark-800 hover:bg-dark-750 text-white border border-dark-700 rounded-xl transition flex items-center justify-center gap-1 text-[10px] font-semibold"
              title="Connect via Mock Shopify Store"
            >
              <ShoppingBag size={12} className="text-emerald-400" />
              <span>Shopify</span>
            </button>
          </div>
        </div>

        {/* Prefill Credentials card */}
        {activeTab === 'login' && (
          <div 
            onClick={handlePrefillDemo}
            className="cursor-pointer border border-dashed border-dark-700 bg-dark-850 hover:bg-dark-800 rounded-xl p-3 flex items-center space-x-3 transition duration-150"
            title="Autofill sandbox credentials for easy assessment"
          >
            <div className="p-2 bg-primary/10 text-primary rounded-lg flex-shrink-0">
              <KeyRound size={16} />
            </div>
            <div className="text-left leading-relaxed">
              <span className="text-[10px] font-bold text-white block">Prefill Demo Credentials</span>
              <span className="text-[9px] text-dark-500 block">Email: admin@xeno.co | Password: password123</span>
            </div>
          </div>
        )}

        {/* Back to Landing */}
        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="text-[10px] text-dark-500 hover:text-white transition underline font-medium"
          >
            Back to Presentation Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
