import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/Listings/ListingCard";

import getListings from "./actions/getListings";
import getCurrentUser from "./actions/getCurrentUser";

async function Home() {
  const allListings = await getListings();
  const currentUser = await getCurrentUser();
  const isEmpty = true;

  if (allListings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div className="grid grid-cols-1 gap-8 pt-[7rem] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {allListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              currentUser={currentUser}
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
  );
}

export default Home;
