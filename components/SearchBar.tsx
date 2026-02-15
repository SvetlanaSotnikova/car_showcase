"use client";
import { useState } from "react";
import { SearchManufactures } from "./";

const SearchBar = () => {
  const [manufacture, setManufacture] = useState('');
  const handleSearch = () => {};
  return (
    <form action="" className="searchbar" onSubmit={handleSearch}>
      <div className="searchbar__item">
        <SearchManufactures
          manufacturer={manufacture}
          setManufacturer={setManufacture}
        />
      </div>
    </form>
  );
};

export default SearchBar;
