// 목적: 인증 관련 입력 필드를 위한 재사용 가능한 컴포넌트

import React, { ChangeEvent } from "react";

type AuthInputProps = {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  className?: string;
  isValid?: boolean;
};

export const AuthInput: React.FC<AuthInputProps> = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  isValid = true,
}) => (
  <input
    id={id}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className={`w-full h-[48px] text-[16px] desktop:text-[18px] px-3 py-2 border-[1px] focus:outline-none ${
      isValid ? "border-brand-gray-200" : "border-[#F66555]"
    } text-brand-gray-1000 rounded ${className}`.trim()}
  />
);

// import React, { ChangeEvent } from "react";

// type AuthInputProps = {
//   id: string;
//   name: string;
//   type: string;
//   value: string;
//   onChange: (e: ChangeEvent<HTMLInputElement>) => void;
//   placeholder: string;
//   required?: boolean;
//   className?: string;
// };

// export const AuthInput: React.FC<AuthInputProps> = ({
//   id,
//   name,
//   type,
//   value,
//   onChange,
//   placeholder,
//   required = false,
//   className = "",
// }) => (
//   <input
//     id={id}
//     name={name}
//     type={type}
//     value={value}
//     onChange={onChange}
//     placeholder={placeholder}
//     required={required}
//     className={`w-full h-[48px] text-[16px] desktop:text-[18px] px-3 py-2 border-[1px] border-brand-gray-200 text-brand-gray-1000 rounded ${className}`.trim()}
//   />
// );
