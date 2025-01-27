import React from "react";
import { useRouter } from "next/navigation";
import { ImageProvider } from "@/contexts/ImageContext";
import CardImage from "../atoms/CardImage";
import MagazineCardTitle from "../atoms/MagazineCardTitle";
import MagazineSubtitle from "../atoms/MagazineSubtitle";
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
        <div className="rounded-lg cursor-pointer" onClick={handleClick}>
          <div className="mb-[56px]">
            <CardImage />
            <div className="mt-[16px] mb-[16px]">
              <MagazineCardTitle text={title} />
              <div className="mb-[16px]">
                <MagazineSubtitle text={subtitle} />
              </div>
            </div>
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
