"use client";
import Link from "next/link";
import Image from "next/image";
import CustomButton from "./CustomButton";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contents/AuthContext";

const Navbar = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

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

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden sm:block">
              Hi, {user.email?.split("@")[0]}! 👋
            </span>
            <CustomButton
              title="Your cars"
              btnType="button"
              // handleClick={handleLogout}
              handleClick={() => router.push("/cars")}
              containerStyles="text-primary-blue rounded-full bg-white min-w-[130px]"
            />
          </div>
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
