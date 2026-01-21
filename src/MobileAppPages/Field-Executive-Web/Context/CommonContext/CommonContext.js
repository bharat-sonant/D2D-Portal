import React, { createContext, useState, useContext, useCallback } from 'react';
import ToastContainer from '../../Components/Common/ToastContainer/ToastContainer';

const CommonContext = createContext();

export const CommonProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

const showToast = useCallback((message, type = 'success') => {
  setToasts((prev) => {
    // Agar pehle se koi toast array mein hai, toh kuch mat karo (return prev)
    if (prev.length > 0) return prev;
    
    // Agar array khali hai, tabhi naya toast add karo
    return [{ id: Date.now(), message, type }];
  });
}, []);
  return (
    <CommonContext.Provider value={{ showToast }}>
      {children}
      {/* Ab directly component call ho raha hai bina kisi extra div ke */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </CommonContext.Provider>
  );
};

export const useCommon = () => useContext(CommonContext);