"use client";

import { useOverlay } from "@toss/use-overlay";
import { Toast, ToastProps, toastStates } from "@/components/atoms/Toast";

export const useToast = () => {
  const overlay = useOverlay();

  const open = (toastProps: ToastProps) =>
    overlay.open((ovlProps) => <Toast {...toastProps} {...ovlProps} />);

  const close = () => overlay.close();

  const toast = toastStates.reduce(
    (acc, state) => ({
      ...acc,
      [state]: (message: string, duration?: number) =>
        open({ message, duration, state }),
    }),
    {} as Record<
      (typeof toastStates)[number],
      (message: string, duration?: number) => void
    >,
  );

  return { toast, close };
};
