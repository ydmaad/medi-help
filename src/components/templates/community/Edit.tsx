"use client";

import Loading from "@/components/atoms/Loading";
import CategorySelect from "@/components/molecules/CategorySelect";
import { useToast } from "@/hooks/useToast";
import { editPost, fetchDetailPost } from "@/lib/commentsAPI";
import { Post } from "@/types/communityTypes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface PostEditProps {
  id: string;
}

// id: post의 id
const Edit = ({ id }: PostEditProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [contents, setContents] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [selectCategory, setSelectCategory] = useState<string>("");
  // 새로 업로드하려는 이미지 파일
  const [image, setImage] = useState<File[]>([]);
  // supabase에서 가져온 기존 이미지
  const [currentImage, setCurrentImage] = useState<string[]>([]);
  // 수파베이스에 저장할 스테이트 생성 (image + currentImage) -> 파일 + 문자열 타입으로!!
  const [saveImage, setSaveImage] = useState<(File | string)[]>([]);
  const router = useRouter();
  const categories = ["메디톡", "궁금해요", "건강 꿀팁"];
  const { toast } = useToast();

  useEffect(() => {
    const getPost = async () => {
      try {
        const data = await fetchDetailPost(id);
        setPost(data);
        setTitle(data.title);
        setContents(data.contents);
        setCategory(data.category);
        if (data.img_url) {
          const imageUrls = data.img_url;
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
      formData.append("category", category);

      saveImage.forEach((img, index) => {
        if (typeof img === "string") {
          formData.append("imageUrl", img);
        } else if (img instanceof File) {
          formData.append("imageFile", img);
        }
      });

      await editPost(id, formData);
      toast.success("게시글이 성공적으로 수정되었습니다.");
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

  // 카테고리 선택 핸들러
  const handleCategorySelect = (category: string) => {
    setSelectCategory(category);
  };

  // console.log(selectCategory);

  // console.log("현재 게시글:", post);

  if (loading) return <Loading />;
  if (error) return <div>에러: {error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;
  // console.log("Loading:", loading);
  // console.log("Error:", error);
  // console.log("Post:", post);

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
          <h1 className="text-[18px] font-black ">글 수정</h1>
        </div>
        <button
          onClick={handleEdit}
          className="text-[18px] text-brand-primary-500  hover:text-brand-primary-700"
        >
          등록
        </button>
      </div>

      <h1 className="text-[24px] font-black  hidden desktop:flex">글 수정</h1>

      <CategorySelect
        categories={categories}
        selectCategory={selectCategory}
        onSelectCategory={handleCategorySelect}
        className="mt-[20px] mb-[16px]"
      ></CategorySelect>

      <div className="max-w-[335px] desktop:max-w-[996px] rounded-lg items-center">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-md border-gray-300  text-lg focus:outline-none"
        />

        {/* 이미지 첨부, 내용 인풋 */}
        <div className="border border-gray-100 rounded-md mt-3 mb-4 desktop:mb-7">
          {/* 데스크탑 버전 이미지 첨부 부분 */}
          <div className="mt-4 hidden desktop:flex bg-white">
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

          {/* 데스크탑 버전 등록할 이미지 미리보기 */}
          <div className="mb-4 flex-wrap hidden desktop:flex">
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
              placeholder="내용을 입력하세요"
              value={contents}
              onChange={(e) => setContents(e.target.value)}
              className="w-full h-[345px] desktop:h-[277px] mt-2 desktop:mt-0 text-[14px] px-3 focus:outline-none resize-none"
            />
          </div>
        </div>

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

        <div className="mt-4 flex flex-wrap desktop:hidden">
          {saveImage.map((img, index) => (
            <div key={index} className="w-[60px] h-[60px] relative mr-2">
              <Image
                src={typeof img === "string" ? img : URL.createObjectURL(img)}
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

        <div className="hidden desktop:flex justify-center space-x-4">
          <Link
            href={`/community/${id}`}
            className="bg-brand-primary-50 text-brand-primary-500 w-[100px] px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 inline-flex items-center justify-center"
          >
            취소
          </Link>
          <button
            onClick={handleEdit}
            className="bg-brand-primary-500 text-white w-[100px] px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
          >
            완료
          </button>
        </div>
      </div>
    </>
  );
};

export default Edit;
