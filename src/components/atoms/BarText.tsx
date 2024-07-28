import React from "react";
import { useBarText } from "../../hooks/useBarText";

const BarText = () => {
  const { leftText, rightText } = useBarText();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        color: "gray",
        fontSize: "14px",
      }}
    >
      <span>{leftText}</span>
      <span style={{ margin: "0 8px" }}>|</span>
      <span>{rightText}</span>
    </div>
  );
};

export default BarText;
