"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contents/AuthContext";
import { useRouter } from "next/navigation";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CarCard from "@/components/CarCard";
import { LikedCar } from "@/types";
import { CustomButton } from "@/components";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [likedCars, setLikedCars] = useState<LikedCar[]>([]);
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "likedCars"),
      where("userId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cars = snapshot.docs.map((doc) => doc.data() as LikedCar);
      setLikedCars(cars);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading || !user) return null;

  const toggleCarSelection = (carId: string) => {
    setSelectedCars((prev) =>
    prev.includes(carId)
      ? prev.filter((id) => id !== carId)
      : [...prev, carId]
  );
  };

  return (
    <section className="overflow-hidden">
      <div className="mt-12 padding-x padding-y max-width">
        <div className="home__text-container">
          <h1>{user.email}</h1>
          <div className="flex gap-10 flex-wrap">
            <h1 className="text-4xl font-extrabold">Your favourite cars</h1>
            {!selectMode ? (
              <CustomButton
                title="Order request"
                handleClick={() => setSelectMode(!selectMode)}
                containerStyles="border-2 border-lime-500 rounded-3xl p-2.5"
                textStyles="font-bold"
              />
            ) : (
              <>
                <CustomButton
                  title="Cancel order :("
                  containerStyles="border-2 border-red-200 rounded-3xl p-2.5"
                  textStyles="font-medium"
                  handleClick={() => {
                    setSelectMode(false);
                    setSelectedCars([]);
                  }}
                />
                {selectedCars.length > 0 && (
                  <CustomButton
                    title="Continue order"
                    containerStyles="flex gap-2 items-center border-2 rounded-3xl bg-emerald-200"
                    textStyles="font-bold"
                    rightIcon="/arrow-right-circle-fill.svg"
                    handleClick={() =>
                      router.push(`/order?cars=${encodeURIComponent(selectedCars.join(","))}`)
                    }
                  />
                )}
              </>
            )}
          </div>

          <div className="home__cars-wrapper">
            {likedCars.map((car) => (
              <CarCard
                key={car.carId || `${car.make}-${car.model}-${car.year}-${car.fuel_type}`}
                car={car}
                selectable={selectMode}
                selected={selectedCars.includes(car.carId)}
                onSelect={() => toggleCarSelection(car.carId)}
                disableLike={selectMode}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}