import { CarCard, CarsList, CustomFilter, Hero, SearchBar, ShowMore } from "@/components";
import { HomeProps } from "@/types";
import { fetchCars } from "@/utils";
import Image from "next/image";
import { fuels, yearsOfProduction } from "@/contents";

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const allcars = await fetchCars({
    manufacturer: params.manufacturer || "toyota", // используем params
    year: params?.year ? Number(params.year) : 2020,
    fuel: params.fuel || "gas",
    // limit: params.limit || 10,
    model: params.model || "corolla",
  });
  console.log("Fetched cars:", allcars);
  const isDataEmpty = !Array.isArray(allcars) || allcars.length < 1 || !allcars;

  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore out cars you might like</p>
        </div>
        <div className="home__filters">
          <SearchBar />
          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} />
            <CustomFilter title="year" options={yearsOfProduction} />
          </div>
        </div>

        {!isDataEmpty ? (
          <section>
            <div className="home__cars-wrapper">
              {allcars?.map((car, index) => (
                <CarCard
                  key={`${car.make}-${car.model}-${car.year}-${index}`}
                  car={car}
                />
              ))}
              {/* <CarsList cars={allcars} /> */}
            </div>
            <ShowMore
              pageNumber={(params.limit || 10) / 10}
              isNext={(params.limit || 10) > allcars.length}
            />
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">no cars here :(</h2>
            {/* <p>{allcars?.message}</p> */}
          </div>
        )}
      </div>
    </main>
  );
}
