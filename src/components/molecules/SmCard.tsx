import React from "react";
import { ImageProvider } from "@/contexts/ImageContext";
import SmImage from "../atoms/SmImage";
import CardTitle from "../atoms/CardTitle";

const SmCard = ({
  src,
  alt,
  title,
}: {
  src: string;
  alt: string;
  title: string;
}) => {
  return (
    <ImageProvider value={{ src, alt, title }}>
      <div className="p-4 border border-gray-300 rounded-lg">
        <SmImage />
        <CardTitle />
      </div>
    </ImageProvider>
  );
};

export default SmCard;
