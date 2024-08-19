import { useState, useRef } from "react";
import TertiCarousel from "../molecules/TertiCarousel";
import { Magazine } from "@/app/(root)/page";

interface MobileCarouselProps {
  limitedMagazines: Magazine[];
}

const Slider = ({ limitedMagazines }: MobileCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startX.current === null) return;

    const currentX = e.touches[0].clientX;
    const diffX = startX.current - currentX;

    if (diffX > 50) {
      handleNext();
      startX.current = null;
    } else if (diffX < -50) {
      handlePrev();
      startX.current = null;
    }
  };

  const handleNext = () => {
    if (currentIndex < limitedMagazines.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div
        className="flex transition-transform duration-300 max-w-[335px] mx-auto"
        style={{ transform: `translateX(-${currentIndex * (100 / 1.5)}%)` }}
      >
        {limitedMagazines.map((magazine, index) => (
          <div key={index} className="flex-shrink-0 w-[247px] mr-[16px] px-2">
            <TertiCarousel
              src={magazine.imgs_url}
              alt={magazine.title}
              title={magazine.title}
              leftText={magazine.written_by}
              rightText={magazine.reporting_date}
              id={magazine.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
