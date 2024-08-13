import React from "react";

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
    <label htmlFor={id} className="text-sm">
      {label}
    </label>
  </div>
);
