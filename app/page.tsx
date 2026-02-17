"use client";

import { CarCard, CustomFilter, Hero, SearchBar, ShowMore } from "@/components";
import { CarProps, HomeProps } from "@/types";
import { fetchCars } from "@/utils";
import Image from "next/image";
import { fuels, yearsOfProduction } from "@/contents";
import { useEffect, useState } from "react";

export default function Home() {
  const [allcars, setAllCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(false);

  // search states
  const [manufacturer, setManuFacturer] = useState("");
  const [model, setModel] = useState("");

  // filter states
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState<number | undefined>(undefined);

  // limit state
  const [limit, setLimit] = useState(10);

  const getCars = async () => {
    setLoading(true);
    try {
      const params = await fetchCars({
        manufacturer: manufacturer || "mercedes-benz", // используем дефолтное значение
        year: year || 2020,
        fuel: fuel,
        model: model || "",
      });

      setAllCars(params);
      console.log("Fetched cars:", params);
    } catch {
      console.error();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, [fuel, year, limit, manufacturer, model]);

  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore out cars you might like</p>
        </div>
        <div className="home__filters">
          <SearchBar setManufacturer={setManuFacturer} setModel={setModel} />
          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} setFilter={setFuel} />
            <CustomFilter
              title="year"
              options={yearsOfProduction}
              setFilter={(value: string) => setYear(Number(value))}
            />
          </div>
        </div>

        {allcars.length > 0 ? (
          <section>
            <div className="home__cars-wrapper">
              {allcars?.map((car, index) => (
                <CarCard key={`$${model}-${year}-${index}`} car={car} />
              ))}
              {/* <CarsList cars={allcars} /> */}
            </div>

            {loading && (
              <div className="mt-16 w-full flex-center">
                <Image
                  src="./loader.svg"
                  alt="loader"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
            )}

            <ShowMore
              pageNumber={limit / 10}
              isNext={limit > allcars.length}
              setLimit={setLimit}
            />
          </section>
        ) : (
          !loading && (
            <div className="home__error-container">
              <h2 className="text-black text-xl font-bold">no cars here :(</h2>
              {/* <p>{allcars?.message}</p> */}
            </div>
          )
        )}
      </div>
    </main>
  );
}
