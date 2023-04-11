"use client";

// React and Next.
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// External packages.
import axios from "axios";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { toast } from "react-hot-toast";
import { Range } from "react-date-range";

// Custom hooks.
import useLoginModal from "@/app/hooks/useLoginModal";

// Types.
import { Reservation } from "@prisma/client";
import { SafeListing, SafeUser, SafeReservation } from "@/app/types";

// Components.
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/Listings/ListingHead";
import ListingInfo from "@/app/components/Listings/ListingInfo";
import ListingReservation from "@/app/components/Listings/ListingReservation";

// Constants.
import { categories } from "@/app/components/navbar/Categories";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface ListingClientProps {
  listing: SafeListing & { user: SafeUser };
  currentUser?: SafeUser | null;
  reservations?: SafeReservation[];
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  currentUser,
  reservations = [],
}) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  // Updates the total price when the date range changes.
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const numberOfDays = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (numberOfDays && listing.price)
        setTotalPrice(numberOfDays * listing.price);
      else setTotalPrice(listing.price);
    }
  }, [listing.price, dateRange.startDate, dateRange.endDate]);

  // Retrieve dates that are already reserved.
  const disabledDates = useMemo(() => {
    let allReservedDates: Date[] = [];

    reservations.forEach((reservation) => {
      const reservedDates = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      allReservedDates = [...allReservedDates, ...reservedDates];
    });

    return allReservedDates;
  }, [reservations]);

  // Creates the reservation.
  const createReservation = useCallback(() => {
    if (!currentUser) return loginModal.onOpen();

    setIsLoading(true);

    axios
      .post("/api/reservations", {
        listingId: listing?.id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        totalPrice,
      })
      .then(() => {
        toast.success("Reservation created successfully!");
        setDateRange(initialDateRange);
        router.push("/trips");
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    currentUser,
    loginModal,
    dateRange.startDate,
    dateRange.endDate,
    totalPrice,
    listing?.id,
    router,
  ]);

  // Retrieve the category.
  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  return (
    <Container>
      <div className="mx-auto mt-4 max-w-screen-lg">
        <div className="flex flex-col gap-6">
          <ListingHead
            id={listing.id}
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            currentUser={currentUser}
          />
          <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-7">
            <ListingInfo
              user={listing.user}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
              category={category}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={createReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
export default ListingClient;
