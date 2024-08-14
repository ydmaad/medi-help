"use client";

import CategorySelect from "@/components/molecules/CategorySelect";
import { fetchPost } from "@/lib/commentsAPI";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Post = () => {
  const [title, setTitle] = useState<string>("");
  const [contents, setContents] = useState<string>("");
  const [image, setImage] = useState<File[]>([]);
  const [selectCategory, setSelectCategory] = useState<string>("");
  const categories = ['메디톡', '궁금해요','건강 꿀팀']

  // 게시글을 전송을 요청하는 핸들러
  const handleAddPost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectCategory) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    // console.log("전송할 데이터!! : ", { title, contents, image });
    await fetchPost({ title, contents, image, category: selectCategory });
  };

  // 여러 이미지 파일을 처리하는 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImage((prevImage) => [...prevImage, ...files]);
    }
  };

  // 첨부된 이미지 삭제하는 핸들러
  const handleRemoveImage = (index: number) => {
    setImage((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // 카테고리 선택 핸들러
  const handleCategorySelect = (category: string) => {
    setSelectCategory(category);
  };
  console.log(selectCategory);

  return (
    <>
      <div className="flex desktop:hidden justify-between space-x-4 mb-6 ">
        <Link href={`/community/`}>
          <Image
            src="/postCancel.svg"
            alt="게시글등록취소"
            width={26}
            height={26}
          ></Image>
        </Link>
        <div className=" text-center ">
          <h1 className="text-[18px] font-black ">글쓰기</h1>
        </div>
        <button
          onClick={handleAddPost}
          className="text-[18px] text-brand-primary-500  hover:text-brand-primary-700"
        >
          등록
        </button>
      </div>

      <h1 className="text-[24px] font-black  hidden desktop:flex ">
        커뮤니티 글쓰기
      </h1>
<CategorySelect categories={categories} selectCategory={selectCategory} onSelectCategory={handleCategorySelect}></CategorySelect>
      <div className="bg-white w-[335px] desktop:w-[996px] rounded-lg items-center">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-[335px] desktop:w-[996px] px-4 py-2 border rounded-md border-gray-300  text-lg focus:outline-none"
        />

        {/* 이미지 첨부, 내용 인풋 */}
        <div className="border border-gray-100 rounded-md mt-3 mb-4 desktop:mb-7 ">
          {/* 데스크탑 버전 이미지 첨부 부분 */}
          <div className="mt-4 hidden desktop:flex">
            <label className="inline-flex items-center cursor-pointer text-gray-600 ml-3 mb-2">
              <Image
                src="/addImage.svg"
                alt="이미지추가버튼"
                width={20}
                height={20}
                className="mr-1"
              ></Image>
              사진 추가 (최대 50MB)
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* 등록할 이미지 미리보기 */}
          <div className="mb-4 flex-wrap hidden desktop:flex">
            {image.map((img, index) => (
              <div key={index} className="w-24 h-24 m-2 relative">
                <Image
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${index}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-[17px] left-[40px] text-white  flex items-center justify-center text-xs"
                  style={{ transform: "translate(50%, -50%)" }}
                >
                  <Image
                    src="/imageDelBtn.svg"
                    alt="이미지삭제버튼"
                    width={38}
                    height={38}
                  ></Image>
                </button>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <textarea
              placeholder={`궁금한 점이나 공유하고 싶은 내용을 작성해 보세요!\n구체적인 제품명이나 이미지, 약 정보 등을 작성하면 더욱 구체적인 답변을 받을 수 있어요. `}
              value={contents}
              onChange={(e) => setContents(e.target.value)}
              className="w-full h-[345px] desktop:h-[277px] mt-2 desktop:mt-0 text-[14px] px-3 focus:outline-none resize-none"
            />
          </div>
        </div>
        {/* 이미지 첨부, 내용 인풋=============================== */}
        {/* 버튼 */}
        <div className=" border border-brand-gray-600 rounded py-3 flex desktop:hidden items-center justify-center ">
          <label className="inline-flex items-center cursor-pointer text-gray-600">
            <Image
              src="/addImage.svg"
              alt="이미지추가버튼"
              width={20}
              height={20}
              className="mr-1"
            ></Image>
            이미지 추가 (최대 50MB)
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap desktop:hidden ">
          {image.map((img, index) => (
            <div key={index} className="w-[60px] h-[60px] relative mr-2">
              <Image
                src={URL.createObjectURL(img)}
                alt={`Preview ${index}`}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-[13px] left-[20px] text-white flex items-center justify-center text-xs"
                style={{ transform: "translate(50%, -50%)" }}
              >
                <Image
                  src="/imageDelBtn.svg"
                  alt="이미지삭제버튼"
                  width={24}
                  height={24}
                ></Image>
              </button>
            </div>
          ))}
        </div>
        <div className="hidden desktop:flex justify-center space-x-4  ">
          <Link
            href={`/community/`}
            className="bg-brand-primary-50 text-brand-primary-500 w-[100px] px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 inline-flex items-center justify-center"
          >
            취소
          </Link>
          <button
            onClick={handleAddPost}
            className="bg-brand-primary-500 text-white w-[100px] px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
          >
            작성
          </button>
        </div>
      </div>
    </>
  );
};

export default Post;
