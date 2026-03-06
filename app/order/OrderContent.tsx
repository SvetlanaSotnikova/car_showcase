"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contents/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { CustomButton, PhoneField } from "@/components";
import { parseCars } from "@/utils";
// import emailjs from "@emailjs/browser";

export default function OrderContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const raw = params.get("cars") ?? "";
  const cars = raw ? decodeURIComponent(raw).split(",").filter(Boolean) : [];
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.email?.split("@")[0] ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const parsedCars = useMemo(() => parseCars(cars), [cars]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    const res = await fetch("/api/send-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        cars: parsedCars,
      }),
    });

    if (res.ok) {
      router.push("/order-success");
    }
  };
  return (
    <section className="overflow-x-hidden">
      <div className="mt-12 padding-x padding-y max-width">
        <div className="max-width padding-x padding-y">
          <h1 className="text-3xl font-bold">Order request</h1>
          <p>Contact us to rent some cars you liked :D</p>
          <div className="mb-8">
            <h2 className="mt-8 text-xl font-semibold mb-4">Selected cars:</h2>
            {parsedCars.map((car, index) => (
              <p key={index} className="p-2 bg-gray-50 rounded-lg mb-2">
                {car.make} {car.model} ({car.year} {car.fuel_type})
              </p>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              required
            />
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              required
            />
            <PhoneField
              value={phone}
              onChange={(value) => setPhone(value)}
            />
            <CustomButton
              title={isSubmitting ? "Submitting..." : "Submit request"}
              isDisabled={isSubmitting}
              handleClick={handleSubmit}
              btnType="submit"
              containerStyles={`w-full py-3 px-4 bg-primary-blue text-white rounded-lg font-medium transition
                ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
            />
          </form>
        </div>
      </div>
    </section>
  );
}
