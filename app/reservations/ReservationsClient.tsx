"use client";

// React and Next.
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// External packages.
import axios from "axios";
import { toast } from "react-hot-toast";

// Types.
import { SafeReservation, SafeUser } from "../types";

// Components.
import Heading from "../components/Heading";
import Container from "../components/Container";
import ListingCard from "../components/Listings/ListingCard";

interface ReservationsClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [reservationIdToDelete, setReservationIdToDelete] = useState("");

  const cancelReservation = useCallback(
    (id: string) => {
      setReservationIdToDelete(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success("Reservation cancelled");
          router.refresh();
        })
        .catch((err) => toast.error("Something went wrong"))
        .finally(() => {
          setReservationIdToDelete("");
        });
    },
    [router]
  );

  return (
    <Container>
      <Heading
        title="Reservations"
        subtitle="See who's finding refuge in your haven!"
      />
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            listing={reservation.listing}
            actionId={reservation.id}
            actionLabel="Cancel guest reservation"
            currentUser={currentUser}
            disabled={reservationIdToDelete === reservation.id}
            onAction={cancelReservation}
            reservation={reservation}
          />
        ))}
      </div>
    </Container>
  );
};
export default ReservationsClient;
