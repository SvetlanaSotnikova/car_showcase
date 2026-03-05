"use client";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contents/AuthContext";
import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function OrderPage() {
  const params = useSearchParams();
  const { user } = useAuth();
  const cars = params.get("cars")?.split(",") || [];
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setphone] = useState("");
  const [name, setName] = useState(user?.email?.split("@")[0]);

  const sendOrder = async () => {
    await emailjs.send(
        "service_id",
        "template_id",
        {
            name,
            email,
            phone,
            cars: cars.join(","),
        },
        "public_key"
    );
  };
  return (
    <div className="max-width padding-x padding-y">
      <h1 className="text-3xl font-bold">Order request</h1>
      <div>
        <h2>Selected cars:</h2>
        {cars.map((car) => (
          <p key={car}>{car}</p>
        ))}
      </div>
      <form action="POST">
        <input
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Email"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setphone(e.target.value)}
          placeholder="Phone number"
        />
        <button type="submit" onClick={sendOrder}>
          Submit request
        </button>
      </form>
    </div>
  );
}
