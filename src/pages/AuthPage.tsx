import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/react';
import { IoArrowBackOutline } from 'react-icons/io5';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'signup'>(searchParams.get('mode') === 'signup' ? 'signup' : 'login');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f8f5] flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Branding */}
      <div className="hidden md:flex md:w-1/2 bg-dark relative overflow-hidden group">
        <div className="absolute inset-0 z-10 bg-black/40 group-hover:bg-black/30 transition-colors duration-700" />
        <img
          src="/brand-image.png"
          alt="NASSEG Branding"
          className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s] ease-out"
        />

        <div className="relative z-20 w-full h-full p-16 flex flex-col justify-between">
          <Link to="/" className="inline-block">
            <h1 className="font-sans text-2xl tracking-[0.4em] uppercase font-medium text-white">
              NASSEG
            </h1>
          </Link>

          <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="font-serif text-5xl lg:text-6xl text-white leading-tight italic mb-6">
              The Essence of <br /> Premium Craft
            </h2>
            <p className="text-white/70 font-sans tracking-widest-lg uppercase text-xs">
              Established 2026 · Limited Collections
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Auth */}
      <div className="flex-1 min-h-screen flex flex-col bg-[#f9f8f5]">
        <div className="md:hidden p-5 flex items-center justify-between border-b border-border-light">
          <Link to="/" className="text-dark">
            <IoArrowBackOutline className="w-6 h-6" />
          </Link>
          <h1 className="font-sans text-lg tracking-[0.3em] uppercase font-medium text-dark">
            NASSEG
          </h1>
          <div className="w-6" />
        </div>

        <div className={`flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-5 py-12 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
          <div className="mb-10">
            <h2 className="font-serif text-3xl text-dark italic mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Join Nasseg'}
            </h2>
            <p className="text-sm font-sans text-muted">
              {mode === 'login'
                ? 'Sign in to access your personal collection and orders.'
                : 'Experience the world of luxury tailoring and exclusive drops.'}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="relative flex bg-dark/5 p-1 rounded-sm mb-10">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white shadow-sm transition-transform duration-500 ease-out ${
                mode === 'signup' ? 'translate-x-full' : 'translate-x-0'
              }`}
            />
            <button
              onClick={() => setMode('login')}
              className={`relative z-10 flex-1 py-2.5 text-[11px] font-sans tracking-widest-xl uppercase transition-colors duration-300 ${
                mode === 'login' ? 'text-dark font-semibold' : 'text-muted hover:text-dark'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`relative z-10 flex-1 py-2.5 text-[11px] font-sans tracking-widest-xl uppercase transition-colors duration-300 ${
                mode === 'signup' ? 'text-dark font-semibold' : 'text-muted hover:text-dark'
              }`}
            >
              Register
            </button>
          </div>

          {mode === 'login' ? (
            <SignIn
              appearance={{
                variables: {
                  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
                  fontFamilyButtons: 'Inter, ui-sans-serif, system-ui, sans-serif',
                  fontSize: '0.875rem',
                  colorPrimary: '#1a1a1a',
                  colorText: '#1a1a1a',
                  colorTextSecondary: '#8c8c8c',
                  colorInputBackground: '#ffffff',
                  colorBackground: 'transparent',
                  borderRadius: '0',
                },
                elements: {
                  rootBox: 'w-full',
                  card: 'w-full max-w-none shadow-none p-0 bg-transparent border-none',
                  header: 'hidden',
                  main: 'w-full space-y-5',
                  formFieldLabel: 'block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5',
                  formFieldInput: 'w-full bg-white border border-border-light px-4 py-3 text-sm font-sans outline-none transition-all duration-300 focus:border-dark placeholder:text-muted/40',
                  formFieldInputShowPasswordButton: 'text-muted hover:text-dark',
                  formButtonPrimary: 'w-full py-4 text-[11px] font-sans tracking-widest-2xl uppercase bg-dark text-white hover:bg-neutral-800 transition-all duration-300 border-none rounded-none cursor-pointer',
                  footer: 'hidden',
                  identityPreview: 'hidden',
                  dividerRow: 'hidden',
                  socialButtonsBlockButton: 'w-full flex items-center justify-center gap-3 border border-border-light py-3.5 text-[11px] font-sans tracking-widest-xl uppercase text-dark hover:border-dark hover:bg-dark hover:text-white transition-all duration-300 bg-transparent rounded-none',
                  socialButtonsBlockButtonText: 'text-[11px] font-sans tracking-widest-xl uppercase',
                  socialButtons: 'w-full space-y-3',
                  alternativeMethodsBlockButton: 'text-[10px] font-sans tracking-widest uppercase text-gold hover:text-gold-hover bg-transparent border-none',
                  formField: 'w-full',
                },
              }}
              signUpUrl="/auth?mode=signup"
              afterSignInUrl="/"
            />
          ) : (
            <SignUp
              appearance={{
                variables: {
                  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
                  fontFamilyButtons: 'Inter, ui-sans-serif, system-ui, sans-serif',
                  fontSize: '0.875rem',
                  colorPrimary: '#1a1a1a',
                  colorText: '#1a1a1a',
                  colorTextSecondary: '#8c8c8c',
                  colorInputBackground: '#ffffff',
                  colorBackground: 'transparent',
                  borderRadius: '0',
                },
                elements: {
                  rootBox: 'w-full',
                  card: 'w-full max-w-none shadow-none p-0 bg-transparent border-none',
                  header: 'hidden',
                  main: 'w-full space-y-5',
                  formFieldLabel: 'block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5',
                  formFieldInput: 'w-full bg-white border border-border-light px-4 py-3 text-sm font-sans outline-none transition-all duration-300 focus:border-dark placeholder:text-muted/40',
                  formButtonPrimary: 'w-full py-4 text-[11px] font-sans tracking-widest-2xl uppercase bg-dark text-white hover:bg-neutral-800 transition-all duration-300 border-none rounded-none cursor-pointer',
                  footer: 'hidden',
                  dividerRow: 'hidden',
                  socialButtonsBlockButton: 'w-full flex items-center justify-center gap-3 border border-border-light py-3.5 text-[11px] font-sans tracking-widest-xl uppercase text-dark hover:border-dark hover:bg-dark hover:text-white transition-all duration-300 bg-transparent rounded-none',
                  socialButtonsBlockButtonText: 'text-[11px] font-sans tracking-widest-xl uppercase',
                  socialButtons: 'w-full space-y-3',
                  formField: 'w-full',
                },
              }}
              signInUrl="/auth"
              afterSignUpUrl="/"
            />
          )}

          <p className="mt-10 text-center text-[10px] font-sans text-muted tracking-wide leading-relaxed uppercase">
            By accessing Nasseg, you acknowledge our <br />
            <span className="text-dark border-b border-dark/20 hover:border-gold hover:text-gold transition-all cursor-pointer">Terms</span>
            {' '}&{' '}
            <span className="text-dark border-b border-dark/20 hover:border-gold hover:text-gold transition-all cursor-pointer">Privacy Guidelines</span>
          </p>
        </div>

        <div className="hidden md:block mt-auto p-10">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-sans tracking-widest-2xl uppercase text-muted hover:text-dark transition-all group">
            <IoArrowBackOutline className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Boutique
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
