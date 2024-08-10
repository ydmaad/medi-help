import { useState } from "react";
import MagazineImg from "../atoms/MagazineImg";
import PageButton from "../atoms/PageButton";

interface Image {
  src: string;
  alt: string;
  title: string;
  leftText: string;
  rightText: string;
}

interface CarouselProps {
  images: Image[];
}

const Carousel = ({ images }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const firstImage = images[currentIndex];
  const secondImage = images[(currentIndex + 1) % images.length];

  return (
    <div className="relative w-full">
      <div className="flex justify-center space-x-8">
        <MagazineImg
          src={firstImage.src}
          alt={firstImage.alt}
          onClick={() => {}}
          leftText={firstImage.leftText}
          rightText={firstImage.rightText}
          title={firstImage.title}
        />
        <MagazineImg
          src={secondImage.src}
          alt={secondImage.alt}
          onClick={() => {}}
          leftText={secondImage.leftText}
          rightText={secondImage.rightText}
          title={secondImage.title}
        />
      </div>
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white p-3 rounded-full">
        <PageButton
          onClick={prevSlide}
          icon="/Rcarousel.svg"
          disabled={images.length <= 1}
        />
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white p-3 rounded-full">
        <PageButton
          onClick={nextSlide}
          icon="/Lcarousel.svg"
          disabled={images.length <= 1}
        />
      </div>
    </div>
  );
};

export default Carousel;
