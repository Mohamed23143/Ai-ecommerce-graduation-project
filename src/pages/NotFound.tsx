import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#f9f8f5] flex flex-col items-center justify-center p-5">
      <Helmet>
        <title>Page Not Found — NASSEG</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>
      <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h1 className="font-serif text-3xl text-dark italic mb-3">Page Not Found</h1>
      <p className="text-sm font-sans text-muted mb-10 max-w-xs text-center">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary px-10">Return Home</Link>
    </div>
  );
};

export default NotFound;
