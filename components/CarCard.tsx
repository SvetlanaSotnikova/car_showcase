"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { CarProps } from "@/types";
import CustomButton from "./CustomButton";
import { generateCarImageUrl } from "@/utils";
import CarDetails from "./CarDetails";
import { useAuth } from "@/contents/AuthContext";
import {
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CarCardProps {
  car: CarProps;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  disableLike?: boolean;
  isInitiallyLiked?: boolean;
}

const CarCard = ({
  car,
  selectable = false,
  selected = false,
  onSelect,
  disableLike = false,
  isInitiallyLiked = false,
}: CarCardProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [isLoading, setIsLoading] = useState(false);

  const carId = useMemo(
    () => car.id || `${car.make}-${car.model}-${car.year}-${car.fuel_type}`,
    [car],
  );

  useEffect(() => {
    if (isInitiallyLiked || !user) return;

    const checkIfLiked = async () => {
      const docRef = doc(db, "likedCars", `${user.uid}_${carId}`);
      const snapshot = await getDoc(docRef);
      setIsLiked(snapshot.exists());
    };

    checkIfLiked();
  }, [user, carId]);

  const handleLike = async () => {
    if (!user || isLoading || disableLike) return;
    setIsLoading(true);

    const docRef = doc(db, "likedCars", `${user.uid}_${carId}`);

    try {
      if (isLiked) {
        await deleteDoc(docRef);
        setIsLiked(false);
      } else {
        await setDoc(docRef, {
          ...car,
          userId: user.uid,
          carId,
          createdAt: serverTimestamp(),
        });
        setIsLiked(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="car-card group relative">
      <div className="car-card__content">
        {selectable && (
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="absolute top-3 right-3 w-5 h-5"
          />
        )}
        <h2 className="car-card__content-title">
          {car.make} {car.model}
        </h2>

        <button
          disabled={isLoading || disableLike}
          onClick={handleLike}
          className={disableLike ? "opacity-40 cursor-not-allowed" : ""}
        >
          {isLiked ? (
            <Image
              src="/heart-filled.svg"
              width={25}
              height={20}
              alt="heart-filled"
            />
          ) : (
            <Image
              src="/heart-outline.svg"
              width={25}
              height={20}
              alt="heart-outline"
            />
          )}
        </button>
      </div>

      <p className="flex mt-6 text-[32px] font-extrabold">
        <span className="self-start text-[14px] font-semibold">$</span>
        {car.price}
        <span className="self-end text-[14px] font-medium">/day</span>
      </p>

      <div className="relative w-full h-40 my-3 object-contain">
        <Image
          fill
          src={generateCarImageUrl(car)}
          alt="car model"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
        />
      </div>

      <div className="relative flex w-full mt-2">
        <div className="flex group-hover:invisible w-full justify-between text-grey">
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src="/steering-wheel.svg"
              width={20}
              height={20}
              alt="steering wheel"
              style={{ width: "auto", height: "auto" }}
            />
            <p className="text-[14px] leading-[17px]">
              {car.transmission === "a" ? "Automatic" : "Manual"}
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src="/tire.svg"
              width={20}
              height={20}
              alt="tire"
              style={{ width: "auto", height: "auto" }}
            />
            <p className="text-[14px]">{car.drive?.toUpperCase() ?? "N/A"}</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src="/gas.svg"
              width={20}
              height={20}
              alt="gas"
              style={{ width: "auto", height: "auto" }}
            />
            <p className="text-[14px] leading-[17px]">{car.city_mpg} MPG</p>
          </div>
        </div>

        <div className="car-card__btn-container">
          <CustomButton
            title="View more.."
            containerStyles="w-full py-[16px] rounded-full bg-primary-blue"
            textStyles="text-white text-[14px] leading-[17px] font-bold"
            rightIcon="/right-arrow.svg"
            handleClick={() => setIsOpen(true)}
          />
        </div>
      </div>

      {isOpen && (
        <CarDetails
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
          car={car}
        />
      )}
    </div>
  );
};

export default CarCard;
