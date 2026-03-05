"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contents/AuthContext";
import { useEffect, useState } from "react";
import { CustomButton } from "@/components";
// import emailjs from "@emailjs/browser";

export default function OrderPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const cars = params.get("cars")?.split(",") || [];
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  //   const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.email?.split("@")[0] ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const parsedCars = cars.map((car) => {
    const parts = car.split("-");
    return {
      make: parts[0],
      year: parts[parts.length - 1],
      model: parts.slice(1, -1).join(" "),
    };
  });
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
    <section className="overflow-hidden">
      <div className="mt-12 padding-x padding-y max-width">
        <div className="max-width padding-x padding-y">
          <h1 className="text-3xl font-bold">Order request</h1>
          <div className="mb-8">
            <h2 className="mt-8 text-xl font-semibold mb-4">Selected cars:</h2>
            {cars.map((car) => {
              const parts = car.split("-");
              const make = parts[0];
              const year = parts[parts.length - 1]; 
              const model = parts.slice(1, -1).join(" "); 
              return (
                <p key={car} className="p-2 bg-gray-50 rounded-lg mb-2">
                  {make} {model} ({year})
                </p>
              );
            })}
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
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              required
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
