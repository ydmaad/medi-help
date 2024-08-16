import React from "react";
import { useRouter } from "next/navigation";
import { ImageProvider } from "@/contexts/ImageContext";
import TertiImage from "../atoms/TertiImage";
import CardTitle from "../atoms/CardTitle";
import { BarTextProvider } from "@/contexts/BarTextContext";
import BarText from "../atoms/BarText";

const TertiCarousel = ({
  src,
  alt,
  title,
  leftText,
  rightText,
  id,
}: {
  src: string;
  alt: string;
  title: string;
  leftText: string;
  rightText: string;
  id: string;
}) => {
  const router = useRouter();

  const barTextValue = {
    leftText,
    rightText,
    setLeftText: (text: string) => {},
    setRightText: (text: string) => {},
  };

  const handleClick = () => {
    router.push(`/magazine/${id}`);
  };

  return (
    <ImageProvider value={{ src, alt, title, subtitle: null }}>
      <BarTextProvider value={barTextValue}>
        <div className="w-[94%] " onClick={handleClick}>
          <TertiImage />
          <CardTitle />
          <div className="text-brand-gray-600 text-center mb-2">
            <BarText />
          </div>
        </div>
      </BarTextProvider>
    </ImageProvider>
  );
};

export default TertiCarousel;
