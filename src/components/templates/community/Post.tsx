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
    // window.location.href = "/community";
    return data;
  } catch (error) {
    console.error("게시글 등록 오류 =>", error);
    alert("노노 등록 실패");
  }
};

const Post = () => {
  const [title, setTitle] = useState<string>("");
  const [contents, setContents] = useState<string>("");
  const [image, setImage] = useState<File[]>([]);

  // 게시글을 전송을 요청하는 핸들러
  const handleAddPost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("전송할 데이터!! : ", { title, contents, image });
    await fetchPost({ title, contents, image });
  };

  // 여러 이미지 파일을 처리하는 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImage((prevImage) => [...prevImage, ...files]);
    }
  };

  return (
    <>
      <div className="w-[700px] mx-auto p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">글쓰기 하는데야!!!</h1>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="title"
          >
            제목
          </label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            이미지 첨부
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
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
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="contents"
          >
            내용
          </label>
          <textarea
            placeholder="내용을 입력하세요"
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            className="w-full h-[500px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-4">
          <Link
            href={`/community/`}
            className="bg-gray-300  px-4 py-2 rounded-md shadow-sm hover:bg-gray-400"
          >
            취소
          </Link>
          <button
            onClick={handleAddPost}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
          >
            게시하기
          </button>
        </div>
      </div>
    </>
  );
};

export default Post;
