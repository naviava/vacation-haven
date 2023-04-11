"use client";

// React and Next.
import dynamic from "next/dynamic";

// External packages.
import { IconType } from "react-icons";

// Custom Hooks.
import useCountries from "@/app/hooks/UseCountries";

// Types.
import { SafeUser } from "@/app/types";

// Components.
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";

const Map = dynamic(() => import("../Map"), { ssr: false });

interface ListingInfoProps {
  user: SafeUser;
  description: string;
  roomCount: number;
  guestCount: number;
  bathroomCount: number;
  locationValue: string;
  category: { label: string; icon: IconType; description: string } | undefined;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  roomCount,
  guestCount,
  bathroomCount,
  locationValue,
  category,
}) => {
  const { getByValue } = useCountries();

  const coOrdinates = getByValue(locationValue)?.latlng;

  return (
    <div className="flex flex-col gap-8 md:col-span-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2 text-xl font-semibold">
          <div>Hosted by {user?.name}</div>
          <Avatar src={user?.image} />
        </div>
        <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
          <div>{guestCount} guests</div>
          <div>{roomCount} rooms</div>
          <div>{bathroomCount} bathrooms</div>
        </div>
      </div>
      <hr />
      {category && (
        <ListingCategory
          label={category.label}
          icon={category.icon}
          description={category.description}
        />
      )}
      <hr />
      <div className="text-justify text-lg font-light text-neutral-500">
        {description}
      </div>
      <hr />
      <Map center={coOrdinates} />
    </div>
  );
};
export default ListingInfo;
