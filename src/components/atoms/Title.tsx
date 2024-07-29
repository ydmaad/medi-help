import React from "react";
import useTitle from "@/hooks/useTitle";

const Title: React.FC = () => {
  const { title } = useTitle();

  return (
    <h1 className="text-left font-bold text-[32px] text-gray-900 mb-10 mt-20">
      {title || "제목이 설정되지 않았습니다."}
    </h1>
  );
};

export default Title;
