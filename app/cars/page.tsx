"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contents/AuthContext";
import { useRouter } from "next/navigation";
import { collection, query, where, onSnapshot  } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CarCard from "@/components/CarCard";
import { LikedCar } from "@/types";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [likedCars, setLikedCars] = useState<LikedCar[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

useEffect(() => {
  if (!user) return;

  const q = query(
    collection(db, "likedCars"),
    where("userId", "==", user.uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const cars = snapshot.docs.map(doc => doc.data() as LikedCar);
    setLikedCars(cars);
  });

  return () => unsubscribe();
}, [user]);

  if (loading || !user) return null;

  return (
    <section className="overflow-hidden">
      <div className="mt-12 padding-x padding-y max-width">
        <div className="home__text-container">
          <h1>{user.email}</h1>
          <h1 className="text-4xl font-extrabold">Your favourite cars</h1>
          <div className="home__cars-wrapper">    
            {likedCars.map((car, index) => (
              <CarCard key={index} car={car} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
