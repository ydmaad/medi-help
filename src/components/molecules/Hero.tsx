import React from "react";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import Mouse from "@/components/atoms/mouse";
import { useToast } from "@/hooks/useToast";

const Hero = () => {
  const router = useRouter();

  const handleSearchChange = (searchTerm: string) => {
    if (searchTerm) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const { toast } = useToast();

  return (
    <>
      <div className="relative hidden desktop:flex flex-col justify-center items-center">
        <div className=" mt-[500px] mb-[132px] z-10  ">
          <Mouse />
        </div>
        <div className="text-[24px] font-bold text-brand-gray-1000 mb-[16px]  z-10 ">
          약에 대한 정보가 궁금하다면?
        </div>
        <div className="mb-[120px] z-10 ">
          <SearchBar onSearchChange={handleSearchChange} />
        </div>
      </div>

      <div className="relative flex mt-56 desktop:hidden flex-col justify-center items-center">
        <div className="mb-[60px] z-10 ">
          <SearchBar onSearchChange={handleSearchChange} />
        </div>
      </div>
      <button
        onClick={() => {
          toast.success("토스트가 제대로 나와요");
        }}
      >
        토스트 테스트
      </button>
    </>
  );
};

export default Hero;
