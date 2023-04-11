// Components.
import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

// GET requests.
import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";
import PropertiesClient from "./PropertiesClient";

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser)
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login." />
      </ClientOnly>
    );

  const userProperties = await getListings({ userId: currentUser.id });

  if (userProperties.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No properties found"
          subtitle="Get started by adding your haven."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div className="mt-4">
        <PropertiesClient
          userProperties={userProperties}
          currentUser={currentUser}
        />
      </div>
    </ClientOnly>
  );
};
export default PropertiesPage;
