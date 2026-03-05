"use client";
import { useEffect, useState } from "react";
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
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CarCardProps {
  car: CarProps;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const CarCard = ({ car, selectable, selected, onSelect }: CarCardProps) => {
  const { city_mpg, year, make, model, transmission, drive, price } = car;
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (!user || isLoading) return;
    setIsLoading(true);

    // const carId = car.id;
    const carId = `${car.make}-${car.model}-${car.year}`;
    const docId = `${user.uid}_${carId}`;
    const docRef = doc(db, "likedCars", docId);

    try {
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        // если уже лайкнута — удаляем
        await deleteDoc(docRef);
        setIsLiked(false);
      } else {
        // если не лайкнута — добавляем
        await setDoc(docRef, {
          userId: user.uid,
          carId,
          make: car.make,
          model: car.model,
          year: car.year,
          price: car.price,
          createdAt: serverTimestamp(),
        });
        setIsLiked(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!user) return;

      const carId = `${car.make}-${car.model}-${car.year}`;
      const docId = `${user.uid}_${carId}`;
      const docRef = doc(db, "likedCars", docId);

      const snapshot = await getDoc(docRef);
      setIsLiked(snapshot.exists());
    };

    checkIfLiked();
  }, [user, car]);

  // const carRent = calculateCarRent(city_mpg, year);
  const carPrice = car.price;
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
          {make} {model}
        </h2>
        <button disabled={isLoading} onClick={handleLike}>
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
        {carPrice}
        <span className="self-end text-[14px] font-medium">/day</span>
      </p>
      <div className="relative w-full h-40 my-3 object-contain">
        <Image
          fill
          src={generateCarImageUrl(car)}
          alt="car model"
          priority
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
              {transmission === "a" ? "Automatic" : "Manual"}
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
            <p className="text-[14px]">{drive.toUpperCase()}</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src="/gas.svg"
              width={20}
              height={20}
              alt="gas"
              style={{ width: "auto", height: "auto" }}
            />
            <p className="text-[14px] leading-[17px]">{city_mpg} MPG</p>
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
