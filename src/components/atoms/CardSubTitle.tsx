import React, { useContext } from "react";
import ImageContext from "@/contexts/ImageContext";

const CardSubTitle = () => {
  const context = useContext(ImageContext);

  if (!context) {
    return null;
  }
  const { subtitle } = context;

  return (
    <div className="w-[316px] overflow-hidden">
      <h2 className="text-base text-left overflow-hidden text-gray-800 text-ellipsis whitespace-nowrap">
        {subtitle}
      </h2>
    </div>
  );
};

export default CardSubTitle;
