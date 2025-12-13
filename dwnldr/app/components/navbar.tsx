import { NAV_LINKS } from "@/app/constant/constants";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-6 mx-5 sm:mx-6  xl:mx-25">
      <div>
        <Image src="/logo.svg" alt="logo" width={120} height={40} />
      </div>
      <div className="hidden sm:flex text-black space-x-8 ">
        {NAV_LINKS.map((link) => {
          return (
            <Link
              className="relative group text-base text-[16px] lg:text-[18px]"
              key={link.id}
              href={link.url}
            >
              <span className="">{link.label}</span>

              <span className="absolute h-1 w-0 bg-red-600 left-0 -bottom-1 rounded-full transition-all duration-300 group-hover:w-full" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
