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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="max-h-60 overflow-y-auto mb-4">
          <p>{content}</p>
        </div>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          닫기
        </button>
      </div>
    </div>
  );
};
