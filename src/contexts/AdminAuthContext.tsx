import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of your admin authentication context
interface AdminAuthContextType {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  // Add other admin-related state or functions here
}

// Create the context with a default (null) value
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Define the props for the AdminAuthContextProvider
interface AdminAuthContextProviderProps {
  children: ReactNode;
}

// Create a provider component
export const AdminAuthContextProvider: React.FC<AdminAuthContextProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Default admin status

  const contextValue: AdminAuthContextType = {
    isAdmin,
    setIsAdmin,
  };

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom hook to use the AdminAuthContext
export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthContextProvider');
  }
  return context;
};
