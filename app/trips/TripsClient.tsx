"use client";

// React and Next.
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

// External packages.
import axios from "axios";
import { toast } from "react-hot-toast";

// Types.
import { SafeReservation, SafeUser } from "../types";

// Components.
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/Listings/ListingCard";

interface TripsClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [itemIdToDelete, setItemIdToDelete] = useState("");

  const onCancel = useCallback(
    (id: string) => {
      setItemIdToDelete(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success("Reservation cancelled");
          router.refresh();
        })
        .catch((err) =>
          toast.error(
            err?.response?.data?.error || "Could not cancel reservation"
          )
        )
        .finally(() => setItemIdToDelete(""));
    },
    [router]
  );

  return (
    <Container>
      <div className="mt-4">
        <Heading
          title="Trips"
          subtitle="Where you've been and where you're going"
        />
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {reservations.map((reservation) => (
            <ListingCard
              key={reservation.id}
              listing={reservation.listing}
              reservation={reservation}
              actionId={reservation.id}
              onAction={onCancel}
              disabled={itemIdToDelete === reservation.id}
              actionLabel="Cancel reservation"
              currentUser={currentUser}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};
export default TripsClient;
