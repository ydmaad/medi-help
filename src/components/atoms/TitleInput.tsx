import React from "react";

interface TitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

const TitleInput = ({ title, setTitle }: TitleInputProps) => {
  return (
    <input
      type="text"
      placeholder="제목을 입력하세요"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full px-4 py-2 border rounded-md border-gray-300 text-lg focus:outline-none"
    />
  );
};

export default TitleInput;
