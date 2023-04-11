import prisma from "@/app/libs/prismadb";

export interface IListingParams {
  userId?: string;
  category?: string;
  locationValue?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
}

export default async function getListings(params: IListingParams) {
  try {
    const {
      userId,
      category,
      locationValue,
      guestCount,
      roomCount,
      bathroomCount,
      startDate,
      endDate,
    } = params;

    let query: any = {};

    if (userId) query.userId = userId;
    if (category) query.category = category;
    if (locationValue) query.locationValue = locationValue;
    if (guestCount) query.guestCount = { gte: +guestCount };
    if (roomCount) query.roomCount = { gte: +roomCount };
    if (bathroomCount) query.bathroomCount = { gte: +bathroomCount };

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!listings) return [];

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (err: any) {
    throw new Error(err);
  }
}
