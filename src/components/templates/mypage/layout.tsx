import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const MyPageLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4">
      {children}
    </div>
  );
};

export default MyPageLayout;
