"use client";

// React and Next.
import Image from "next/image";

// Custom Hooks.
import useCountries from "@/app/hooks/UseCountries";

// Types.
import { SafeUser } from "@/app/types";

// Components.
import Heading from "../Heading";
import HeartButton from "../HeartButton";

interface ListingHeadProps {
  id: string;
  title: string;
  imageSrc: string;
  locationValue: string;
  currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  id,
  title,
  imageSrc,
  locationValue,
  currentUser,
}) => {
  const { getByValue } = useCountries();

  const location = getByValue(locationValue);

  return (
    <>
      <Heading
        title={title}
        subtitle={`${location?.region}, ${location?.label}`}
      />
      <div className="relative h-[60vh] w-full overflow-hidden rounded-xl">
        <Image
          src={imageSrc}
          alt="Haven image"
          fill
          className="w-full object-cover"
        />
        <div className="absolute right-5 top-5">
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
};
export default ListingHead;
