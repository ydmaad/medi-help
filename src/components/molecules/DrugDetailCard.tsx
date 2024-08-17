import React from "react";

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
}: DrugDetailCardProps) => {
  return (
    <div className="flex justify-center items-center ">
      <div className="flex desktop:w-[996px] desktop:h-[380px] bg-white rounded-[16px] border border-brand-gray-50 mt-[40px] ">
        <div className="flex desktop:w-[418px] desktop:h-[230px] my-[75px] ml-[60px] mr-[90px]">
          <img
            src={imageUrl}
            alt={altText}
            className="w-full h-full object-cover rounded-[16px]"
          />
        </div>
        <div className="flex flex-col text-left justify-center p-[20px] ">
          <div className="mb-[10px]">
            <span className="text-brand-gray-600 mr-[24px]">분류 </span>
            <span className="text-brand-gray-1000 ">{category}</span>
          </div>
          <div className="mb-[10px]">
            <span className="text-brand-gray-600 mr-[24px]">구분 </span>
            <span className="text-brand-gray-1000 ">{classification}</span>
          </div>
          <div className="mb-[10px]">
            <span className="text-brand-gray-600 mr-[24px]">업체명 </span>
            <span className="text-brand-gray-1000 ">{manufacturer}</span>
          </div>
          <div className="mb-[10px]">
            <span className="text-brand-gray-600 mr-[24px]">보험코드 </span>
            <span className="text-brand-gray-1000 ">{insuranceCode}</span>
          </div>
          <div className="mb-[10px]">
            <span className="text-brand-gray-600 mr-[24px]">성상 </span>
            <span className="text-brand-gray-1000 ">{appearance}</span>
          </div>
          <div className="mb-[10px]">
            <span className="text-brand-gray-600 mr-[24px]">제형 </span>
            <span className="text-brand-gray-1000 ">{dosageForm}</span>
          </div>
          <div className="mb-[10px]">
            <span className="text-brand-gray-600 mr-[24px]">모양 </span>
            <span className="text-brand-gray-1000 ">{shape}</span>
          </div>
          <div className="mb-[10px]">
            <span className="text-brand-gray-600 mr-[24px]">색깔 </span>
            <span className="text-brand-gray-1000 ">{color}</span>
          </div>
          <div className="mb-[10px]">
            <span className="text-brand-gray-600 mr-[24px]">크기 </span>
            <span className="text-brand-gray-1000 ">{size}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugDetailCard;
