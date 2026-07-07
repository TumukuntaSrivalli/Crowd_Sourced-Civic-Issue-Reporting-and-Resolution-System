"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Hide navbar only on landing page
  if (pathname === "/") {
    return null;
  }

 return (
    <nav className="bg-black border-b border-zinc-800 text-black px-8 py-4">
      <Navbar />
    </nav>
  );
}