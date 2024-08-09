// 목적: 체크박스와 라벨을 결합한 재사용 가능한 컴포넌트
import React from "react";
import { AuthLabel } from "../atoms/AuthLabel";

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
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="mr-2"
    />
    <AuthLabel htmlFor={id}>{label}</AuthLabel>
  </div>
);
