'use client';

import React, { createContext, useContext, useState } from 'react';

interface LayoutContextType {
  mobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
}

const LayoutContext = createContext<LayoutContextType>({
  mobileMenuOpen: false,
  openMobileMenu: () => {},
  closeMobileMenu: () => {},
  toggleMobileMenu: () => {},
});

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        mobileMenuOpen,
        openMobileMenu: () => setMobileMenuOpen(true),
        closeMobileMenu: () => setMobileMenuOpen(false),
        toggleMobileMenu: () => setMobileMenuOpen((prev) => !prev),
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
