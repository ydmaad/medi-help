import React from "react";
import { useRouter } from "next/navigation"; // useRouter를 가져옵니다.
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
        <div
          className="mb-[36px] mr-[24px] cursor-pointer"
          onClick={handleClick}
        >
          <MainImage />
          <h2 className="text-[12px] desktop:text-[16px] font-bold text-left mt-[8px] desktop:mt-4 ">
            {title}
          </h2>
          <div className=" text-brand-gray-600 ">
            <BarText />
          </div>
        </div>
      </BarTextProvider>
    </ImageProvider>
  );
};

export default MainColum;
