import React from "react";
import Slider from "react-slick";
import MagazineImg from "../atoms/MagazineImg";
import { useRouter } from "next/navigation";

interface Image {
  src: string;
  alt: string;
  title: string;
  leftText: string;
  rightText: string;
  id: string;
}

interface ColumnCarouselProps {
  images: Image[];
}

const ColumnCarousel = ({ images }: ColumnCarouselProps) => {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/magazine/${id}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {images.map((image) => (
        <MagazineImg
          src={image.src}
          alt={image.alt}
          leftText={image.leftText}
          rightText={image.rightText}
          title={image.title}
          onClick={() => handleClick(image.id)}
        />
      ))}
    </Slider>
  );
};

export default ColumnCarousel;
