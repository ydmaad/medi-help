import React from "react";
import { useRouter } from "next/navigation"; // useRouter를 가져옵니다.
import { ImageProvider } from "@/contexts/ImageContext";
import SubImage from "../atoms/SubImage";
import CardTitle from "../atoms/CardTitle";
import { BarTextProvider } from "@/contexts/BarTextContext";
import BarText from "../atoms/BarText";

const SubColum = ({
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
        <div className="mb-[36px] cursor-pointer" onClick={handleClick}>
          <SubImage />
          <CardTitle />
          <div className=" text-brand-gray-600 ">
            <BarText />
          </div>
        </div>
      </BarTextProvider>
    </ImageProvider>
  );
};

export default SubColum;
