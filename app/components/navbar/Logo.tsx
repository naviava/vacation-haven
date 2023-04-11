"use client";

// React and Next.
import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <Image
      onClick={() => router.push("/")}
      src="/images/logo.svg"
      alt="Logo"
      height="100"
      width="157"
      className="hidden cursor-pointer md:block"
    />
  );
};

export default Logo;
