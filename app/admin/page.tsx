"use client";

import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { CarProps } from "@/types";
import { fetchCars } from "@/utils";
import { FirebaseError } from "firebase/app";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [adminUser, setAdminUser] = useState<any>(null);
  const [cars, setCars] = useState<CarProps[]>([]);
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        setError("You are not authorized as admin.");
        return;
      }
    } catch (err) {
      const e = err as FirebaseError;
      setError(e.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setAdminUser(null);
  };

  useEffect(() => {
    if (!adminUser) return;
    const load = async () => {
      setLoading(true);
      const data = await fetchCars({ limit: 100 });
      setCars(data);
      setLoading(false);
    };
    load();
  }, [adminUser]);

  useEffect(() => {
    if (!adminUser) return;
    const unsub = onSnapshot(collection(db, "bookedCars"), (snap) => {
      setBookedIds(new Set(snap.docs.map((d) => d.id)));
    });
    return () => unsub();
  }, [adminUser]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser?.email === ADMIN_EMAIL) {
        setAdminUser(firebaseUser);
      } else {
        setAdminUser(null);
      }
    });
    return () => unsub();
  }, []);

  const toggleBooked = async (carId: string) => {
    const docRef = doc(db, "bookedCars", carId);
    if (bookedIds.has(carId)) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, { carId, bookedAt: serverTimestamp() });
    }
  };

  if (!adminUser) {
    return (
      <section className="overflow-hidden">
        <div className="padding-x padding-y max-width">
          <div className="mx-auto max-w-sm bg-white p-6 rounded-lg shadow-md space-y-4 mt-20">
            <h1 className="text-2xl font-bold text-center">Admin Login</h1>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-md p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-md p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-primary-blue text-white py-2 rounded-3xl font-semibold"
            >
              Login
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden">
      <div className="padding-x padding-y max-width mt-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold">Admin — Manage Cars</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 border border-red-200 rounded-full px-4 py-1.5 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading cars...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-3 font-semibold border-b">Make</th>
                  <th className="p-3 font-semibold border-b">Model</th>
                  <th className="p-3 font-semibold border-b">Year</th>
                  <th className="p-3 font-semibold border-b">Fuel</th>
                  <th className="p-3 font-semibold border-b">Status</th>
                  <th className="p-3 font-semibold border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car, index) => {
                  const carId = `${car.make}-${car.model}-${car.year}-${car.fuel_type}`;
                  const isBooked = bookedIds.has(carId);
                  return (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3 capitalize">{car.make}</td>
                      <td className="p-3 capitalize">{car.model}</td>
                      <td className="p-3">{car.year}</td>
                      <td className="p-3 capitalize">{car.fuel_type}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            isBooked
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {isBooked ? "Booked" : "Available"}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleBooked(carId)}
                          className={`text-xs px-3 py-1.5 rounded-full font-semibold transition ${
                            isBooked
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {isBooked ? "Mark Available" : "Mark Booked"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
