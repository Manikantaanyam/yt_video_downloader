"use client";

import { useState } from "react";
import { NAV_LINKS } from "@/app/constant/constants";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative z-50">
      <div className="flex justify-between items-center p-6 mx-5 sm:mx-6 xl:mx-25">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="logo"
            width={120}
            height={40}
            className="w-auto h-8 sm:h-10"
          />
        </Link>

        <div className="hidden sm:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              className="relative group text-base text-[16px] lg:text-[18px] font-medium text-black"
              key={link.id}
              href={link.url}
            >
              <span>{link.label}</span>
              <span className="absolute h-1 w-0 bg-red-600 left-0 -bottom-1 rounded-full transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <button
          className="sm:hidden text-black p-2 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div
          className={`
          absolute top-20 right-5 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl transition-all duration-200 ease-out sm:hidden
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }
        `}
        >
          <div className="flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 text-base font-semibold text-black hover:bg-gray-50 hover:text-red-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
