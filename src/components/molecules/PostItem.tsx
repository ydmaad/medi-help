import { PostWithUser } from "@/types/communityTypes";
import { formatTimeAgo } from "@/utils/dateUtils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface PostItemProps {
  item: PostWithUser;
}

const PostItem = ({ item }: PostItemProps) => {
  const timeAgo = formatTimeAgo(item.created_at);
  return (
    <>
      <li key={item.id} className="block">
        <Link
          href={`/community/${item.id}`}
          className="block transition duration-150 ease-in-out rout rounded "
        >
          <div className="border mx-auto rounded-2xl p-[16px] desktop:p-[20px] h-[125px] w-[335px] desktop:h-[164px] desktop:w-full mb-[16px] hover:bg-gray-50">
            <div className="flex justify-between">
              <div className="pr-4 max-w-[940px]">
                <div className="flex flex-col ">
                  <span className="text-[12px] desktop:text-[14px] text-brand-gray-400 mb-[4px] desktop:mb-[8px]">
                    {item.category}
                  </span>
                  <div className="flex mb-[4px] items-center font-semibold">
                    <h2 className="text-[16px] desktop:text-[18px]  truncate max-w-[200px] desktop:max-w-[940px] ">
                      {item.title}
                    </h2>
                    <span className="text-[#f66555] text-[16px] desktop:text-[18px] ml-1 flex-shrink-0">
                      ({`${item.comment_count}`})
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-[8px] desktop:mb-[16px] line-clamp-1 text-[14px]">
                  {item.contents}
                </p>
                <div className="flex justify-between items-center text-xs desktop:text-[14px] text-gray-500">
                  <div className="flex items-center">
                    <span>{item.user.nickname}</span>
                    <div className="mx-3 h-4 w-px text-[12px] desktop:text-[14px] bg-gray-300"></div>
                    <span>{timeAgo}</span>
                    <div className="mx-3 h-4 w-px text-[12px] desktop:text-[14px] bg-gray-300"></div>
                    <span className="text-[12px]">
                      저장 {item.bookmark_count}
                    </span>
                  </div>
                </div>
              </div>
              {item.img_url &&
                item.img_url.length > 0 &&
                Array.isArray(item.img_url) && (
                  <div className="flex justify-center my-auto w-[48px] h-[48px] flex-shrink-0 desktop:w-[96px] desktop:h-[96px]">
                    <Image
                      src={item.img_url[0]}
                      alt="Post image"
                      width={96}
                      height={96}
                      className="w-[48px] h-[48px]  desktop:object-cover desktop:w-full desktop:h-full desktop:rounded"
                    />
                  </div>
                )}
            </div>
          </div>
        </Link>
      </li>
    </>
  );
};

export default PostItem;
