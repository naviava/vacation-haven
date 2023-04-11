"use client";

// React and Next.
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

// External packages.
import { signOut } from "next-auth/react";
import { AiOutlineMenu } from "react-icons/ai";
import { useAutoAnimate } from "@formkit/auto-animate/react";

// Custom hooks.
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRentModal from "@/app/hooks/useRentModal";

// Types.
import { SafeUser } from "@/app/types";

// Components.
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";

interface UserMenuProps {
  currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();
  const [animationRef, enableAnimation] = useAutoAnimate();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const rentModal = useRentModal();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleLogin = useCallback(() => {
    loginModal.onOpen();
    toggleOpen();
  }, [loginModal, toggleOpen]);

  const handleSignUp = useCallback(() => {
    registerModal.onOpen();
    toggleOpen();
  }, [registerModal, toggleOpen]);

  const onRent = useCallback(() => {
    // If user is logged in, open rent modal.
    if (isOpen) toggleOpen();

    // If no user is logged in, open the login modal.
    if (!currentUser) return loginModal.onOpen();

    rentModal.onOpen();
  }, [currentUser, loginModal, rentModal, isOpen, toggleOpen]);

  const onLogout = useCallback(() => {
    router.push("/");
    signOut({ callbackUrl: "/" });
  }, [router]);

  return (
    <div ref={animationRef} className="relative">
      <div className="flex flex-row items-center gap-3">
        <div className="flex flex-col items-end gap-1">
          {currentUser && (
            <div className="hidden select-none text-right lg:block">
              <span className="text-sm">Welcome, </span>
              <span className="text-lg font-bold text-primary">
                {currentUser.name}
              </span>
            </div>
          )}
          <div
            onClick={onRent}
            className="hidden w-20 cursor-pointer whitespace-nowrap rounded-full bg-neutral-100 px-3 py-2 text-center text-xs font-bold transition duration-300 hover:scale-110 hover:bg-primary/30 md:block lg:py-1"
          >
            My haven
          </div>
        </div>
        <div
          onClick={toggleOpen}
          className="hover:shadow:md flex cursor-pointer flex-row items-center gap-3 rounded-full border-[1px] border-neutral-200 p-4 transition md:px-2 md:py-1"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute right-0 top-12 w-[40vw] overflow-hidden rounded-xl bg-white shadow-md md:w-[90%]">
          <div onClick={toggleOpen} className="flex cursor-pointer flex-col">
            {currentUser ? (
              <>
                <MenuItem
                  onClick={() => router.push("/reservations")}
                  label="My reservations"
                />
                <MenuItem
                  onClick={() => router.push("/trips")}
                  label="My trips"
                />
                <MenuItem
                  onClick={() => router.push("/favorites")}
                  label="Favorites"
                />
                <MenuItem
                  onClick={() => router.push("/properties")}
                  label="My properties"
                />
                <MenuItem onClick={onRent} label="My Haven" />
                <hr />
                <MenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  label="Logout"
                />
              </>
            ) : (
              <>
                <MenuItem onClick={loginModal.onOpen} label="Login" />
                <MenuItem onClick={registerModal.onOpen} label="Sign up" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
