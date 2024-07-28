import React, { useContext } from "react";
import ImageContext from "@/contexts/ImageContext";

const CardTitle = ({}) => {
  const context = useContext(ImageContext);

  if (!context) {
    return null;
  }
  const { title } = context;

  return <h2 className="text-base font-bold text-left mt-4">{title}</h2>;
};

export default CardTitle;
