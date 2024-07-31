"use client";

import { useEffect, useState } from "react";

type Item = {
  itemName: string;
  entpName: string;
  effect: string;
  itemImage: string | null;
};

const ITEMS_PER_PAGE: number = 20;
const TOTAL_ITEMS: number = 750;

const SearchPage = () => {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);

  const fetchData = async (pageNo: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?pageNo=${pageNo}&numOfRows=100`
      );
      if (!response.ok) {
        throw new Error("네트워크 응답에 문제가 있습니다.");
      }
      const data = await response.json();
      setAllItems((prevItems) => [...prevItems, ...data]);
      setDisplayedItems(data.slice(0, ITEMS_PER_PAGE));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const filteredItems = allItems.filter(
      (item) =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.effect.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedItems(filteredItems.slice(startIndex, endIndex));
  }, [searchTerm, currentPage, allItems]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div>
      <h1>약 목록</h1>
      <input
        type="text"
        placeholder="약 이름 또는 효능 검색..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <ul>
        {displayedItems.length > 0 ? (
          displayedItems.map((item, index) => (
            <li key={index} className="flex items-center mb-4">
              {item.itemImage && (
                <img
                  src={item.itemImage}
                  alt={item.itemName}
                  className="w-16 h-16 object-cover mr-4"
                />
              )}
              <div>
                <strong>{item.itemName}</strong> - {item.entpName}
              </div>
            </li>
          ))
        ) : (
          <li>검색 결과가 없습니다.</li>
        )}
      </ul>
      <div>
        <p>
          현재 페이지: {currentPage} / 총 페이지: {totalPages}
        </p>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          이전 페이지
        </button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          다음 페이지
        </button>
      </div>
    </div>
  );
};

export default SearchPage;