import { PropsWithChildren } from "react";
import Header from "@/components/molecules/TopHeader";
import BgLinear from "@/components/atoms/BgLinear";

interface RootLayoutProps extends PropsWithChildren {
  isMainPage?: boolean;
}

const RootLayout = ({ children, isMainPage }: RootLayoutProps) => {
  return (
    <div className="h-full min-h-screen">
      {isMainPage ? (
        <>
          <div className="absolute inset-0 z-0 mt-[67px]">
            <BgLinear />
          </div>
          <div>{children}</div>
        </>
      ) : (
        <>
          <Header />
          <div className="mx-[140px]">{children}</div>
        </>
      )}
    </div>
  );
};

export default RootLayout;
