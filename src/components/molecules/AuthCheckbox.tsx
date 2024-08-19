// 목적: 체크박스와 라벨을 결합한 재사용 가능한 컴포넌트
// src/components/molecules/AuthCheckbox.tsx

import React from "react";
import { AuthLabel } from "../atoms/AuthLabel";
import { TbCheck } from "react-icons/tb";

type AuthCheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
};

export const AuthCheckbox: React.FC<AuthCheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
}) => (
  <div className="flex items-center">
    <div className="relative w-[18px] h-[18px] mr-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="absolute opacity-0 w-full h-full cursor-pointer z-10"
      />
      <div
        className={`absolute top-0 left-0 w-full h-full rounded-sm flex items-center justify-center
          ${checked ? "bg-brand-gray-600" : "bg-brand-gray-50"}`}
      >
        {checked && <TbCheck className="text-brand-gray-50" size={14} />}
        {!checked && <TbCheck className="text-brand-gray-200" size={14} />}
      </div>
    </div>
    <AuthLabel htmlFor={id}>{label}</AuthLabel>
  </div>
);
