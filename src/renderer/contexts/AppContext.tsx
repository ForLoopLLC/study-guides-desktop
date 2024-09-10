import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Environment } from '../../types';

interface AppContextType {
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  // You can add other shared values here
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [environment, setEnvironment] = useState<Environment>({env: 'development', url: ''});

  const value = {
    environment,
    setEnvironment,
    // Add other values you want to share here
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
