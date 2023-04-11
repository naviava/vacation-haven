"use client";

// React and Next.
import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

// External packages.
import { Range } from "react-date-range";
import { formatISO } from "date-fns";
import qs from "query-string";

// Custom hooks.
import useSearchModal from "@/app/hooks/useSearchModal";

// Types
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";

// Components.
import Modal from "./Modal";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const SearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  // State.
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.LOCATION);
  const [location, setLocation] = useState<CountrySelectValue>();
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  // Map component is dynamically rendered on the client.
  const Map = useMemo(
    () => dynamic(() => import("../Map"), { ssr: false }),
    [location]
  );

  // Next and Back button functionality.
  const onNext = useCallback(() => setStep((prev) => prev + 1), []);
  const onBack = useCallback(() => setStep((prev) => prev - 1), []);

  // On submit, we update the query string with the new values.
  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) return onNext();

    setIsLoading(true);

    // Get the current selected category from the URL.
    let currentQuery = {};
    if (params) currentQuery = qs.parse(params.toString());

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.startDate)
      updatedQuery.startDate = formatISO(dateRange.startDate);
    if (dateRange.endDate) updatedQuery.endDate = formatISO(dateRange.endDate);

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    searchModal.onClose();
    setIsLoading(false);

    router.push(url);
  }, [
    onNext,
    step,
    location,
    guestCount,
    roomCount,
    bathroomCount,
    params,
    dateRange,
    router,
    searchModal,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) return "Search";
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) return undefined;
    return "Back";
  }, [step]);

  // If the step is the location step, we render the location select component.
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where do you want to go?"
        subtitle="Find the perfect haven for you"
      />
      <CountrySelect
        value={location}
        onChange={(country) => setLocation(country as CountrySelectValue)}
      />
      <hr />
      <Map center={location?.latlng} />
    </div>
  );

  // If the step is the date step, we render the date range picker.
  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="When do you want to go?" subtitle="Select your dates" />
        <Calendar
          dateRange={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />
      </div>
    );
  }

  // If the step is the info step, we render the info inputs.
  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="What do you need?" subtitle="Select your preferences" />
        <Counter
          title="Guests"
          subtitle="How many guests are coming?"
          value={guestCount}
          onChange={(value) => setGuestCount(value)}
        />
        <Counter
          title="Rooms"
          subtitle="How many rooms are you looking for?"
          value={roomCount}
          onChange={(value) => setRoomCount(value)}
        />
        <Counter
          title="Bathrooms"
          subtitle="How many bathrooms do you need?"
          value={bathroomCount}
          onChange={(value) => setBathroomCount(value)}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      title="Filters"
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={onBack}
      body={bodyContent}
    />
  );
};

export default SearchModal;
