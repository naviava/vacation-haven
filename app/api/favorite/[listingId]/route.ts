import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IParams {
  listingId: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  const { listingId } = params;
  if (!listingId || typeof listingId !== "string")
    throw new Error("Invalid listing ID");

  const favoriteIds = [...(currentUser.favoriteIds || [])];
  favoriteIds.push(listingId);

  const updatedUser = await prisma.user.update({
    where: { id: currentUser.id },
    data: { favoriteIds },
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  const { listingId } = params;
  if (!listingId || typeof listingId !== "string")
    throw new Error("Invalid listing ID");

  const favoriteIds = [...(currentUser.favoriteIds || [])];
  const updatedFavoriteIds = favoriteIds.filter((id) => id !== listingId);

  const updatedUser = await prisma.user.update({
    where: { id: currentUser.id },
    data: { favoriteIds: updatedFavoriteIds },
  });

  return NextResponse.json(updatedUser);
}
