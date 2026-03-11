"use client";
import Link from "next/link";
import Image from "next/image";
import CustomButton from "./CustomButton";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contents/AuthContext";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleYourCarsClick = () => {
    if (pathname === "/cars") {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      router.push("/cars");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <header className="w-full absolute z-10">
        <nav className="max-w-[1400px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4">
          <Link href="/" className="flex justify-center items-center">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={118}
              height={18}
              className="object-contain"
            />
          </Link>
          <div className="w-[130px] h-10 bg-gray-200 rounded-full animate-pulse" />
        </nav>
      </header>
    );
  }

  return (
    <header className="w-full absolute z-10">
      <nav className="max-w-[1400px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4">
        <Link href="/" className="flex justify-center items-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={118}
            height={18}
            className="object-contain"
          />
        </Link>

        {user && !isAdmin ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden sm:block">
              Hi, {user.email?.split("@")[0]}! 👋
            </span>
            <div className="relative">
              <CustomButton
                title="Your cars"
                btnType="button"
                handleClick={handleYourCarsClick}
                containerStyles="text-primary-blue rounded-full bg-white min-w-[130px]"
              />

              {pathname === "/cars" && isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Signed in as
                    </p>
                    <p className="text-sm text-gray-700 font-semibold truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary-blue transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Image
                        src="/arrow-left-circle-fill.svg"
                        alt="arrow left"
                        width={17}
                        height={17}
                        className="object-contain"
                      />
                      Home
                    </Link>
                    <CustomButton
                      title="Sign out"
                      handleClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      containerStyles="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : isAdmin ? (
          <Link href="/admin">
            <CustomButton
              title="Admin"
              containerStyles="text-white bg-orange-500 rounded-full min-w-[100px]"
            />
          </Link>
        ) : (
          <CustomButton
            title="Sign in"
            btnType="button"
            handleClick={() => router.push("/auth")}
            containerStyles="text-primary-blue rounded-full bg-white min-w-[130px] hover:bg-gray-100 transition"
          />
        )}
      </nav>
    </header>
  );
};

export default Navbar;
