"use client";

// Types.
import { SafeListing, SafeUser } from "../types";

// Components.
import Heading from "../components/Heading";
import Container from "../components/Container";
import ListingCard from "../components/Listings/ListingCard";

interface FavoritesClientProps {
  favorites: SafeListing[];
  currentUser?: SafeUser | null;
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
  favorites,
  currentUser,
}) => {
  return (
    <Container>
      <Heading
        title="Favorites"
        subtitle="List of places you have favorited."
      />
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {favorites.map((favorite) => (
          <ListingCard
            key={favorite.id}
            listing={favorite}
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};
export default FavoritesClient;
