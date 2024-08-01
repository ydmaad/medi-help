import React from "react";
import { BarTextProvider } from "@/contexts/BarTextContext";
import BarText from "../atoms/BarText";

interface BackgroundTitleProps {
  title: string;
  backgroundImage: string;
  leftText: string;
  rightText: string;
}

const BackgroundTitle = ({
  title,
  backgroundImage,
  leftText,
  rightText,
}: BackgroundTitleProps) => {
  const barTextValue = {
    leftText,
    rightText,
    setLeftText: (text: string) => {},
    setRightText: (text: string) => {},
  };

  return (
    <BarTextProvider value={barTextValue}>
      <div className="relative w-full h-[360px] overflow-hidden">
        <img
          src={backgroundImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover blur-sm "
        />
        <div className="absolute inset-0 bg-black opacity-50 " />
        <div className="relative z-10 flex flex-col items-center h-full text-white">
          <h1 className="text-4xl font-bold mt-[211px] mb-[24px]">{title}</h1>
          <BarText />
        </div>
      </div>
    </BarTextProvider>
  );
};

export default BackgroundTitle;
