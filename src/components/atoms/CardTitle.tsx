import React, { useContext, useState, useEffect } from "react";
import ImageContext from "@/contexts/ImageContext";
import CardSubTitle from "./CardSubTitle";

const CardTitle = () => {
  const context = useContext(ImageContext);

  if (!context) {
    return null;
  }

  const { title, subtitle } = context;
  const [isLoading, setIsLoading] = useState(true);
  const [lineClamp, setLineClamp] = useState<string>("line-clamp-3");

  useEffect(() => {
    if (title.length > 12) {
      setLineClamp("line-clamp-2");
    } else {
      setLineClamp("line-clamp-3");
    }
    setIsLoading(false);
  }, [title]);

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col">
          <div className="h-[16px] bg-gray-200 animate-pulse mb-1"></div>
          <div className="h-[14px] bg-gray-200 animate-pulse"></div>
        </div>
      ) : (
        <>
          <h2 className="text-[12px] desktop:text-[16px] font-bold text-left mt-[8px] desktop:mt-4">
            {title}
          </h2>
          <CardSubTitle text={subtitle || ""} lineClamp={lineClamp} />
        </>
      )}
    </>
  );
};

export default CardTitle;
