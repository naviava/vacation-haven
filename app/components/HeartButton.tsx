"use client";

// External packages.
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

// Custom hooks.
import useFavorite from "../hooks/useFavorite";

// Types.
import { SafeUser } from "../types";

interface HeartButtonProps {
  listingId: string;
  currentUser?: SafeUser | null;
}

const HeartButton: React.FC<HeartButtonProps> = ({
  listingId,
  currentUser,
}) => {
  const { isFavorite, toggleFavorite } = useFavorite({
    listingId,
    currentUser,
  });

  return (
    <div
      onClick={toggleFavorite}
      className="relative cursor-pointer transition hover:opacity-80"
    >
      <AiOutlineHeart
        size={28}
        className="absolute -right-[2px] -top-[2px] text-white"
      />
      <AiFillHeart
        size={24}
        className={isFavorite ? "text-primary" : "text-neutral-500/70"}
      />
    </div>
  );
};
export default HeartButton;
