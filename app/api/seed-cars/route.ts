// import { NextResponse } from "next/server";
// import { collection, doc, setDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { manufacturers } from "@/contents";

// const years = [2017, 2018, 2019, 2020, 2021, 2023];

// const fuelTypes = ["electricity"];

// function randomPrice() {
//   return Math.floor(Math.random() * 120) + 80;
// }

// async function fetchCars(
//   make: string,
//   year: number,
//   fuelType: string,
//   apiKey: string,
// ) {
//   const response = await fetch(
//     `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?make=${make}&year=${year}&fuel_type=${fuelType}`,
//     {
//       headers: {
//         "x-rapidapi-key": apiKey,
//         "x-rapidapi-host": "cars-by-api-ninjas.p.rapidapi.com",
//       },
//     },
//   );

//   if (!response.ok) {
//     const text = await response.text();
//     throw new Error(`API error for ${make} ${year} ${fuelType}: ${text}`);
//   }

//   return response.json();
// }

// export async function GET() {
//   try {
//     const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

//     if (!API_KEY) {
//       return NextResponse.json(
//         { error: "RapidAPI key missing" },
//         { status: 500 },
//       );
//     }

//     let count = 0;

//     for (const make of manufacturers) {
//       for (const year of years) {
//         for (const fuelType of fuelTypes) {
//           let data;

//           try {
//             data = await fetchCars(make, year, fuelType, API_KEY);
//           } catch (err: any) {
//             console.warn(err.message);
//             continue;
//           }

//           for (const car of data) {
//             const id = `${car.make}_${car.model}_${car.year}_${fuelType}`;

//             await setDoc(doc(collection(db, "cars"), id), {
//               make: car.make,
//               model: car.model,
//               year: car.year,
//               fuel_type: fuelType,
//               cylinders: car.cylinders ?? null,
//               displacement: car.displacement ?? null,
//               drive: car.drive ?? null,
//               transmission: car.transmission ?? null,

//               city_mpg: Math.floor(Math.random() * 15) + 20,
//               highway_mpg: Math.floor(Math.random() * 15) + 30,
//               combination_mpg: Math.floor(Math.random() * 15) + 25,

//               price: randomPrice(),
//               createdAt: Date.now(),
//             });

//             count++;
//           }
//         }
//       }
//     }

//     return NextResponse.json({ added: count });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
