import React from "react";
import PageButton from "../atoms/PageButton";
import PageNumber from "../atoms/PageNumber";

const prevIcon = "/chevron-left.svg";
const nextIcon = "/chevron-right.svg";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  console.log(currentPage);
  console.log(totalPages);

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // 보이는 페이지 숫자 개수
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // 페이지 범위 조정
    if (endPage - startPage < maxVisiblePages - 1) {
      if (startPage === 1) {
        endPage = Math.min(maxVisiblePages, totalPages);
      } else {
        startPage = Math.max(1, endPage - (maxVisiblePages - 1));
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PageNumber
          key={i}
          number={i}
          onClick={onPageChange}
          selected={currentPage === i}
        />
      );
    }

    return pageNumbers;
  };

  return (
    <div className="pagination flex justify-center items-center space-x-2">
      <PageButton
        onClick={handlePrev}
        disabled={currentPage === 1}
        icon={prevIcon}
      />
      {renderPageNumbers()}
      <PageButton
        onClick={handleNext}
        disabled={currentPage === totalPages}
        icon={nextIcon}
      />
    </div>
  );
};

export default Pagination;
