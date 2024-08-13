// 목적: 인증 관련 입력 필드를 위한 재사용 가능한 컴포넌트
// import React from "react";

// type AuthInputProps = {
//   id?: string;
//   type: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   placeholder: string;
//   required?: boolean; // required를 선택적 prop으로 추가
//   className?: string;
// };

// export const AuthInput: React.FC<AuthInputProps> = ({
//   id,
//   type,
//   value,
//   onChange,
//   placeholder,
//   required = false, // 기본값을 false로 설정
//   className = "",
// }) => (
//   <input
//     id={id}
//     type={type}
//     value={value}
//     onChange={onChange}
//     placeholder={placeholder}
//     required={required}
//     className={
//       "w-full px-3 py-2 border border-gray-300 rounded-md ${className}`.trim()"
//     }
//   />
// );

import React, { ChangeEvent } from "react";

type AuthInputProps = {
  id: string;
  name: string; // name 속성 추가
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  className?: string;
};

export const AuthInput: React.FC<AuthInputProps> = ({
  id,
  name, // name prop 추가
  type,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}) => (
  <input
    id={id}
    name={name} // name 속성 추가
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${className}`.trim()}
  />
);
