// src/components/atoms/AuthModal.tsx

import React from "react";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="p-4 overflow-y-auto flex-grow">
          <div className="prose prose-sm max-w-none">
            {content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-brand-primary-500 text-white py-2 px-4 rounded hover:bg-brand-primary-600 transition duration-200"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
