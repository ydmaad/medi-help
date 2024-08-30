import React from "react";

interface CategorySelectProps {
  categories: string[];
  selectCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelect = ({
  categories,
  selectCategory,
  onSelectCategory,
}: CategorySelectProps) => {
  return (
    <>
      <div className="flex space-x-2 ">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={` px-4 py-2 w-full desktop:w-[100px] text-[12px] desktop:text-[14px] rounded-full ${
              selectCategory === category
                ? "bg-brand-gray-600 text-white"
                : "bg-brand-gray-50 text-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </>
  );
};

export default CategorySelect;
