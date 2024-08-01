import { PropsWithChildren } from "react";
import Header from "@/components/molecules/Header";

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-full min-h-screen ">
      <Header />
      {children}
    </div>
  );
};

export default RootLayout;
