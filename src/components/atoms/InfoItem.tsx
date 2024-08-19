import React from "react";

interface InfoItemProps {
  label: string;
  value: string | number;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className="mb-[4px] desktop:mb-[10px] text-[12px] desktop:text-[14px]">
    <span className="text-brand-gray-600 mr-[24px]">{label}</span>
    <span className="text-brand-gray-1000">{value}</span>
  </div>
);

export default InfoItem;
