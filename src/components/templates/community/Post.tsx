"use client";

import ContentTextarea from "@/components/atoms/ContentTextarea";
import TitleInput from "@/components/atoms/TitleInput";
import CategorySelect from "@/components/molecules/CategorySelect";
import { ImgInputDesk, ImgInputMobile } from "@/components/molecules/ImgInput";
import ImgPreviewDesk from "@/components/molecules/ImgPreviewDesk";
import ImgPreviewMobile from "@/components/molecules/ImgPreviewMobile";
import { PostBtnDesk } from "@/components/molecules/PostBtn";
import PostHeader from "@/components/molecules/PostHeader";
import { useToast } from "@/hooks/useToast";
import { fetchPost } from "@/lib/commentsAPI";
import { useState } from "react";

const Post = () => {
  const [title, setTitle] = useState<string>("");
  const [contents, setContents] = useState<string>("");
  const [image, setImage] = useState<File[]>([]);
  const [selectCategory, setSelectCategory] = useState<string>("");
  const categories = ["메디톡", "궁금해요", "건강 꿀팁"];
  const { toast } = useToast();

  // 게시글을 전송을 요청하는 핸들러
  const handleAddPost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectCategory) {
      toast.warning("카테고리를 선택해주세요.");
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
  // console.log(selectCategory);

  return (
    <>
      <PostHeader onAddPost={handleAddPost}></PostHeader>
      <h1 className="text-[24px] font-black  hidden desktop:flex ">
        커뮤니티 글쓰기
      </h1>
      <CategorySelect
        categories={categories}
        selectCategory={selectCategory}
        onSelectCategory={handleCategorySelect}
        className="mt-[20px] mb-[16px]"
      ></CategorySelect>
      <div className="max-w-[335px] desktop:max-w-[996px] rounded-lg items-center">
        <TitleInput title={title} setTitle={setTitle}></TitleInput>

        <div className="border border-gray-100 rounded-md mt-[8px] mb-4 desktop:mb-7 bg-white">
          <ImgInputDesk onImgChange={handleImageChange}></ImgInputDesk>

          <div className="mb-4 flex-wrap hidden desktop:flex">
            {image.map((img, index) => (
              <ImgPreviewDesk
                img={img}
                index={index}
                key={index}
                onImgRemove={handleRemoveImage}
              ></ImgPreviewDesk>
            ))}
          </div>
          <div className="mb-4">
            <ContentTextarea
              contents={contents}
              setContents={setContents}
            ></ContentTextarea>
          </div>
        </div>

        <ImgInputMobile onImgChange={handleImageChange}></ImgInputMobile>

        <div className="mt-4 flex flex-wrap desktop:hidden ">
          {image.map((img, index) => (
            <ImgPreviewMobile
              img={img}
              index={index}
              key={index}
              onImgRemove={handleRemoveImage}
            ></ImgPreviewMobile>
          ))}
        </div>
        <PostBtnDesk onAddPost={handleAddPost}></PostBtnDesk>
      </div>
    </>
  );
};

export default Post;
