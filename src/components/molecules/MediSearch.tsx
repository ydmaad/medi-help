import { useState } from "react";

const shapes = [
  "원형",
  "반원형",
  "삼각형",
  "장방형",
  "타원형",
  "사각형",
  "마름모",
  "오각형",
  "육각형",
  "팔각형",
  "기타",
];
const colors = [
  "흰색",
  "빨강",
  "주황",
  "노랑",
  "연두",
  "초록",
  "청록",
  "파랑",
  "남색",
  "보라",
  "분홍",
  "회색",
  "검정",
  "투명",
];
const formulations = ["정제", "경질", "연질"];
const splitLines = ["없음", "+형", "-형", "기타"];

interface MediSearchProps {
  onSearch: (
    shape: string,
    color: string,
    formulation: string,
    splitLine: string
  ) => void;
}

export default function MediSearch({ onSearch }: MediSearchProps) {
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedFormulation, setSelectedFormulation] = useState("");
  const [selectedSplitLine, setSelectedSplitLine] = useState("");

  const handleSearch = () => {
    onSearch(
      selectedShape,
      selectedColor,
      selectedFormulation,
      selectedSplitLine
    );
  };

  const getButtonClass = (value: string, selectedValue: string) => {
    return value === selectedValue
      ? "border p-2 m-1 rounded bg-blue-500 text-white"
      : "border p-2 m-1 rounded";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">의약품 낱알식별 정보 검색</h1>
      <div className="mb-4">
        <h2 className="text-lg">모양</h2>
        <div className="flex flex-wrap">
          {shapes.map((shape) => (
            <button
              key={shape}
              onClick={() => setSelectedShape(shape)}
              className={getButtonClass(shape, selectedShape)}
            >
              {shape}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg">색상</h2>
        <div className="flex flex-wrap">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={getButtonClass(color, selectedColor)}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg">제형</h2>
        <div className="flex flex-wrap">
          {formulations.map((formulation) => (
            <button
              key={formulation}
              onClick={() => setSelectedFormulation(formulation)}
              className={getButtonClass(formulation, selectedFormulation)}
            >
              {formulation}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg">분할선</h2>
        <div className="flex flex-wrap">
          {splitLines.map((splitLine) => (
            <button
              key={splitLine}
              onClick={() => setSelectedSplitLine(splitLine)}
              className={getButtonClass(splitLine, selectedSplitLine)}
            >
              {splitLine}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        검색
      </button>
    </div>
  );
}
