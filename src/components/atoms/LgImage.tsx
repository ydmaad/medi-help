import React from "react";

interface LgImageProps {
  src: string;
  alt: string;
}

const LgImage = ({ src, alt }: LgImageProps) => {
  return (
    <div className="w-[790px] h-[430px] border border-brand-gray-300 rounded-[20px] overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

export default LgImage;
