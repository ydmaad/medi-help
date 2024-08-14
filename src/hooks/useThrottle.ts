import { useCallback, useRef } from "react";

type FunctionType<Args extends unknown[], Return> = (...args: Args) => Return;

// 댓글 따닥 방지 훅(useThrottle이라는 커스텀 훅) - 실행할 함수(callback)와 쓰로틀링간격(delay)를 인수로 받음
export function useThrottle<Args extends unknown[], Return>(
  callback: FunctionType<Args, Return>,
  delay: number // 밀리초 단위의 시간 간격
): FunctionType<Args, Return> {
  // 마지막으로 함수가 실행된 시간을 저장
  const lastRun = useRef(Date.now());
  // 메모이제이션된 콜백을 반환 - 불필요한 렌더링 방지
  return useCallback(
    // 나중에 이 함수가 호출될 때 전달될 모든 인자를 받아들임
    (...args: Args): Return => {
      // 현재 시간을 가져옴
      const now = Date.now();
      // 현재 시간과 마지막 실행된 시간을 뺐을 때 delay(2초)보다 크거나 같다면
      if (now - lastRun.current >= delay) {
        // 마지막 실행시간을 현재시간으로 업데이트
        lastRun.current = now;
        // 원본 콜백함수를 실행하고 그 결과를 반환
        return callback(...args);
      }
      // 타입 안전성을 위해 실제 반환값의 타입을 사용
      // 이 부분은 실행되지 않지만, TypeScript의 타입 체크를 통과하기 위해 필요
      return undefined as unknown as Return;
    },
    // callback이나 delay가 변경될 때만 새로운 함수를 생성
    [callback, delay]
  );
}
