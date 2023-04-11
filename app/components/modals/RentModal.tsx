"use client";

// React and Next.
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// External packages.
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

// Custom hooks.
import useRentModal from "@/app/hooks/useRentModal";

// Components.
import Modal from "./Modal";
import Heading from "../Heading";
import CategoryInput from "../inputs/CategoryInput";
import CountrySelect from "../inputs/CountrySelect";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";

// Constants.
import { categories } from "../navbar/Categories";

// Type created for modal page content.
enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();
  // Initialize state for modal page content.
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize react-hook-form.
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      imageSrc: "",
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      price: 1,
      title: "",
      description: "",
    },
  });

  // Use react-hook-form watch fn to get the value of the fields.
  const category = watch("category");
  const location = watch("location");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrc = watch("imageSrc");
  const title = watch("title");
  const description = watch("description");

  // Use dynamic import to render the Map component only on the client.
  // This is needed due to limited support for SSR in the Mapbox GL JS library.
  const Map = useMemo(
    () => dynamic(() => import("../Map"), { ssr: false }),
    [location]
  );

  // Fn that sets the value of a field.
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // Fn that handles the back button.
  const onBack = () => {
    setStep((prev) => prev - 1);
  };

  // Fn that handles the next button.
  const onNext = () => {
    if (step === STEPS.CATEGORY && !category) return;
    if (step === STEPS.LOCATION && !location) return;
    // if (step === STEPS.IMAGES && !imageSrc) return;
    setStep((prev) => prev + 1);
  };

  const actionLabel = useMemo(() => {
    // If we're on the last step, button label should be "Create".
    if (step === STEPS.PRICE) return "Create";
    // Otherwise, button label should be "Next".
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    // If we're on the first step, button won't be rendered.
    if (step === STEPS.CATEGORY) return undefined;
    // Otherwise, button label should be "Back".
    return "Back";
  }, [step]);

  // Fn that handles the form submission.
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // If we're not on the last step, go to the next step.
    if (step !== STEPS.PRICE) return onNext();

    // Otherwise, create the listing.
    setIsLoading(true);
    axios
      .post("api/listings", data)
      .then(() => {
        toast.success("Haven created successfully!");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };

  // If we're on the first step, render the category selection.
  let bodyContent = (
    <div>
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />
      <div className="grid max-h-[30rem] grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(categoryName) =>
                setCustomValue("category", categoryName)
              }
              label={item.label}
              icon={item.icon}
              selected={category === item.label}
            />
          </div>
        ))}
      </div>
    </div>
  );

  // If we're on the second step, render the location selection.
  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your place located?"
          subtitle="Help guests find you"
        />
        <CountrySelect
          value={location}
          onChange={(country) => setCustomValue("location", country)}
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  // If we're on the third step, render the info selection.
  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basic information"
          subtitle="What amenities do you have?"
        />
        <Counter
          value={guestCount}
          onChange={(modifiedGuestCount) =>
            setCustomValue("guestCount", modifiedGuestCount)
          }
          title="Guests"
          subtitle="How many guests do you allow?"
        />
        <hr />
        <Counter
          value={roomCount}
          onChange={(modifiedRoomCount) =>
            setCustomValue("roomCount", modifiedRoomCount)
          }
          title="Rooms"
          subtitle="How many rooms do you have?"
        />
        <hr />
        <Counter
          value={bathroomCount}
          onChange={(modifiedBathroomCount) =>
            setCustomValue("bathroomCount", modifiedBathroomCount)
          }
          title="Bathrooms"
          subtitle="How many bathrooms do you have?"
        />
      </div>
    );
  }

  // If we're on the fourth step, render the images selection.
  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo"
          subtitle="Show guests what you haven looks like"
        />
        <ImageUpload
          value={imageSrc}
          onChange={(uploadedImage) =>
            setCustomValue("imageSrc", uploadedImage)
          }
        />
      </div>
    );
  }

  // If we're on the fifth step, render the description selection.
  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your haven?"
          subtitle="Short and sweet works best"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  // If we're on the sixth step, render the price selection.
  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />
        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      title="Make your home a haven for others"
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}
    />
  );
};
export default RentModal;
