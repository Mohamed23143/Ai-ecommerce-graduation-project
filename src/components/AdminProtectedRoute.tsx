import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/react';
import { useAuthRole } from '../context/AuthContext';

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded: clerkLoaded, isSignedIn } = useUser();
  const { isAdmin, loadingRole } = useAuthRole();

  if (!clerkLoaded) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) return <Navigate to="/auth" replace />;

  if (loadingRole) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
