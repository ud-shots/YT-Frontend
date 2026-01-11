// src/SuccessProvider.ts
import React, { createContext, useState, useContext, ReactNode } from 'react';
import ShowSuccessMessage from './ShowSuccessMessage';

interface SuccessContextType {
  success: (msg: string) => void;
}

const SuccessContext = createContext<SuccessContextType | undefined>(undefined);

export const SuccessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [key, setKey] = useState(0); // To force re-render on new success messages

  const success = (msg: string) => {
    setMessage(msg);
    setVisible(false); // First, hide the message if it's already visible
    setTimeout(() => {
      setVisible(true); // Then, show it after resetting the visibility
      setKey(prevKey => prevKey + 1); // Update key to force re-render
    }, 100); // Short delay to ensure the component resets properly
  };

  return (
    <SuccessContext.Provider value={{ success }}>
      {children}
      {/* Force re-render using a unique key */}
      <ShowSuccessMessage key={key} message={message} visible={visible} setVisible={setVisible} />
    </SuccessContext.Provider>
  );
};

export const useSuccess = (): SuccessContextType => {
  const context = useContext(SuccessContext);
  if (!context) {
    throw new Error('useSuccess must be used within a SuccessProvider');
  }
  return context;
};