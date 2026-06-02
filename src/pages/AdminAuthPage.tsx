import { useState, useEffect } from 'react';
import { IoArrowBackOutline, IoBagHandleOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

interface AdminAuthPageProps {
  onAuth: () => void;
}

export default function AdminAuthPage({ onAuth }: AdminAuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoaded, setIsLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (mode === 'signup' && !name)) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (mode === 'login') {
      const stored = localStorage.getItem('adminUser');
      if (stored) {
        const user = JSON.parse(stored);
        if (user.email === email && user.password === password) {
          localStorage.setItem('adminSession', JSON.stringify({ name: user.name, email, loggedInAt: new Date().toISOString() }));
          onAuth();
          return;
        }
      }
      const envEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;
      if (envEmail && envPassword && email === envEmail && password === envPassword) {
        localStorage.setItem('adminSession', JSON.stringify({ name: 'Admin', email, loggedInAt: new Date().toISOString() }));
        onAuth();
        return;
      }
      setError('Invalid email or password');
    } else {
      const existing = localStorage.getItem('adminUser');
      if (existing && JSON.parse(existing).email === email) {
        setError('An account with this email already exists');
        return;
      }
      localStorage.setItem('adminUser', JSON.stringify({ name, email, password }));
      localStorage.setItem('adminSession', JSON.stringify({ name, email, loggedInAt: new Date().toISOString() }));
      onAuth();
    }
  };

  const switchMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setError('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row overflow-hidden">
      {/* Left branding */}
      <div className="hidden md:flex md:w-1/2 bg-dark relative overflow-hidden group">
        <div className="absolute inset-0 z-10 bg-black/40 group-hover:bg-black/30 transition-colors duration-700" />
        <img src="/brand-image.png" alt="NASSEG Branding"
          className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s] ease-out" />
      </div>

      {/* Right auth form */}
      <div className="flex-1 min-h-screen flex flex-col bg-cream">
        <div className="md:hidden p-5 flex items-center justify-between border-b border-border-light">
          <a href="/" className="text-dark"><IoArrowBackOutline className="w-6 h-6" /></a>
          <h1 className="font-sans text-lg tracking-[0.3em] uppercase font-medium text-dark">NASSEG</h1>
          <div className="w-6" />
        </div>

        <div className={`flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-5 py-12 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
          <div className="mb-8">
            <h2 className="font-serif text-3xl text-dark italic mb-2">
              {mode === 'login' ? 'Admin Login' : 'Register Admin'}
            </h2>
            <p className="text-sm font-sans text-muted">
              {mode === 'login'
                ? 'Sign in to manage your store, products, and orders.'
                : 'Create an admin account to access the management panel.'}
            </p>
          </div>

          {/* Toggle tabs */}
          <div className="relative flex bg-dark/5 p-1 rounded-lg mb-8">
            <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white shadow-sm rounded-md transition-transform duration-500 ease-out ${mode === 'signup' ? 'translate-x-full' : 'translate-x-0'}`} />
            <button onClick={() => switchMode()}
              className={`relative z-10 flex-1 py-2.5 text-[11px] font-sans tracking-widest-xl uppercase transition-colors duration-300 ${mode === 'login' ? 'text-dark font-semibold' : 'text-muted hover:text-dark'}`}>
              Sign In
            </button>
            <button onClick={() => switchMode()}
              className={`relative z-10 flex-1 py-2.5 text-[11px] font-sans tracking-widest-xl uppercase transition-colors duration-300 ${mode === 'signup' ? 'text-dark font-semibold' : 'text-muted hover:text-dark'}`}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white border border-border-light rounded-lg px-4 py-3 text-sm font-sans outline-none focus:border-gold transition-all duration-300 placeholder:text-muted/40" />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@nasseg.com"
                className="w-full bg-white border border-border-light rounded-lg px-4 py-3 text-sm font-sans outline-none focus:border-gold transition-all duration-300 placeholder:text-muted/40" />
            </div>

            <div>
              <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-border-light rounded-lg px-4 py-3 pr-10 text-sm font-sans outline-none focus:border-gold transition-all duration-300 placeholder:text-muted/40" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors">
                  {showPassword ? <IoEyeOffOutline className="w-4 h-4" /> : <IoEyeOutline className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[11px] text-red-500 font-sans bg-red-50 rounded-lg px-4 py-2.5">{error}</p>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="text-[10px] font-sans text-gold hover:text-gold-hover transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            <button type="submit"
              className="w-full py-3.5 text-[11px] font-sans tracking-widest-xl uppercase bg-dark text-white rounded-lg hover:bg-neutral-800 transition-all duration-300 active:scale-[0.98]">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-muted font-sans">
            {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
            <button onClick={() => switchMode()} className="text-gold hover:text-gold-hover transition-colors font-medium">
              {mode === 'login' ? 'Register here' : 'Sign in'}
            </button>
          </p>

          <div className="mt-8 p-4 bg-dark/5 rounded-lg border border-border-light">
            <p className="text-[9px] font-sans tracking-widest-xl uppercase text-muted mb-1">Demo Credentials</p>
            <p className="text-[11px] font-sans text-muted">
              {import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com'} / {import.meta.env.VITE_ADMIN_PASSWORD ? 'set in .env' : 'not configured'}
            </p>
          </div>
        </div>

        <div className="hidden md:block mt-auto p-10">
          <a href="/" className="inline-flex items-center gap-2 text-[10px] font-sans tracking-widest-2xl uppercase text-muted hover:text-dark transition-all group">
            <IoBagHandleOutline className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Store
          </a>
        </div>
      </div>
    </div>
  );
}
