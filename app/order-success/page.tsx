"use client";
import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <section className="overflow-hidden">
      <div className="mt-12 padding-x padding-y max-width">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
          
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Order Submitted!
            </h1>
            <p className="text-gray-500 text-lg max-w-md">
              Your car rental request has been received. We'll get back to you shortly at your email or phone numer :D
            </p>
          </div>

          <div className="flex gap-4 mt-4">
            <Link
              href="/"
              className="text-primary-blue bg-white border border-primary-blue rounded-full px-6 py-2.5 font-semibold text-sm hover:bg-blue-50 transition"
            >
              Back to Home
            </Link>
            <Link
              href="/cars"
              className="text-white bg-primary-blue rounded-full px-6 py-2.5 font-semibold text-sm hover:opacity-90 transition"
            >
              My Cars
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}