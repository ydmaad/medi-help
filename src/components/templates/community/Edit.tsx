"use client";

import { Tables } from "@/types/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

type Post = Tables<"posts">;

interface PostEditProps {
  id: string;
}

// 게시글 id를 받아 게시글 데이터 요청
// 따로 분리해서 재사용할 수 있는 부분(PostDetail, Edit)
const fetchDetailPost = async (id: string) => {
  try {
    const response = await fetch(`/api/community/${id}`);
    if (!response.ok) {
      throw new Error("게시글 불러오는데 실패했습니다");
    }
    const { data } = await response.json();
    console.log("Fetched post data:", data);
    return data[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 게시글 수정 요청
const editPost = async (
  id: string,
  title: string,
  contents: string,
  images: File[]
) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("contents", contents);
  images.forEach((image) => {
    formData.append("images", image);
  });

  const response = await fetch(`/api/community/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("게시글 수정에 실패했습니다.");
  }
  return await response.json();
};

const Edit: React.FC<PostEditProps> = ({ id }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [image, setImage] = useState<File[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getPost = async () => {
      try {
        const data = await fetchDetailPost(id);
        setPost(data);
        setTitle(data.title);
        setContents(data.contents);
        setCurrentImages(data.img_url ? data.img_url.split(",") : []);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getPost();
  }, [id]);

  // console.log(post);

  const handleEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await editPost(id, title, contents, image);
      alert("게시글이 성공적으로 수정되었습니다.");
      router.push(`/community/${id}`);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(Array.from(e.target.files));
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <>
      <div className="w-[700px] mx-auto p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">글 수정 하는데야!!!</h1>

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

        {/* 현재 이미지 미리보기 */}
        <div className="mb-4 flex flex-wrap">
          {currentImages.map((img, index) => (
            <div key={index} className="w-24 h-24 m-2 relative">
              <Image
                src={img}
                alt={`Preview ${index}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
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
      </div>
      <Link
        href={`/community/${id}`}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out"
      >
        취소
      </Link>
      <button
        onClick={handleEdit}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded inline-flex items-center transition duration-300 ease-in-out"
      >
        완료
      </button>
    </>
  );
};

export default Edit;
