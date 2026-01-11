// src/AlertProvider.ts
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import ShowAlertMessage from './ShowAlertMessage';

interface AlertContextType {
  alert: (msg: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [key, setKey] = useState(0); // Adding key to force remount

  const alert = (msg: string) => {
    setMessage(msg);
    setVisible(false); // First, hide the message if it's already visible
      setTimeout(() => {
        setVisible(true); // Then, show it after hiding
        setKey(prevKey => prevKey + 1); // Force component re-render by updating the key
    }, 100); // Delay for a smooth reset
  };

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      {/* Pass the unique key to force a re-render */}
      <ShowAlertMessage key={key} message={message} visible={visible} setVisible={setVisible} />
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};