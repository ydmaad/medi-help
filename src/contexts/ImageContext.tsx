import React, { createContext, ReactNode } from "react";

type ImageContextType = {
  src: string | null;
  alt?: string;
  title: string;
  subtitle: string | null;
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
