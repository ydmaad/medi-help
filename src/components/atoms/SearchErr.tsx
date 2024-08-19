import React from "react";

const SearchErr = () => {
  return (
    <>
      <div className="flex flex-col desktop:hidden items-center justify-center mt-[128px]">
        <img
          src="/searchFail.svg"
          alt="Error"
          className="w-[70px] h-[104] mr-[16px] mb-[18px]"
        />
        <div className=" text-brand-gray-600 text-[28px] whitespace-nowrap mb-[290px]">
          검색 결과를 찾을 수 없어요.
        </div>
      </div>

      <div className="hidden desktop:flex items-center justify-center">
        <img
          src="/searchFail.svg"
          alt="Error"
          className="w-16 h-16 mr-[16px] mb-[290px]"
        />
        <div className=" text-brand-gray-600 text-[28px] whitespace-nowrap mb-[290px]">
          해당 검색에 대한 결과를 찾을 수 없어요.
        </div>
      </div>
    </>
  );
};

export default SearchErr;
