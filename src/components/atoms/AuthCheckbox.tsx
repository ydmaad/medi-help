// src/components/atoms/AuthCheckbox.tsx

import React from "react";
import Image from "next/image";

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
      <div className="absolute top-0 left-0 w-full h-full">
        <Image
          src={checked ? "/on_check.svg" : "/off_check.svg"}
          alt={checked ? "Checked" : "Unchecked"}
          width={18}
          height={18}
        />
      </div>
    </div>
    <label
      htmlFor={id}
      className="text-[16px] text-brand-gray-600 cursor-pointer"
    >
      {label}
    </label>
  </div>
);
