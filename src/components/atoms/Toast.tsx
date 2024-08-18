"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  IoAlertCircle,
  IoCheckmarkCircle,
  IoClose,
  IoInformationCircle,
  IoWarning,
} from "react-icons/io5";

import { SwitchCase } from "@/components/atoms/SwitchCase";
import { useTimeout } from "@/hooks/useTimeout";

export const toastStates = [
  "default",
  "success",
  "error",
  "warning",
  "info",
  "loading",
] as const;

export interface ToastProps {
  message: string;
  state?: (typeof toastStates)[number];
  duration?: number;
}

interface OverlayProps {
  isOpen: boolean;
  close: () => void;
  exit: () => void;
}

export const Toast: React.FC<ToastProps & OverlayProps> = ({
  message,
  state = "default",
  duration = 3000,
  isOpen,
  close,
  exit,
}) => {
  const color = {
    default: "bg-[#ffffff] text-primary-reverse",
    success: "bg-[#ffffff] text-brand-primary-500",
    error: "bg-[#ffffff] text-[#f66555]",
    warning: "bg-[#ffffff] text-[#fcb819]",
    info: "bg-[#ffffff]o",
    loading: "bg-[#ffffff] text-primary-reverse",
  };

  useTimeout(() => {
    if (state !== "loading") close();
  }, duration);

  return (
    <AnimatePresence onExitComplete={exit}>
      {isOpen && (
        <motion.div
          key="toast message"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: -32, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          onClick={close}
          className="text-sta fixed bottom-0 flex w-full cursor-default justify-center"
        >
          <div
            className={clsx(
              "mx-auto flex items-center rounded-full px-4 py-3 shadow-md shadow-gray-400/30",
              color[state]
            )}
          >
            <div className="text-[2rem]">
              <SwitchCase
                value={state}
                caseBy={{
                  default: null,
                  success: <IoCheckmarkCircle />,
                  error: <IoAlertCircle />,
                  warning: <IoWarning />,
                  info: <IoInformationCircle />,
                  loading: (
                    <div className="h-5 w-5 animate-spin rounded-full border-4 border-b-state-focus" />
                  ),
                }}
              />
            </div>
            <span className="ml-3 mr-5">{message}</span>
            <button onClick={close} className="text-[2rem] border-none">
              <IoClose />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
