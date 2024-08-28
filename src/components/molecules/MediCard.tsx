import React from "react";
import { useRouter } from "next/navigation";
import { ImageProvider } from "@/contexts/ImageContext";
import SmImage from "../atoms/SmImage";
import CardTitle from "../atoms/CardTitle";
import { BarTextProvider } from "@/contexts/BarTextContext";
import BarText from "../atoms/BarText";

const MediCard = ({
  src,
  alt,
  title,
  subtitle,
  leftText,
  rightText,
  id,
}: {
  src: string | null;
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
    router.push(`/search/${id}`);
  };

  return (
    <ImageProvider value={{ src, alt, title, subtitle }}>
      <BarTextProvider value={barTextValue}>
        <div
          className="w-[160px] h-[205px] desktop:w-[231px] desktop:h-[280px]  desktop:mr-[24px] mr-[16px]  bg-white border border-brand-gray-50 rounded-lg p-4 desktop:p-6 mb-[16px] desktop:mb-[32px] cursor-pointer"
          onClick={handleClick}
        >
          <SmImage className="w-[128px] h-[80px] desktop:w-[183px] desktop:h-[100px]" />
          <CardTitle />
          <div className="text-brand-gray-600">
            <BarText />
          </div>
        </div>
      </BarTextProvider>
    </ImageProvider>
  );
};

export default MediCard;
