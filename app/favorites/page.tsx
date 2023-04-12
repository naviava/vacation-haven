// Components.
import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import FavoritesClient from "./FavoritesClient";

// GET requests.
import getCurrentUser from "../actions/getCurrentUser";
import getFavorites from "../actions/getFavorites";

const FavoritesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser)
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login." />
      </ClientOnly>
    );

  const userFavorites = await getFavorites();

  if (userFavorites.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No favorites found"
          subtitle="Looks like you have no favorite listings."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div className="mt-4">
        <FavoritesClient favorites={userFavorites} currentUser={currentUser} />
      </div>
    </ClientOnly>
  );
};

export default FavoritesPage;
