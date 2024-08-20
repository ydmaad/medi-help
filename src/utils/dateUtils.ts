import { differenceInDays, formatDate, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

// 게시글 작성 시간(**전)
export const formatTimeAgo = (date: Date | number | string): string => {
  const d = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffDays = differenceInDays(now, d);
  // 7일이상 지난 게시글
  if (diffDays > 7) {
    return formatDate(d, "yyyy년 MM월 dd일", { locale: ko });
  } else {
    return formatDistanceToNow(d, {
      addSuffix: true,
      locale: ko,
    }).replace(/약 /, "");
  }
};
