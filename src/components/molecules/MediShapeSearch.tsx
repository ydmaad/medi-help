import React, { useState } from "react";
import Image from "next/image";

const SelectionComponent = () => {
  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(
    null
  );
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(
    null
  );
  const [selectedFormIndex, setSelectedFormIndex] = useState<number | null>(
    null
  );
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(
    null
  );

  return (
    <div className="w-[792px] h-[386px] rounded-[4px] bg-white">
      <div className="w-[778px] h-[279px] mx-auto flex flex-col justify-between">
        <div className="flex flex-col mb-[24px] mt-[24px]">
          <h3 className="text-[12px] mb-[12px] text-brand-gray-400">
            모양 선택
          </h3>
          <div className="flex flex-wrap space-x-2">
            {Array.from({ length: 11 }, (_, index) => (
              <Image
                key={index}
                src={
                  selectedShapeIndex === index
                    ? `shapeon${index + 1}.svg`
                    : `shape${index + 1}.svg`
                }
                alt={`Shape ${index + 1}`}
                width={48}
                height={48}
                className="cursor-pointer rounded-md"
                onClick={() => {
                  setSelectedShapeIndex(index);
                  console.log(`Shape ${index + 1} selected`);
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col mb-[24px]">
          <h3 className="text-[12px] mb-[12px] text-brand-gray-400">
            색상 선택
          </h3>
          <div className="flex flex-wrap space-x-2">
            <Image
              src={`color14.svg`}
              alt={`color 14`}
              width={48}
              height={48}
              className="cursor-pointer rounded-md"
              onClick={() => {
                setSelectedColorIndex(13);
                console.log(`color 14 selected`);
              }}
            />
            {Array.from({ length: 13 }, (_, index) => (
              <Image
                key={index}
                src={
                  selectedColorIndex === index
                    ? `coloron${index + 1}.svg`
                    : `color${index + 1}.svg`
                }
                alt={`color ${index + 1}`}
                width={48}
                height={48}
                className="cursor-pointer rounded-md"
                onClick={() => {
                  setSelectedColorIndex(index);
                  console.log(`color ${index + 1} selected`);
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex">
          <div className="flex flex-col">
            <h3 className="text-[12px] mb-[12px] text-brand-gray-400">
              제형 선택
            </h3>
            <div className="flex flex-wrap space-x-2">
              {Array.from({ length: 3 }, (_, index) => (
                <Image
                  key={index}
                  src={
                    selectedFormIndex === index
                      ? `formon${index + 1}.svg`
                      : `form${index + 1}.svg`
                  }
                  alt={`form ${index + 1}`}
                  width={48}
                  height={48}
                  className="cursor-pointer rounded-md"
                  onClick={() => {
                    setSelectedFormIndex(index);
                    console.log(`form ${index + 1} selected`);
                  }}
                />
              ))}
            </div>
          </div>
          <div className="ml-[40px] flex flex-col">
            <h3 className="text-[12px] mb-[12px] text-brand-gray-400">
              분할선 선택
            </h3>
            <div className="flex flex-wrap space-x-2">
              {Array.from({ length: 4 }, (_, index) => (
                <Image
                  key={index}
                  src={
                    selectedLineIndex === index
                      ? `lineon${index + 1}.svg`
                      : `line${index + 1}.svg`
                  }
                  alt={`line ${index + 1}`}
                  width={48}
                  height={48}
                  className="cursor-pointer rounded-md"
                  onClick={() => {
                    setSelectedLineIndex(index);
                    console.log(`line ${index + 1} selected`);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-[27px] mb-[24px]">
          <button className="w-[82px] h-[32px] bg-brand-gray-200 text-brand-gray-600 text-[14px] rounded-[4px] flex items-center justify-center">
            <Image
              src="page.svg"
              alt="reset"
              width={18}
              height={18}
              className="mr-1"
            />
            초기화
          </button>
          <button className="ml-[16px] w-[82px] h-[32px] bg-brand-primary-500 text-white text-[14px] rounded-[4px] flex items-center justify-center">
            <Image
              src="wsearch.svg"
              alt="search"
              width={18}
              height={18}
              className="mr-1"
            />
            검색
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionComponent;
