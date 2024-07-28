import React from "react";
import { ImageProvider } from "@/contexts/ImageContext";
import SmImage from "../atoms/SmImage";
import CardTitle from "../atoms/CardTitle";
import CardSubTitle from "../atoms/CardSubTitle";
import { BarTextProvider } from "@/contexts/BarTextContext";
import BarText from "../atoms/BarText";

const SmCard = ({
  src,
  alt,
  title,
  subtitle,
  leftText,
  rightText,
}: {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
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
    <ImageProvider value={{ src, alt, title, subtitle }}>
      <BarTextProvider value={barTextValue}>
        <div className="mb-[56px]">
          <SmImage />
          <CardTitle />
          <CardSubTitle />
          <BarText />
        </div>
      </BarTextProvider>
    </ImageProvider>
  );
};

export default SmCard;
