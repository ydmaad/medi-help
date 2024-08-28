"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import TertiColum from "@/components/molecules/TertiColum";
import MainColum from "@/components/molecules/MainColum";
import SubColum from "@/components/molecules/SubColum";
import Hero from "@/components/molecules/Hero";
import LoadMoreButton from "@/components/atoms/LoadMoreButton";
import MainTitle from "@/components/atoms/MainTitle";
import ContentsCard from "@/components/molecules/ContentsCard";
import BgLinear from "@/components/atoms/BgLinear";
import Slider from "@/components/atoms/Slider";

export type Magazine = {
  id: string;
  title: string;
  imgs_url: string;
  written_by: string;
  reporting_date: string;
};

type Post = {
  id: string;
  title: string;
  img_url: string[] | null;
  created_at: string;
  contents: string;
};

const Page = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMagazines = async () => {
    try {
      const response = await fetch("/api/magazine");
      if (!response.ok) {
        throw new Error("데이터를 불러오는 데 실패했습니다.");
      }
      const result = await response.json();
      setMagazines(result.data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/community");
      if (!response.ok) {
        throw new Error("커뮤니티 데이터를 불러오는 데 실패했습니다.");
      }
      const result = await response.json();
      setPosts(result.data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchMagazines();
    fetchPosts();
  }, []);

  const limitedMagazines = magazines.slice(2, 5);
  const limitedMainMagazines = magazines.slice(0, 1);
  const limitedSubMagazines = magazines.slice(1, 2);
  const hotlimitedPosts = posts.slice(0, 3);
  const newlimitedPosts = posts.slice(3, 6);
  return (
    <>
      <div className="absolute inset-0 z-0 mt-[67px]">
        <BgLinear />
      </div>
      <Hero />
      <div className="flex justify-between max-w-[335px] desktop:max-w-[1000px] mx-auto mb-[10px]">
        <MainTitle text="매디칼럼" />
        <LoadMoreButton targetPage="/magazine" />
      </div>
      <div className="hidden desktop:flex flex-col justify-center items-center  ">
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex ">
          {limitedMainMagazines.map((magazine, index) => (
            <MainColum
              key={index}
              src={magazine.imgs_url}
              alt={magazine.title}
              title={magazine.title}
              leftText={magazine.written_by}
              rightText={magazine.reporting_date}
              id={magazine.id}
            />
          ))}
          {limitedSubMagazines.map((magazine, index) => (
            <SubColum
              key={index}
              src={magazine.imgs_url}
              alt={magazine.title}
              title={magazine.title}
              leftText={magazine.written_by}
              rightText={magazine.reporting_date}
              id={magazine.id}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-[24px] ">
          {limitedMagazines.map((magazine, index) => (
            <TertiColum
              key={index}
              src={magazine.imgs_url}
              alt={magazine.title}
              title={magazine.title}
              leftText={magazine.written_by}
              rightText={magazine.reporting_date}
              id={magazine.id}
            />
          ))}
        </div>
      </div>
      {/*데탑때만 보임*/}
      <div className=" overflow-hidden desktop:hidden w-full  ">
        <Slider limitedMagazines={limitedMagazines} />
      </div>

      <div className="flex justify-between mb-[10px] max-w-[335px]  mt-[60px] desktop:max-w-[1000px] mx-auto">
        <MainTitle text="커뮤니티" />
        <LoadMoreButton targetPage="/community" />
      </div>
      <div className="flex justify-center items-center flex-col desktop:flex-row ">
        <div className="grid grid-cols-1 desktop:grid-cols-1 gap-[28px] mr-[28px] ">
          {hotlimitedPosts.map((post, index) => (
            <ContentsCard
              key={index}
              hotTitle="✨ NEW"
              newTitle={null}
              communityTitle={post.title}
              imageSrc={
                post.img_url && post.img_url.length > 0 ? post.img_url[0] : null
              }
              subTitle={post.contents}
              id={post.id}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 desktop:grid-cols-1 gap-[28px] ">
          {newlimitedPosts.map((post, index) => (
            <ContentsCard
              key={index}
              hotTitle={null}
              newTitle="✨ NEW"
              communityTitle={post.title}
              imageSrc={
                post.img_url && post.img_url.length > 0 ? post.img_url[0] : null
              }
              subTitle={post.contents}
              id={post.id}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
