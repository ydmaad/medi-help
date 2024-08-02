"use client";

import { useAuthStore } from "@/store/auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// 게시글 등록 요청
const fetchPost = async ({
  title,
  contents,
  image,
}: {
  title: string;
  contents: string;
  image: File[];
}) => {
  const user = useAuthStore.getState().user;

  if (!user) {
    throw new Error("사용자 인증 정보가 없습니다.");
  }

  try {
    // formData로 전송할 데이터 변경
    const formData = new FormData();
    formData.append("title", title);
    formData.append("contents", contents);
    image.forEach((img) => {
      formData.append("image", img);
    });

    const response = await fetch(`/api/community/`, {
      method: "POST",
      headers: { "User-id": user.id },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    alert("게시글이 등록되었습니다!");
    window.location.href = "/community";
    return data;
  } catch (error) {
    console.error("게시글 등록 오류 =>", error);
    alert("게시글 등록 실패");
  }
};

const Post = () => {
  const [title, setTitle] = useState<string>("");
  const [contents, setContents] = useState<string>("");
  const [image, setImage] = useState<File[]>([]);

  // 게시글을 전송을 요청하는 핸들러
  const handleAddPost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // console.log("전송할 데이터!! : ", { title, contents, image });
    await fetchPost({ title, contents, image });
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

  return (
    <>
      <div className="w-[1000px]  mx-auto p-6">
        <h1 className="text-2xl font-bold  ml-6">글쓰기</h1>

        <div className="bg-white  rounded-lg p-6">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md border-gray-300  text-lg focus:outline-none"
          />
          {/* 이미지 첨부, 내용 인풋 */}
          <div className="border border-gray-100 rounded-md my-7">
            {/* 이미지 첨부 부분 */}
            <div className="mt-4">
              <label className="inline-flex items-center cursor-pointer text-gray-600 ml-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                사진 / 동영상 추가 (최대 50MB)
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* 등록할 이미지 미리보기 */}
            <div className="mb-4 flex flex-wrap">
              {image.map((img, index) => (
                <div key={index} className="w-24 h-24 m-2 relative">
                  <Image
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${index}`}
                    layout="fill"
                    objectFit="cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    style={{ transform: "translate(50%, -50%)" }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <textarea
                placeholder={`궁금한 점이나 공유하고 싶은 내용을 작성해 보세요!\n구체적인 제품명이나 이미지, 약 정보 등을 작성하면 더욱 구체적인 답변을 받을 수 있어요. `}
                value={contents}
                onChange={(e) => setContents(e.target.value)}
                className="w-full h-[500px] px-3 py-2 focus:outline-none resize-none"
              />
            </div>
          </div>
          {/* 이미지 첨부, 내용 인풋=============================== */}
          <div className="flex justify-center space-x-4">
            <Link
              href={`/community/`}
              className="bg-gray-100 w-[100px] px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 inline-flex items-center justify-center"
            >
              취소
            </Link>
            <button
              onClick={handleAddPost}
              className="bg-blue-500 text-white w-[100px] px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
            >
              작성
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
