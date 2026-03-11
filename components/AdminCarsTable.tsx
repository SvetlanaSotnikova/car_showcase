"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
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

export default function AdminCarsTable() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        const data = await fetchCars({ limit: 100 });
        setCars(data);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "bookedCars"), (snap) => {
      setBookedIds(new Set(snap.docs.map((d) => d.id)));
    });

    return unsub;
  }, []);

  const toggleBooked = async (carId: string) => {
    const ref = doc(db, "bookedCars", carId);

    if (bookedIds.has(carId)) {
      return deleteDoc(ref);
    }

    return setDoc(ref, {
      carId,
      bookedAt: serverTimestamp(),
    });
  };

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
                  <th className="p-3 border-b">Make</th>
                  <th className="p-3 border-b">Model</th>
                  <th className="p-3 border-b">Year</th>
                  <th className="p-3 border-b">Fuel</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Action</th>
                </tr>
              </thead>

              <tbody>
                {cars.map((car) => {
                  const carId = `${car.make}-${car.model}-${car.year}-${car.fuel_type}`;
                  const isBooked = bookedIds.has(carId);

                  return (
                    <tr
                      key={carId}
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