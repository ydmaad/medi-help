"use client";

import { useEffect, useRef } from "react";

export const useTimeout = (callback: () => void, delay: number) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (savedCallback.current) savedCallback.current();
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delay]);
};
