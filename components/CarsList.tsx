"use client";

import { useState } from "react";
import { CarProps } from "@/types";
import CarCard from "./CarCard";
import CustomButton from "./CustomButton";

interface CarsListProps {
  cars: CarProps[];
}

const CarsList = ({ cars }: CarsListProps) => {
  const [visible, setVisible] = useState(10);

  const handleShowMore = () => {
    setVisible((prev) => prev + 10);
  };

  const visibleCars = cars.slice(0, visible);
  const hasMore = visible < cars.length;

  return (
    <>
      <div className="home__cars-wrapper">
        {visibleCars.map((car, index) => (
          <CarCard
            key={`${car.make}-${car.model}-${car.year}-${index}`}
            car={car}
          />
        ))}
      </div>

      {hasMore && (
        <div className="w-full flex-center gap-5 mt-10">
          <CustomButton
            btnType="button"
            title="Show More"
            containerStyles="bg-primary-blue rounded-full text-white"
            handleClick={handleShowMore}
          />
        </div>
      )}
    </>
  );
};

export default CarsList;
