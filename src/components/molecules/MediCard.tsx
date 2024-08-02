import React from "react";
import { useRouter } from "next/navigation";
import { ImageProvider } from "@/contexts/ImageContext";
import SmImage from "../atoms/SmImage";
import CardTitle from "../atoms/CardTitle";
import CommunitySubTitle from "../atoms/CommunitySubTitle"; // CommunitySubTitle 임포트
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
          className="w-[231px] h-[257px] border border-brand-gray-50 rounded-lg p-2 mb-[56px] cursor-pointer"
          onClick={handleClick}
        >
          <SmImage width={183} height={100} />
          <CardTitle />
          <CommunitySubTitle text={subtitle} />
          <div className="text-brand-gray-600">
            <BarText />
          </div>
        </div>
      </BarTextProvider>
    </ImageProvider>
  );
};

export default MediCard;
