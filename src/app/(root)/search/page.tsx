"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import Pagination from "@/components/molecules/Pagination";
import MediCard from "@/components/molecules/MediCard";
import SearchErr from "@/components/atoms/SearchErr";

type Item = {
  itemName: string;
  entpName: string;
  effect: string;
  itemImage: string | null;
  id: string;
};

const SkeletonCard = () => (
  <div className="border border-brand-gray-300 rounded-lg overflow-hidden animate-pulse h-[200px]">
    <div className="bg-gray-200 h-full w-full" />
  </div>
);

const SearchPage = () => {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 768) {
        setItemsPerPage(20);
      } else {
        setItemsPerPage(8);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);

  const fetchData = async (page: number, term: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?pageNo=${page}&numOfRows=${itemsPerPage}&searchTerm=${term}`
      );
      if (!response.ok) {
        throw new Error("네트워크 응답에 문제가 있습니다.");
      }
      const data = await response.json();
      setAllItems(data.items || []);
      setTotalItems(data.totalItems || 0);
      setCurrentPage(page);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchTerm);
  }, [currentPage, searchTerm, itemsPerPage]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    setAllItems([]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-[32px] font-bold mb-[26px] mt-[80px]">
          궁금한 약을 검색해 보세요
        </h1>
        <div className="mb-[132px]">
          <SearchBar onSearchChange={handleSearchChange} />
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4 w-[1000px] h-auto">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="mt-[90px]">오류: {error}</div>;
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-[32px] font-bold mb-[40px] mt-[159px]">
          🔎 궁금한 약을 검색해 보세요
        </h1>
        <div className="mb-[132px]">
          <SearchBar onSearchChange={handleSearchChange} />
        </div>
      </div>
      <div className="text-[16px] mb-4 flex max-w-[1000px] mx-auto">
        <p className="text-brand-gray-1000 font-black text-xl">
          {searchTerm ? (
            <>
              <span className="text-brand-primary-500">
                &quot;{searchTerm}&quot;
              </span>
              에 대한 검색 결과
              <span className="text-brand-gray-600">({totalItems})</span>
            </>
          ) : (
            <>
              <span className="text-brand-gray-1000 font-black text-xl">
                전체
              </span>
              <span className="text-brand-gray-600">({totalItems})</span>
            </>
          )}
        </p>
      </div>

      <div className="flex justify-center items-center">
        <div className="grid grid-cols-2 desktop:grid-cols-4 mt-4 h-auto">
          {allItems.length > 0 ? (
            allItems.map((item) => (
              <MediCard
                key={item.id}
                src={item.itemImage}
                alt={item.itemName}
                title={item.itemName}
                subtitle={item.effect}
                leftText="제조사"
                rightText={item.entpName}
                id={item.id}
              />
            ))
          ) : (
            <div className="col-span-4 flex justify-center items-center">
              <SearchErr />
            </div>
          )}
        </div>
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default SearchPage;
