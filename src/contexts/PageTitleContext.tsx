import React, { createContext } from "react";

interface PageTitleContextType {
  title: string;
}

const PageTitleContext = createContext<PageTitleContextType | undefined>(
  undefined
);

export const PageTitleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = {
    title: "페이지 제목",
  };

  return (
    <PageTitleContext.Provider value={value}>
      {children}
    </PageTitleContext.Provider>
  );
};

export default PageTitleContext;
