import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [userData, setUserData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [mode, setMode] = useState(null); // 'demo' | 'upload'
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing' | 'upload' | 'loading' | 'dashboard'
  const [vaultBalance, setVaultBalance] = useState(() => {
    const saved = localStorage.getItem('opay_vault_balance');
    return saved ? parseFloat(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('opay_vault_balance', vaultBalance.toString());
  }, [vaultBalance]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'pid' : 'en'));
  };

  const addToVault = (amount) => {
    setVaultBalance(prev => prev + amount);
  };

  const resetApp = () => {
    setUserData(null);
    setAnalysisData(null);
    setMode(null);
    setCurrentPage('landing');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        userData,
        setUserData,
        analysisData,
        setAnalysisData,
        mode,
        setMode,
        currentPage,
        setCurrentPage,
        vaultBalance,
        setVaultBalance,
        addToVault,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export default AppContext;
