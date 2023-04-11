// React and Next.
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

// External packages.
import axios from "axios";
import { toast } from "react-hot-toast";

// Custom hooks.
import useLoginModal from "./useLoginModal";

// Types
import { SafeUser } from "../types";

interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const isFavorite = useMemo(() => {
    const list = currentUser?.favoriteIds || [];
    return list.includes(listingId);
  }, [currentUser, listingId]);

  const toggleFavorite = useCallback(
    async (evt: React.MouseEvent<HTMLDivElement>) => {
      evt.stopPropagation();

      if (!currentUser) return loginModal.onOpen();

      try {
        let toggleFavoriteRequest;
        if (isFavorite)
          toggleFavoriteRequest = () =>
            axios.delete(`/api/favorite/${listingId}`);
        else
          toggleFavoriteRequest = () =>
            axios.post(`/api/favorite/${listingId}`);

        await toggleFavoriteRequest();
        router.refresh();
        toast.success("Favorite updated");
      } catch (err) {
        toast.error("Error updating favorite");
      }
    },
    [currentUser, loginModal, isFavorite, listingId, router]
  );
  return { isFavorite, toggleFavorite };
};

export default useFavorite;
