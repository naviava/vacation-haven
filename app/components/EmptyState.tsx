"use client";

// React and Next.
import { useRouter } from "next/navigation";

// Components.
import Heading from "./Heading";
import Button from "./Button";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No results found",
  subtitle = "Try adjusting your search or filter to find more results.",
  showReset,
}) => {
  const router = useRouter();

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-2">
      <Heading title={title} subtitle={subtitle} center />
      <div className="mt-4 w-48">
        {showReset && (
          <Button
            onClick={() => router.push("/")}
            label="Remove all filters"
            outline
          />
        )}
      </div>
    </div>
  );
};
export default EmptyState;
