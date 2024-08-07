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
    console.log("수정하려고 불러온 데이터 :", data);
    return data[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 게시글 수정 요청
const editPost = async (id: string, formData: FormData) => {
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
  // 새로 업로드하려는 이미지 파일
  const [image, setImage] = useState<File[]>([]);
  // supabase에서 가져온 기존 이미지
  const [currentImage, setCurrentImage] = useState<string[]>([]);
  // 수파베이스에 저장할 스테이트 생성 (image + currentImage) -> 파일 + 문자열 타입으로!!
  const [saveImage, setSaveImage] = useState<(File | string)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getPost = async () => {
      try {
        const data = await fetchDetailPost(id);
        setPost(data);
        setTitle(data.title);
        setContents(data.contents);
        if (data.img_url) {
          const imageUrls = data.img_url.split(",");
          setCurrentImage(imageUrls);
          setSaveImage(imageUrls);
          // console.log("설정된 이미지 URL:", imageUrls); // 디버깅용
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getPost();
  }, [id]);

  // console.log(image);
  // console.log(currentImage);
  // console.log(saveImage);

  // route에 보낼 데이터
  const handleEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("contents", contents);

      saveImage.forEach((img, index) => {
        if (typeof img === "string") {
          formData.append("imageUrl", img);
        } else if (img instanceof File) {
          formData.append("imageFile", img);
        }
      });

      await editPost(id, formData);
      alert("게시글이 성공적으로 수정되었습니다.");
      router.push(`/community/${id}`);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  // 여러 이미지 파일을 처리하는 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImage((prevImage) => [...prevImage, ...files]);
      setSaveImage((prev) => [...prev, ...files]);
    }
  };

  // 첨부된 이미지 삭제하는 핸들러
  const handleRemoveImage = (index: number) => {
    setSaveImage((prev) => prev.filter((_, i) => i !== index));
  };

  // console.log("현재 게시글:", post);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <>
      <div className="w-[700px] mx-auto p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">글 수정</h1>

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
          {saveImage.map((img, index) => (
            <div key={index} className="w-24 h-24 m-2 relative">
              <Image
                src={typeof img === "string" ? img : URL.createObjectURL(img)}
                alt={`Preview ${index}`}
                fill
                sizes="(max-width: 96px) 100vw, 96px"
                style={{ objectFit: "cover" }}
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
      <div className="flex justify-center space-x-4 m-8">
        <Link
          href={`/community/${id}`}
          className="bg-gray-100 w-[100px] px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 inline-flex items-center justify-center"
        >
          취소
        </Link>
        <button
          onClick={handleEdit}
          className="bg-blue-500 text-white w-[100px] px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
        >
          완료
        </button>
      </div>
    </>
  );
};

export default Edit;
