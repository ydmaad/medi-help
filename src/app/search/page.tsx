import { useEffect, useState } from "react";

interface Item {
  itemName: string; // 약 이름
  entpName: string; // 제조사
}

const SearchPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/search?pageNo=1&numOfRows=100");
        if (!response.ok) {
          throw new Error("네트워크 응답에 문제가 있습니다.");
        }
        const data = await response.json();
        setItems(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div>
      <h1>약 목록</h1>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.itemName} - {item.entpName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
