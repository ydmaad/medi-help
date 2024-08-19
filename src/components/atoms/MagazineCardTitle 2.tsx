import React from "react";

interface SemiTitleType {
  text: string;
}

const MagazineCardTitle = ({ text }: SemiTitleType) => {
  return (
    <div className="mt-[16px] mb-[4px] text-[16px] font-bold text-brand-gray-1000">
      {text}
    </div>
  );
};

export default MagazineCardTitle;
