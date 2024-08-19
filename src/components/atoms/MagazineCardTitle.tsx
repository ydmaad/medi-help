import React from "react";

interface SemiTitleType {
  text: string;
}

const MagazineCardTitle = ({ text }: SemiTitleType) => {
  return (
    <div className=" mb-[4px] text-[16px] font-bold text-brand-gray-1000 line-clamp-1 overflow-hidden text-ellipsis">
      {text}
    </div>
  );
};

export default MagazineCardTitle;
