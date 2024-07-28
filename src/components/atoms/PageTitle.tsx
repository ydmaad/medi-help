import React from "react";
import { usePageTitle } from "@/hooks/usePageTitle";

const PageTitle = () => {
  const { title } = usePageTitle();

  return (
    <h1 className="text-left font-bold text-[32px] text-gray-900 mb-10 mt-20">
      {title}
    </h1>
  );
};

export default PageTitle;
