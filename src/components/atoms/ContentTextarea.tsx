import React from "react";

interface ContentTextareaProps {
  contents: string;
  setContents: (contents: string) => void;
}

const ContentTextarea = ({ contents, setContents }: ContentTextareaProps) => {
  return (
    <textarea
      placeholder={`궁금한 점이나 공유하고 싶은 내용을 작성해 보세요!\n구체적인 제품명이나 이미지, 약 정보 등을 작성하면 더욱 구체적인 답변을 받을 수 있어요. `}
      value={contents}
      onChange={(e) => setContents(e.target.value)}
      className="w-full h-[345px] desktop:h-[277px] mt-2 desktop:mt-0 text-[14px] px-3 focus:outline-none resize-none"
    />
  );
};

export default ContentTextarea;
