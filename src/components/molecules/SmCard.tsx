import React from "react";
import { useRouter } from "next/navigation";
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
  id,
}: {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
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
    <ImageProvider value={{ src, alt, title, subtitle }}>
      <BarTextProvider value={barTextValue}>
        <div className="rounded-lg p-2 cursor-pointer" onClick={handleClick}>
          <div className="mb-[56px]">
            <SmImage />
            <CardTitle />
            <CardSubTitle text={subtitle} lineClamp="line-clamp-3" />
            <div className="text-brand-gray-600">
              <BarText />
            </div>
          </div>
        </div>
      </BarTextProvider>
    </ImageProvider>
  );
};

export default SmCard;
