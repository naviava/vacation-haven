"use client";

// React and Next.
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

// External packages.
import { BiSearch } from "react-icons/bi";

// Custom hooks.
import useSearchModal from "@/app/hooks/useSearchModal";
import useCountries from "@/app/hooks/UseCountries";
import { differenceInCalendarDays } from "date-fns";

const Search = () => {
  const searchModal = useSearchModal();
  const params = useSearchParams();
  const { getByValue } = useCountries();

  const locationValue = params?.get("locationValue");
  const startDate = params?.get("startDate");
  const endDate = params?.get("endDate");
  const guestCount = params?.get("guestCount");

  const locationLabel = useMemo(() => {
    if (locationValue) return getByValue(locationValue as string)?.label;

    return "Anywhere";
  }, [getByValue, locationValue]);

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const filteredStartDate = new Date(startDate);
      const filteredEndDate = new Date(endDate);
      let searchDuration = differenceInCalendarDays(
        filteredEndDate,
        filteredStartDate
      );

      if (searchDuration === 0) searchDuration = 1;

      return `${searchDuration} day${searchDuration > 1 ? "s" : ""}`;
    }

    return "Any week";
  }, [startDate, endDate]);

  const guestLabel = useMemo(() => {
    if (guestCount)
      return `${guestCount} guest${parseInt(guestCount) > 1 ? "s" : ""}`;

    return "Add guests";
  }, [guestCount]);

  return (
    <div
      onClick={searchModal.onOpen}
      className="w-full cursor-pointer rounded-full border-[1px] py-2 shadow-sm transition hover:shadow-md md:w-auto"
    >
      <div className="flex flex-row items-center justify-between">
        <div className="px-6 text-sm font-semibold">{locationLabel}</div>
        <div className="hidden flex-1 border-x-[1px] px-6 text-center text-sm font-semibold sm:block">
          {durationLabel}
        </div>
        <div className="flex flex-row items-center gap-3 pl-6 pr-2 text-sm text-gray-600">
          <div className="hidden sm:block">{guestLabel}</div>
          <div className="rounded-full bg-primary p-2 text-white">
            <BiSearch size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
