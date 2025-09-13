// AUTHENTICATION SYSTEM REMOVED
// This context has been removed as part of complete auth system rebuild
// Will be replaced with clean implementation

import React, { createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  throw new Error('Authentication system is being rebuilt. Please wait for the new implementation.');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider value={null}>
      {children}
    </AuthContext.Provider>
  );
};