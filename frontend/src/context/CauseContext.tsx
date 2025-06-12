import { createContext, useState, useContext, ReactNode } from 'react';
import { getCauseByCode, joinCause } from '../services/causeService';

interface CauseContextType {
  cause: any;
  loading: boolean;
  fetchCause: (code: string) => Promise<void>;
  joinCause: (code: string, userData: { firstName: string; lastName: string; email: string }) => Promise<void>;
}

const CauseContext = createContext<CauseContextType | undefined>(undefined);

export function CauseProvider({ children }: { children: ReactNode }) {
  const [cause, setCause] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchCause = async (code: string) => {
    setLoading(true);
    try {
      const data = await getCauseByCode(code);
      setCause(data);
    } catch (error) {
      console.error('Failed to fetch cause:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinCauseHandler = async (code: string, userData: { firstName: string; lastName: string; email: string }) => {
    setLoading(true);
    try {
      await joinCause(code, userData);
      await fetchCause(code); // Refresh cause data after joining
    } catch (error) {
      console.error('Failed to join cause:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CauseContext.Provider value={{ cause, loading, fetchCause, joinCause: joinCauseHandler }}>
      {children}
    </CauseContext.Provider>
  );
}

export function useCause() {
  const context = useContext(CauseContext);
  if (!context) throw new Error('useCause must be used within a CauseProvider');
  return context;
}
