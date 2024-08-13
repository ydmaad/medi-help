import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const BgLinear = () => {
  const { scrollY } = useScroll();

  const bgY = useTransform(scrollY, [0, 1000], [-67, -200]);
  const bgtopY = useTransform(scrollY, [0, 1000], [-67, -150]);
  const imgY = useTransform(scrollY, [0, 1000], [-67, -100]);
  const mascotScale = useTransform(scrollY, [0, 1000], [1, 0.2]);
  const mascotX = useTransform(scrollY, [0, 1000], [0, -100]);
  const spaceshipScale = useTransform(scrollY, [0, 1000], [1, 0.2]);
  const spaceshipX = useTransform(scrollY, [0, 1000], [0, 400]);

  return (
    <>
      <div className="relative hidden desktop:flex justify-center items-center overflow-hidden h-screen">
        <motion.img
          src="/mainbg.svg"
          alt="mainbg"
          className="w-full h-[850px] bg-brand-primary-500"
          style={{ y: bgY }}
        />
        <motion.img
          src="/mascot.svg"
          alt="mascot"
          className="absolute right-16 bottom-48 z-10"
          style={{ scale: mascotScale, x: mascotX, y: imgY }}
        />
        <motion.img
          src="/spaceship.svg"
          alt="spaceship"
          className="absolute left-32 bottom-48 z-10"
          style={{ scale: spaceshipScale, x: spaceshipX, y: imgY }}
        />

        <motion.img
          src="/bgtop.svg"
          alt="bgtop"
          className="absolute bottom-0 w-full"
          style={{ y: bgtopY }}
        />
      </div>
      <div className=" flex desktop:hidden justify-center items-center overflow-hidden">
        <div className="bg-brand-primary-500 w-full h-[180px] "></div>
        <img
          src="/mobile_mascot.svg"
          alt="mascot"
          className="absolute w-full h-[12vh] bottom-[640px] z-10"
        />
        <img
          src="/bgtop.svg"
          alt="bgtop"
          className="absolute bottom-[590px] w-full"
        />
      </div>
    </>
  );
};

export default BgLinear;
