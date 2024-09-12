import { COLOR_OF_TIME } from "@/constants/constant";
import React from "react";

interface Props {
  time: string;
}

const TimeColor = ({ time }: Props) => {
  return (
    <div
      className={`inline-block w-[7px] h-[7px] desktop:w-[8px] desktop:h-[8px] rounded-full mr-1 ${time === "morning" ? "bg-[#bce1fd]" : time === "afternoon" ? "bg-[#52b1fa]" : "bg-[#103769]"}`}
    />
  );
};

export default TimeColor;
