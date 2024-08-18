// src/components/atoms/AuthCheckbox.tsx

import React from "react";
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
        <TbCheck
          className={checked ? "text-brand-gray-50" : "text-brand-gray-200"}
          size={14}
        />
      </div>
    </div>
    <label
      htmlFor={id}
      className="text-[14px] text-brand-gray-800 cursor-pointer"
    >
      {label}
    </label>
  </div>
);

// 기존 코드
// import React from "react";

// type AuthCheckboxProps = {
//   id: string;
//   checked: boolean;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   label: string;
// };

// export const AuthCheckbox: React.FC<AuthCheckboxProps> = ({
//   id,
//   checked,
//   onChange,
//   label,
// }) => (
//   <div className="flex items-center">
//     <input
//       type="checkbox"
//       id={id}
//       checked={checked}
//       onChange={onChange}
//       className="mr-2"
//     />
//     <label htmlFor={id} className="text-sm">
//       {label}
//     </label>
//   </div>
// );
