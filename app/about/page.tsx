"use client";

import Link from "next/link";
import { useAuth } from "@/contents/AuthContext";
import { aboutSections } from "@/contents";

export default function AboutPage() {
  const { user } = useAuth();
  return (
    <section className="overflow-hidden">
      <div className="mt-12 padding-x padding-y max-width">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4">About CarHub</h1>
          <p className="text-gray-500 text-lg mb-12">
            CarHub is a platform where you can explore, compare, and request
            your favourite cars. Sign in to save your favourites and send rental
            requests directly to us.
          </p>

          <div className="flex flex-col gap-10">
            {aboutSections.map((section) => (
              <div
                key={section.title}
                className="border-l-4 border-primary-blue pl-6"
              >
                <h2 className="text-xl font-bold mb-2">{section.title}</h2>
                <p className="text-gray-600">{section.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-6 bg-gray-50 rounded-2xl text-center">
            <h3 className="text-xl font-bold mb-2">Ready to explore?</h3>
            <p className="text-gray-500 mb-6">
              Browse our catalogue or sign in to start saving your favourite
              cars.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/#discover"
                className="text-white bg-primary-blue rounded-full px-6 py-2.5 font-semibold text-sm hover:opacity-90 transition"
              >
                Browse Cars
              </Link>
              {user ? (
                <Link
                  href="/cars"
                  className="text-primary-blue bg-white border border-primary-blue rounded-full px-6 py-2.5 font-semibold text-sm hover:bg-blue-50 transition"
                >
                  My Cars
                </Link>
              ) : (
                <Link
                  href="/auth"
                  className="text-primary-blue bg-white border border-primary-blue rounded-full px-6 py-2.5 font-semibold text-sm hover:bg-blue-50 transition"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
