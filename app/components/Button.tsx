"use client";

// External packages.
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
  deleteButton: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  isLoading,
  disabled,
  outline,
  small,
  icon: Icon,
  deleteButton,
}) => {
  const spinner = (
    <div
      className="mx-auto h-10 w-10 animate-spin
  rounded-full border-x-4 border-solid border-white border-t-transparent"
    ></div>
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full rounded-lg transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-70
      ${
        outline
          ? "border-black bg-white text-black hover:bg-gray-100"
          : deleteButton
          ? "border-red-600 bg-white hover:bg-red-50"
          : "border-primary bg-primary text-white"
      }
      ${
        small
          ? "border-[1px] py-1 text-sm font-light"
          : "text-md border-2 py-3 font-semibold"
      }
      `}
    >
      {Icon && <Icon size={24} className="absolute left-4 top-3" />}
      {isLoading ? spinner : label}
    </button>
  );
};

export default Button;
