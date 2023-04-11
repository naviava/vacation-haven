import "./globals.css";
import { Nunito } from "next/font/google";

import getCurrentUser from "./actions/getCurrentUser";

import Navbar from "./components/navbar/Navbar";
import ClientOnly from "./components/ClientOnly";
import ToasterProvider from "./providers/ToasterProvider";
import RentModal from "./components/modals/RentModal";
import LoginModal from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";

export const metadata = {
  title: "Vacation Haven",
  description: "We help you find your home, away from home.",
};

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <RentModal />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pb-20 pt-24">{children}</div>
      </body>
    </html>
  );
}
