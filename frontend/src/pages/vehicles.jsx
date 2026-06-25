import FilterTitle from '../filter/FilterTitle';
import AvailableFilter from '../filter/AvailableFilter';
import PriceFilter from '../filter/PriceFilter';
import BodyTypeFilter from '../filter/BodyTypeFilter';
import TransmissionFilter from '../filter/TransmissionFilter';
import FuelTypeFilter from '../filter/FuelTypeFilter';
import CarDetailsFetchingListForCards from '../cards/cars-details-fetching-list-for-cards';
import { useState, useEffect } from 'react';
import { useSearch } from '../context/search/useSearch';

const defaultFilters = {
  bodyType: "",
  transmission: "",
  fuelType: "",
  maxPrice: "",
  available: false,
}

function Vehicles() {
  const [filters, setFilters] = useState(defaultFilters);
  const [showFilter, setShowFilter] = useState(false); // ✅ new
  const { debouncedSearch } = useSearch();

  function handleFilterChange(key, value) {
    setFilters(previousFilter => ({
      ...previousFilter,
      [key]: previousFilter[key] === value ? "" : value
    }));
  }

  function handleReset() {
    setFilters(defaultFilters);
  }

  useEffect(() => {
    if (showFilter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showFilter]);

  return (
    <>
      {/* ✅ Backdrop — only visible on mobile when drawer is open */}
      {showFilter && (
        <div className="filter-backdrop" onClick={() => setShowFilter(false)} />
      )}

      {/* Filter panel — gets "open" class when showFilter is true */}
      <div className={`filter_column ${showFilter ? "open" : ""}`}>
        <FilterTitle onReset={handleReset} />
        <AvailableFilter checked={filters.available} onChange={()=> setFilters(prev => ({...prev, available: !prev.available}))}/>
        <PriceFilter selected={filters.maxPrice} onChange={(val) => handleFilterChange("maxPrice", val)} />
        <BodyTypeFilter selected={filters.bodyType} onChange={(val) => handleFilterChange("bodyType", val)} />
        <TransmissionFilter selected={filters.transmission} onChange={(val) => handleFilterChange("transmission", val)} />
        <FuelTypeFilter selected={filters.fuelType} onChange={(val) => handleFilterChange("fuelType", val)} />
      </div>

      {/* Cards — ✅ filter toggle button lives here, above the grid */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilter(prev => !prev)}
        >
          <i className="bi bi-sliders"></i> Filters
        </button>

        <CarDetailsFetchingListForCards filters={filters} search={debouncedSearch} />
      </div>
    </>
  );
}

export default Vehicles;