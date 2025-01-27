import React from "react";

interface InfoItemProps {
  label: string;
  value: string | number;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className="flex mb-[4px] desktop:mb-[10px] text-[12px] desktop:text-[14px]">
    <div className="w-[55px] text-brand-gray-600 mr-[24px]">{label}</div>
    <div className="text-brand-gray-1000">{value}</div>
  </div>
);

export default InfoItem;
