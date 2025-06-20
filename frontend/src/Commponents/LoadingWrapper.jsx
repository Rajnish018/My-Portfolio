import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';
import LoadingSpinner from './LoadingSpinner';

const LoadingWrapper = ({ children }) => {
  const location = useLocation();
  const { loading, startLoading, stopLoading, loadingMessage } = useLoading();
  
  useEffect(() => {
    // Start loading when route changes
    startLoading("Loading page...");
    
    // Simulate minimum loading time for better UX (remove in production)
    const timer = setTimeout(() => {
      stopLoading();
    }, 800);
    
    return () => clearTimeout(timer);
  }, [location.pathname, startLoading, stopLoading]);

  return (
    <>
      {loading && <LoadingSpinner message={loadingMessage} />}
      {children}
    </>
  );
};

export default LoadingWrapper;