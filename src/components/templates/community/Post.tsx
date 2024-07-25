"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import "../styles/globals.css";

const fetchPost = async ({
  title,
  contents,
}: {
  title: string;
  contents: string;
}) => {
  try {
    const response = await fetch(`/api/community/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, contents }),
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("게시글 등록 오류 =>", error);
    alert("노노 등록 실패");
  }
};

const Post = () => {
  const [title, setTitle] = useState<string>("");
  const [contents, setContents] = useState<string>("");

  const onhandleAddPost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault;
    await fetchPost({ title, contents });
  };

  const formats = [
    "font",
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "align",
    "color",
    "background",
    "size",
    "h1",
  ];

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ size: ["small", false, "large", "huge"] }],
          [{ align: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [
            {
              color: [],
            },
            { background: [] },
          ],
        ],
      },
    };
  }, []);

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
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="contents"
          >
            내용
          </label>
          <ReactQuill
            theme="snow"
            value={contents}
            onChange={setContents}
            modules={modules}
            formats={formats}
          />
          {/* <textarea
            placeholder="내용을 입력하세요"
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            className="w-full h-[500px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          /> */}
        </div>
        <div className="flex space-x-4">
          <Link
            href={`/community/`}
            className="bg-gray-300  px-4 py-2 rounded-md shadow-sm hover:bg-gray-400"
          >
            취소
          </Link>
          <button
            onClick={onhandleAddPost}
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
