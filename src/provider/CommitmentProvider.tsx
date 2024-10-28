'use client';
import { useWebLogin } from 'aelf-web-login';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { generateCommitment } from 'utils/commitment';

interface CommitmentContextType {
  preimage: string | null;
  commitmentHex: string | null;
  regenerateCommitment: () => Promise<void>;
}

const CommitmentContext = createContext<CommitmentContextType | null>(null);

interface CommitmentProviderProps {
  proposalId: string;
  children: React.ReactNode;
}

export const CommitmentProvider = ({ proposalId, children }: CommitmentProviderProps) => {
  const { wallet } = useWebLogin();
  const storageKey = `${proposalId}-${wallet.address}`;
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const generateAndStore = async () => {
    const res = await generateCommitment();
    localStorage.setItem(storageKey, `${res.commitmentHex},${res.preimage}`);
    // Increment trigger to force re-render
    setUpdateTrigger((prev) => prev + 1);
    console.log(res.preimage, res.commitmentHex);
  };

  useEffect(() => {
    if (!wallet?.address) return;

    const existingPreimage = localStorage.getItem(storageKey);
    if (existingPreimage) return;

    generateAndStore();
  }, [proposalId, wallet?.address, storageKey]);

  const value = useMemo(() => {
    const stored = localStorage.getItem(storageKey);
    const [commitmentHex, preimage] = stored?.split(',') ?? [null, null];
    return {
      preimage,
      commitmentHex,
      regenerateCommitment: generateAndStore,
    };
  }, [storageKey, updateTrigger]);

  return <CommitmentContext.Provider value={value}>{children}</CommitmentContext.Provider>;
};

export const useCommitment = () => {
  const context = useContext(CommitmentContext);
  if (!context) {
    throw new Error('useCommitment must be used within a CommitmentProvider');
  }
  return context;
};
