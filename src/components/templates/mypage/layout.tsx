import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const MyPageLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row p-4 md:p-8 lg:p-16 space-y-4 md:space-y-0 md:space-x-4 h-full items-start max-w-screen-lg mx-auto">
      {children}
    </div>
  );
};

export default MyPageLayout;
