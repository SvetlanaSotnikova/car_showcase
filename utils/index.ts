import { CarProps } from "@/types";

export async function fetchCars() {
  const headers = {
    "x-rapidapi-key": "2af44fbff8mshda7ecbd3a0b897fp14d151jsn736ba2538893",
    "x-rapidapi-host": "cars-by-api-ninjas.p.rapidapi.com",
  };

  const response = await fetch(
    "https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?model=corolla",
    { headers: headers },
  );

  const result = await response.json();
  return Array.isArray(result) ? result.map(sanitizeCarData) : [];
}

export const calculateCarRent = (city_mpg: number, year: number) => {
  const mpg = Number(city_mpg);
  const carYear = Number(year);

  if (isNaN(mpg) || isNaN(carYear)) return "50";

  const basePricePerDay = 50;
  const mileageFactor = 0.1;
  const ageFactor = 0.05;
  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;
  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;
  return rentalRatePerDay.toFixed(0);
};

const toNumberOrDefault = (value: unknown, defaultValue: number = 0) => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

export const sanitizeCarData = (car: CarProps) => ({
  city_mpg: toNumberOrDefault(car.city_mpg, 20),
  class: car.class ?? "N/A",
  combination_mpg: toNumberOrDefault(car.combination_mpg, 25),
  cylinders: toNumberOrDefault(car.cylinders, 4),
  displacement: toNumberOrDefault(car.displacement, 1500),
  drive: car.drive ?? "N/A",
  fuel_type: car.fuel_type ?? "N/A",
  highway_mpg: toNumberOrDefault(car.highway_mpg, 30),
  make: car.make ?? "Unknown",
  model: car.model ?? "Unknown",
  transmission: car.transmission ?? "a",
  year: toNumberOrDefault(car.year, 2020),
});
