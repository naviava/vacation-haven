"use client";

// React and Next.
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// External packages.
import qs from "query-string";
import { IconType } from "react-icons";

interface CategoryBoxProps {
  label: string;
  icon: IconType;
  selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  label,
  icon: Icon,
  selected,
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    let currentQuery = {};

    // Get params and convert to object.
    if (params) currentQuery = qs.parse(params.toString());

    // Add the current category to the query object.
    const updatedQuery: any = { ...currentQuery, category: label };

    // If the category is already selected, remove it from the query object.
    if (params?.get("category") === label) delete updatedQuery.category;

    // Convert the query object to a string and push it to the router.
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [label, params, router]);

  return (
    <div
      onClick={handleClick}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-b-2 p-3 transition hover:text-neutral-800
    ${
      selected
        ? "border-b-neutral-500 text-primary"
        : "border-transparent text-neutral-500"
    }`}
    >
      <Icon size={26} />
      <div className="text-sm font-medium">{label}</div>
    </div>
  );
};
export default CategoryBox;
