import React, { useContext, useState, useEffect } from "react";
import ImageContext from "@/contexts/ImageContext";
import CommunitySubTitle from "../atoms/CommunitySubTitle";

const CardTitle = () => {
  const context = useContext(ImageContext);

  if (!context) {
    return null;
  }
  const { title, subtitle } = context;

  const [lineClamp, setLineClamp] = useState<string>("line-clamp-3");

  useEffect(() => {
    if (title.length > 12) {
      setLineClamp("line-clamp-2");
    } else {
      setLineClamp("line-clamp-3");
    }
  }, [title]);

  return (
    <>
      <h2 className="text-[12px] desktop:text-[16px] font-bold text-left mt-[8px] desktop:mt-4">
        {title}
      </h2>
      <CommunitySubTitle text={subtitle || ""} lineClamp={lineClamp} />{" "}
    </>
  );
};

export default CardTitle;
