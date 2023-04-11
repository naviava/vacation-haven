"use client";

// React and Next.
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// External packages.
import { format } from "date-fns";

// Custom Hooks.
import useCountries from "@/app/hooks/UseCountries";

// Types.
import { Reservation } from "@prisma/client";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";

// Components.
import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
  listing: SafeListing;
  currentUser?: SafeUser | null;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  deleteButton?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  currentUser,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  deleteButton = false,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  const location = getByValue(listing.locationValue);

  const handleCancel = useCallback(
    (evt: React.MouseEvent<HTMLButtonElement>) => {
      evt.stopPropagation();

      if (disabled) return;
      onAction?.(actionId);
    },
    [disabled, onAction, actionId]
  );

  const price = useMemo(() => {
    if (reservation) return reservation.totalPrice;
    return listing.price;
  }, [reservation, listing.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) return null;

    const startDate = new Date(reservation.startDate);
    const endDate = new Date(reservation.endDate);

    return `${format(startDate, "PP")} - ${format(endDate, "PP")}`;
  }, [reservation]);

  return (
    <div
      onClick={() => router.push(`/listings/${listing.id}`)}
      className="group col-span-1 cursor-pointer"
    >
      <div className="flex w-full flex-col gap-2 rounded-lg transition duration-300 lg:group-hover:scale-110">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          <Image
            fill
            src={listing.imageSrc}
            alt="Listing"
            className="h-full w-full object-cover transition group-hover:scale-110"
          />
          <div className="absolute right-3 top-3">
            <HeartButton listingId={listing.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="text-lg font-semibold">
          {location?.region}, {location?.label}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || listing.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">${price}</div>
          {!reservation && <div className="font-light">per night</div>}
        </div>

        {onAction && actionLabel && (
          <div>
            <Button
              disabled={disabled}
              small
              label={actionLabel}
              onClick={handleCancel}
              deleteButton={deleteButton}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default ListingCard;
