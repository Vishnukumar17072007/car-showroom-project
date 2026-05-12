import { useState } from "react";

function FuelTypeFilter({selected, onChange}) {

        const [openContent, setOpenContent] = useState(false);
        const [rotateArrow, setRotateArrow] = useState(false);

        const fuelTypes = ["Gasoline", "petrol", "Flex Fuel", "Diesel", "Hybrid", "Electric", "Hydrogen", "others"];
    return(
        // <!-- fuelType filter -->
            <div className="fuel-type-filter-css mb-3">
                <div className={`fuel_type bg-light border-none border-bottom-1 ${rotateArrow ? "active" : ""}`} onClick={() => {
                    setOpenContent(!openContent);
                    setRotateArrow(!rotateArrow);
                }}>FUEL TYPE <span className="bi bi-chevron-down arrow"></span></div>

                <div className={`fuel_type_list row ${openContent ? "show" : ""}`} id="fuel_type">
                    {fuelTypes.map((t) => (
                        <div key={t} className="col-6">
                            <input type="checkbox" name="" id="" checked={selected ===t} onChange={() => onChange(t)}/>
                            <span> {t}</span>
                        </div>
                    ))}
                </div>
            </div>
    );
}

export default FuelTypeFilter