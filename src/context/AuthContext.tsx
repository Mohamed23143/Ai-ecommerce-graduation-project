import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useUser, useAuth } from '@clerk/react';
import { fetchCurrentUser } from '../services/api';
import { setApiToken } from '../services/authStore';

const ROLE_KEY = 'nasseg_user_role';
const FETCH_TIMEOUT_MS = 10_000;

interface AuthContextValue {
  role: string | null;
  isAdmin: boolean;
  loadingRole: boolean;
}

const AuthContext = createContext<AuthContextValue>({ role: null, isAdmin: false, loadingRole: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded: clerkLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [role, setRole] = useState<string | null>(() => localStorage.getItem(ROLE_KEY));
  const [loadingRole, setLoadingRole] = useState(true);

  // Track the last user ID we fetched for — skip redundant fetches
  const lastUserIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!clerkLoaded) return;

    // ── Not signed in → clear immediately ──
    if (!isSignedIn) {
      setRole(null);
      setLoadingRole(false);
      localStorage.removeItem(ROLE_KEY);
      setApiToken(null);
      lastUserIdRef.current = undefined;
      return;
    }

    const clerkUserId = user?.id;

    // ── Guard: already fetched for this exact user ──
    if (clerkUserId && lastUserIdRef.current === clerkUserId && role !== null) {
      setLoadingRole(false);
      return;
    }

    lastUserIdRef.current = clerkUserId;

    // ── Build AbortController to cancel stale requests ──
    const abortController = new AbortController();
    const fetchTimeout = setTimeout(() => abortController.abort(), FETCH_TIMEOUT_MS);
    let resolvedRole: string | null = null;

    getTokenRef.current()
      .then(token => {
        if (abortController.signal.aborted || !token) return;
        clearTimeout(fetchTimeout);
        setApiToken(token);

        return fetchCurrentUser(token);
      })
      .then(data => {
        if (!data || abortController.signal.aborted) return;
        resolvedRole = (data.role || '').toLowerCase();
        setRole(resolvedRole);
        localStorage.setItem(ROLE_KEY, resolvedRole);
      })
      .catch(() => {
        if (abortController.signal.aborted) return;
        if (!localStorage.getItem(ROLE_KEY)) {
          setRole(null);
        }
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setLoadingRole(false);
        }
      });

    return () => {
      clearTimeout(fetchTimeout);
      abortController.abort();
    };
  }, [clerkLoaded, isSignedIn, user?.id]);

  const normalizedRole = role ? role.toLowerCase() : null;
  const isAdmin = normalizedRole === 'admin';

  return (
    <AuthContext.Provider value={{ role: normalizedRole, isAdmin, loadingRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthRole() {
  return useContext(AuthContext);
}
