import React from "react";
import InfoItem from "../atoms/InfoItem";

interface DrugDetailCardProps {
  imageUrl: string;
  altText: string;
  category: string | "";
  classification: string | "";
  manufacturer: string | "";
  insuranceCode: string | "";
  appearance: string | "";
  dosageForm: string | "";
  shape: string | "";
  color: string | "";
  size: string | "";
  line: string | "";
  mark: string | "";
}

const DrugDetailCard = ({
  imageUrl,
  altText,
  category,
  classification,
  manufacturer,
  insuranceCode,
  appearance,
  dosageForm,
  shape,
  color,
  size,
  line,
  mark,
}: DrugDetailCardProps) => {
  return (
    <>
      {/*데스크탑*/}
      <div className="hidden desktop:flex  justify-center items-center ">
        <div className="flex desktop:w-[996px] desktop:h-[380px] bg-white rounded-[16px] border border-brand-gray-50 desktop:mt-[40px] ">
          <div className="flex desktop:w-[418px] desktop:h-[230px] my-[75px] ml-[60px] mr-[90px]">
            <img
              src={imageUrl}
              alt={altText}
              className="w-full h-full object-cover rounded-[16px]"
            />
          </div>
          <div className="flex flex-col text-left justify-center p-[20px] ">
            <InfoItem label="분류" value={category} />
            <InfoItem label="구분" value={classification} />
            <InfoItem label="업체명" value={manufacturer} />
            <InfoItem label="보험코드" value={insuranceCode} />
            <InfoItem label="성상" value={appearance} />
            <InfoItem label="제형" value={dosageForm} />
            <InfoItem label="모양" value={shape} />
            <InfoItem label="색깔" value={color} />
            <InfoItem label="크기" value={size} />
            <InfoItem label="식별표시" value={mark} />
            <InfoItem label="분할선" value={line} />
          </div>
        </div>
      </div>
      {/*모바일*/}
      <div className="flex flex-col desktop:hidden  justify-center items-center ">
        <div className="flex flex-col w-[335px] h-[459px] bg-white rounded-[16px] border border-brand-gray-50  mt-[24px]   ">
          <div className="flex w-[295px] h-[168px] mt-[20px] mx-[20px] mb-[24px]">
            <img
              src={imageUrl}
              alt={altText}
              className="w-full h-full object-cover rounded-[16px]"
            />
          </div>
          <div className="flex flex-col text-left justify-center mx-[20px] mb-[20px]">
            <InfoItem label="분류" value={category} />
            <InfoItem label="구분" value={classification} />
            <InfoItem label="업체명" value={manufacturer} />
            <InfoItem label="보험코드" value={insuranceCode} />
            <InfoItem label="성상" value={appearance} />
            <InfoItem label="제형" value={dosageForm} />
            <InfoItem label="모양" value={shape} />
            <InfoItem label="색깔" value={color} />
            <InfoItem label="크기" value={size} />
            <InfoItem label="식별표시" value={mark} />
            <InfoItem label="분할선" value={line} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DrugDetailCard;
