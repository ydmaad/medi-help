const Comments = () => {
  return (
    <>
      <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">댓글</h2>

        <div className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="댓글을 입력하세요..."
          ></textarea>
        </div>

        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          댓글 달기
        </button>
      </div>
    </>
  );
};

export default Comments;
