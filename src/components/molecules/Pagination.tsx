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
    return [...Array(totalPages)].map((_, index) => {
      const pageNumber = index + 1;
      return (
        <PageNumber
          key={pageNumber}
          number={pageNumber}
          onClick={onPageChange}
          selected={currentPage === pageNumber}
        />
      );
    });
  };

  return (
    <div className="pagination">
      <PageButton
        onClick={handlePrev}
        disabled={currentPage === 1}
        icon={prevIcon}
      >
        이전
      </PageButton>
      {renderPageNumbers()}
      <PageButton
        onClick={handleNext}
        disabled={currentPage === totalPages}
        icon={nextIcon}
      >
        다음
      </PageButton>
    </div>
  );
};

export default Pagination;
