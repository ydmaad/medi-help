"use client";

import { OverlayProvider } from "@toss/use-overlay";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <OverlayProvider>{children}</OverlayProvider>;
};

export default Providers;
