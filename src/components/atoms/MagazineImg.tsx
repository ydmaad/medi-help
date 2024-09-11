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
        className="relative w-[315px] h-[200px] desktop:w-[486px] desktop:h-[241px] rounded-[20px] overflow-hidden"
      >
        <Image
          src={src}
          alt={alt}
          width={315}
          height={200}
          className="object-cover"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        <div className="absolute desktop:bottom-5 bottom-5 left-5 desktop:left-1/2 flex flex-col desktop:items-center desktop:transform desktop:-translate-x-1/2 z-10 text-brand-gray-50">
          <div className="flex font-light text-[14px]  desktop:text-sm mt-[2px]">
            <span className="line-clamp-1">{leftText}</span>
            <span className="mx-2">|</span>
            <span className="overflow-hidden text-ellipsis line-clamp-1">
              {rightText}
            </span>
          </div>
          <h1 className="whitespace-nowrap w-[250px] desktop:w-[341px] mt-[4px] text-[16px] desktop:text-xl font-bold overflow-hidden text-ellipsis">
            {title}
          </h1>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50" />
      </button>
    </BarTextProvider>
  );
};

export default MagazineImg;
