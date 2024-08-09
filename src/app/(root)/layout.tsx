import { PropsWithChildren } from "react";
import Header from "@/components/molecules/TopHeader";

const RootLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="h-full min-h-screen">
      <>
        <Header />
        <div className="mx-[140px]">{children}</div>
      </>
    </div>
  );
};

export default RootLayout;
