import { CarProps, FilterProps } from "@/types";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  limit as firestoreLimit,
  getDocs,
} from "firebase/firestore";

export async function fetchCars(filters: FilterProps) {
  try {
    const {
      manufacturer,
      year,
      model,
      fuel,
      limit: resultLimit = 10,
    } = filters;

    const carsRef = collection(db, "cars");
    const conditions = [];

    if (manufacturer) {
      conditions.push(where("make", "==", manufacturer));
    }

    if (year) {
      conditions.push(where("year", "==", Number(year)));
    }

    if (fuel) {
      conditions.push(where("fuel_type", "==", fuel.toLowerCase()));
    }
    const q =
      conditions.length > 0
        ? query(carsRef, ...conditions, firestoreLimit(resultLimit))
        : query(carsRef, firestoreLimit(resultLimit));

    const querySnapshot = await getDocs(q);
    const cars = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CarProps[];

    const filteredCars = model
      ? cars.filter((car) =>
          car.model?.toLowerCase().includes(model.toLowerCase()),
        )
      : cars;

    return filteredCars.map(sanitizeCarData);
  } catch (error) {
    console.error("Error fetching cars from Firebase:", error);
    return [];
  }
}

export const calculateCarRent = (city_mpg: number, year: number) => {
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
  price: car.price || Math.floor(Math.random() * 120) + 80,
  city_mpg: toNumberOrDefault(car.city_mpg, 20),
  class: car.class ?? "N/A",
  combination_mpg: toNumberOrDefault(car.combination_mpg, 25),
  cylinders: toNumberOrDefault(car.cylinders, 4),
  displacement: toNumberOrDefault(car.displacement, 1500),
  drive: car.drive ?? "N/A",
  fuel_type: car.fuel_type ?? "N/A",
  highway_mpg: toNumberOrDefault(car.highway_mpg, 30),
  make: car.make ?? "N/A",
  model: car.model ?? "N/A",
  transmission: car.transmission ?? "a",
  year: toNumberOrDefault(car.year, 2020),
});

export const generateCarImageUrl = (car: CarProps, angle?: string) => {
  const { make, model, year } = car;

  // Use imagin.studio with the free public customer key
  const url = new URL("https://cdn.imagin.studio/getimage");
  url.searchParams.append("customer", "hrjavascript-mastery");
  url.searchParams.append("make", make.split(" ")[0]);
  url.searchParams.append("modelFamily", model.split(" ")[0]);
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("modelYear", `${year}`);
  if (angle) url.searchParams.append("angle", angle);

  return url.toString();
};

export const updateSearchParams = (type: string, value: string) => {
  // // Get the current URL search params
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.set(type, value);

  // const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return `${window.location.pathname}?${searchParams.toString()}`;
};

export const deleteSearchParams = (type: string) => {
  // Set the specified search parameter to the given value
  const newSearchParams = new URLSearchParams(window.location.search);

  newSearchParams.delete(type.toLocaleLowerCase());

  const newPathname = `${window.location.pathname}?${newSearchParams.toString()}`;

  return newPathname;
};
