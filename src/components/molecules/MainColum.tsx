import React from "react";
import { ImageProvider } from "@/contexts/ImageContext";
import MainImage from "../atoms/MainImage";
import CardTitle from "../atoms/CardTitle";
import { BarTextProvider } from "@/contexts/BarTextContext";
import BarText from "../atoms/BarText";

const MainColum = ({
  src,
  alt,
  title,
  leftText,
  rightText,
}: {
  src: string;
  alt: string;
  title: string;
  leftText: string;
  rightText: string;
}) => {
  const barTextValue = {
    leftText,
    rightText,
    setLeftText: (text: string) => {},
    setRightText: (text: string) => {},
  };

  return (
    <ImageProvider value={{ src, alt, title, subtitle: null }}>
      <BarTextProvider value={barTextValue}>
        <div className="mb-[36px] mr-[24px]">
          <MainImage />
          <CardTitle />
          <BarText />
        </div>
      </BarTextProvider>
    </ImageProvider>
  );
};

export default MainColum;
