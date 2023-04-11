// Components.
import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

// GET requests.
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import ReservationsClient from "./ReservationsClient";

const ReservationPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized access" subtitle="Please login" />
      </ClientOnly>
    );
  }

  const reservations = await getReservations({
    authorId: currentUser.id,
  });

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No reservations yet"
          subtitle="In the meantime, keep enhancing your property to make it even more inviting."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div className="mt-4">
        <ReservationsClient
          reservations={reservations}
          currentUser={currentUser}
        />
      </div>
    </ClientOnly>
  );
};
export default ReservationPage;
