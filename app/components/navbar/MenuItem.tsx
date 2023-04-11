"use client";

interface MenuItemProps {
  onClick?: () => void;
  label: string;
  mobileOnly?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label, mobileOnly }) => {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 font-semibold transition hover:bg-neutral-100
      ${mobileOnly ? "block md:hidden" : ""}`}
    >
      {label}
    </div>
  );
};

export default MenuItem;
