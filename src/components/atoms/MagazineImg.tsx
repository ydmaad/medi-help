import Image from "next/image";
import { BarTextProvider } from "@/contexts/BarTextContext";
import BarText from "../atoms/BarText";

interface ImageButtonProps {
  src: string;
  alt: string;
  onClick: () => void;
  leftText: string;
  rightText: string;
  title: string;
}

const MagazineImg = ({
  src,
  alt,
  title,

  onClick,
  leftText,
  rightText,
}: ImageButtonProps) => {
  const barTextValue = {
    leftText,
    rightText,
    setLeftText: (text: string) => {},
    setRightText: (text: string) => {},
  };

  return (
    <BarTextProvider value={barTextValue}>
      <button
        onClick={onClick}
        className="relative w-full h-auto aspect-[486/241] rounded-[20px] overflow-hidden"
      >
        <Image src={src} alt={alt} layout="fill" className="object-cover" />

        <div className="absolute bottom-8 left-1/2 flex flex-col items-center transform -translate-x-1/2 z-10 text-brand-gray-50">
          <BarText />
          <h1 className="whitespace-nowrap mt-[4px] text-xl font-bold ">
            {title}
          </h1>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50" />
      </button>
    </BarTextProvider>
  );
};

export default MagazineImg;
