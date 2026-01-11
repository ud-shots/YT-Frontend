import React, { createContext, useContext, useState, ReactNode } from 'react';
import Loader from './Loader'

// Define the context type
interface LoaderContextType {
    loading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
}

// Create the Loader Context
const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

// Loader Provider component to wrap around the app
export const LoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);

    // Functions to trigger loading state
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    return (
        <LoaderContext.Provider value={{ loading, startLoading, stopLoading }}>
            {children}
            {loading && <GlobalLoader />} {/* Show Loader automatically when loading */}
        </LoaderContext.Provider>
    );
};

// Hook to access the Loader context
export const useLoader = (): LoaderContextType => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within a LoaderProvider');
    }
    return context;
};

// Global Loader Component (Optional, for auto-rendering)
const GlobalLoader: React.FC = () => {
    return (
        <Loader />
    );
};