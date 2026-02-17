import { CarProps, FilterProps } from "@/types";

export async function fetchCars(filters: FilterProps) {
  const { manufacturer, year, model, fuel } = filters;

  const headers = {
    "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
    "x-rapidapi-host": "cars-by-api-ninjas.p.rapidapi.com",
  };

  // The limit parameter is for premium users only.
  const params = new URLSearchParams();
  // if (manufacturer) params.append("make", manufacturer);
  // if (year) params.append("year", year.toString());
  // if (model) params.append("model", model);
  // if (limit) params.append("limit", limit.toString());
  // if (fuel) params.append("fuel_type", fuel);

  // we can use omly these params as a free users ((((
  if (manufacturer) params.append("make", manufacturer);
  if (year) params.append("year", year.toString());
  if (model) params.append("model", model);
  if (fuel) params.append("fuel_type", fuel);

  const response = await fetch(
   `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?${params.toString()}`,
    { headers: headers }
  );

  const result = await response.json();
  console.log("API Response:", result);

  return Array.isArray(result) ? result.map(sanitizeCarData) : [];
}

export const calculateCarRent = (city_mpg: number, year: number) => {
  // const mpg = Number(city_mpg);
  // const carYear = Number(year);

  // if (isNaN(mpg) || isNaN(carYear)) return "50";

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

export const generateCarImageUrl = (car: CarProps, angle?: string) => {
  const url = new URL("https://cdn.imagin.studio/getimage");
  const { make, model, year } = car;

  url.searchParams.append(
    "customer",
    process.env.NEXT_PUBLIC_IMAGIN_API_KEY || "",
  );
  url.searchParams.append("make", make);
  url.searchParams.append("modelFamily", model.split(" ")[0]);
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("modelYear", `${year}`);
  // url.searchParams.append('zoomLevel', zoomLevel);
  url.searchParams.append("angle", `${angle}`);

  return `${url}`;
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
