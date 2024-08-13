import { PropsWithChildren } from "react";
import Header from "@/components/molecules/TopHeader";
import Footer from "@/components/molecules/Footer";

const RootLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow mx-[20px] desktop:mx-[140px]">{children}</div>
      <Footer />
    </div>
  );
};

export default RootLayout;
