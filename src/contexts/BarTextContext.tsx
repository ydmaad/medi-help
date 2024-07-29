import React, { createContext, ReactNode } from "react";
type BarTextContextType = {
  leftText: string;
  rightText: string;
  setLeftText: (text: string) => void;
  setRightText: (text: string) => void;
};

interface BarTextProviderProps {
  value: BarTextContextType;
  children: ReactNode;
}

const BarTextContext = createContext<BarTextContextType | undefined>(undefined);

export const BarTextProvider = ({ value, children }: BarTextProviderProps) => {
  return (
    <BarTextContext.Provider value={value}>{children}</BarTextContext.Provider>
  );
};

export default BarTextContext;
