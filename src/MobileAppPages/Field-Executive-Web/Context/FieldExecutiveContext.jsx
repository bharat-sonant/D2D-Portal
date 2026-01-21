import React, { createContext, useContext, useState } from 'react';

const FieldExecutiveContext = createContext();

export const FieldExecutiveProvider = ({ children }) => {
    const [fieldExecutiveData, setFieldExecutiveData] = useState({
        userInfo: null,
        currentCity: localStorage.getItem('city') || 'DevTest',
        isFieldExecutive: true,
    });

    return (
        <FieldExecutiveContext.Provider value={{ fieldExecutiveData, setFieldExecutiveData }}>
            {children}
        </FieldExecutiveContext.Provider>
    );
};

export const useFieldExecutive = () => {
    const context = useContext(FieldExecutiveContext);
    if (!context) {
        throw new Error('useFieldExecutive must be used within FieldExecutiveProvider');
    }
    return context;
};
