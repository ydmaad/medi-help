import { PropsWithChildren } from "react";
import Header from "@/components/molecules/TopHeader";
import Footer from "@/components/molecules/Footer";

const RootLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="h-full min-h-screen mt-[67px]">
      <>
        <Header />
        <div className="mx-[140px]">{children}</div>
        <Footer />
      </>
    </div>
  );
};

export default RootLayout;
