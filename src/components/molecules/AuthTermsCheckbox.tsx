import React, { useState } from "react";
import Image from "next/image";
import { AuthCheckbox } from "../atoms/AuthCheckbox";
import { AuthModal } from "../atoms/AuthModal";

// AuthTermsCheckbox 컴포넌트의 props 타입 정의
type AuthTermsCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  modalTitle: string;
  modalContent: string;
};

// 약관 동의 체크박스와 모달을 포함하는 컴포넌트
export const AuthTermsCheckbox: React.FC<AuthTermsCheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  modalTitle,
  modalContent,
}) => {
  // 모달의 열림/닫힘 상태를 관리하는 state
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center">
      {/* 약관 동의 체크박스 */}
      <AuthCheckbox
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        label={label}
      />
      {/* 약관 내용을 보기 위한 버튼 */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="ml-2 flex items-center"
      >
        <Image src="/signarrow.svg" alt="약관 보기" width={20} height={20} />
      </button>
      {/* 약관 내용을 표시하는 모달 */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        content={modalContent}
      />
    </div>
  );
};
