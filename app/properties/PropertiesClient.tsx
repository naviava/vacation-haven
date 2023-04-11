"use client";

// React and Next.
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

// External packages.
import axios from "axios";
import { toast } from "react-hot-toast";

// Types.
import { SafeListing, SafeUser } from "../types";

// Components.
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/Listings/ListingCard";

interface PropertiesClientProps {
  userProperties: SafeListing[];
  currentUser?: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  userProperties,
  currentUser,
}) => {
  const router = useRouter();
  const [propertyIdToDelete, setPropertyIdToDelete] = useState("");

  const deleteProperty = useCallback(
    (propertyId: string) => {
      setPropertyIdToDelete(propertyId);

      axios
        .delete(`/api/listings/${propertyId}`)
        .then(() => {
          toast.success("Property deleted");
          router.refresh();
        })
        .catch((err) => toast.error("Something went wrong"))
        .finally(() => setPropertyIdToDelete(""));
    },
    [router]
  );

  return (
    <Container>
      <Heading
        title="Your properties"
        subtitle="All your havens in one place."
      />
      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {userProperties.map((userProperty) => (
          <ListingCard
            key={userProperty.id}
            listing={userProperty}
            currentUser={currentUser}
            actionId={userProperty.id}
            actionLabel="Remove property"
            onAction={deleteProperty}
            disabled={false}
            deleteButton={true}
          />
        ))}
      </div>
    </Container>
  );
};
export default PropertiesClient;
