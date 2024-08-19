import React from "react";

interface LgImageProps {
  src: string;
  alt: string;
}

const LgImage = ({ src, alt }: LgImageProps) => {
  return (
    <div className="desktop:w-[790px] w-[335px] desktop:h-[430px] h-[183px] border border-brand-gray-300 rounded-[20px] overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

export default LgImage;
