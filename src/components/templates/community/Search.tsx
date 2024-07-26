import { Tables } from "@/types/supabase";

type Post = Tables<"posts">;

const Search: React.FC<Post> = () => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        className="w-[300px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button className="p-2 m-2 border border-gray-300 rounded-md  hover:bg-gray-50 transition duration-150 ease-in-out">
        검색
      </button>
    </div>
  );
};

export default Search;
