import React, { createContext, ReactNode } from "react";

type ImageContextType = {
  src: string;
  title: string;
  alt?: string;
};

interface ImageProviderProps {
  value: ImageContextType;
  children: ReactNode;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({ value, children }: ImageProviderProps) => {
  return (
    <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
  );
};

export default ImageContext;
