import React from "react";
import { useRouter } from "next/navigation";
import ContentsImage from "../atoms/ContentsImage";
import { ImageProvider } from "@/contexts/ImageContext";
import { BarTextProvider } from "@/contexts/BarTextContext";
import MagazineCardTitle from "../atoms/MagazineCardTitle";
import MagazineSubtitle from "../atoms/MagazineSubtitle";
import BarText from "../atoms/BarText";

const ColumnCard = ({
  imageSrc,
  src,
  alt,
  title,
  subtitle,
  leftText,
  rightText,
  id,
}: {
  imageSrc?: string | null;
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
    <div className="flex items-center w-[335px] h-[112px] border-b border-brand-gray-200">
      <div className="w-[72px] h-[72px] mt-[15px]">
        <ContentsImage src={imageSrc} />
      </div>
      <ImageProvider value={{ src, alt, title, subtitle }}>
        <BarTextProvider value={barTextValue}>
          <div
            className="flex-1 rounded-lg cursor-pointer"
            onClick={handleClick}
          >
            <MagazineCardTitle text={title} />
            <MagazineSubtitle text={subtitle} />
            <div className="text-brand-gray-600">
              <BarText />
            </div>
          </div>
        </BarTextProvider>
      </ImageProvider>
    </div>
  );
};

export default ColumnCard;
