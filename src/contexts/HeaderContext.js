import React, { createContext, useContext, useRef } from 'react';

// สร้าง context
const HeaderContext = createContext();

// สร้าง custom hook สำหรับใช้ context
export const useHeader = () => useContext(HeaderContext);

// สร้าง provider component
export const HeaderProvider = ({ children }) => {
    const headerRef = useRef();

    const value = {
        headerRef,
        openDialog: () => headerRef.current && headerRef.current.handleClickOpen(),
        disconnect: () => headerRef.current && headerRef.current.Disconnect(),
    };

    return (
        <HeaderContext.Provider value={value}>
            {children}
        </HeaderContext.Provider>
    );
};
