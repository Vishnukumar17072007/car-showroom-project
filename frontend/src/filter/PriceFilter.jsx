import { useState } from "react";

const priceRange = [
    {label: "under 10 Lakhs", value: "1000000"},
    {label: "under 20 Lakhs", value: "2000000"},
    {label: "under 30 Lakhs", value: "3000000"},
    {label: "under 40 Lakhs", value: "4000000"},
    {label: "under 50 Lakhs", value: "5000000"},
    {label: "under 1 crore", value: "9999999"},
    {label: "above 1 crore", value: "10000000"}
];

function PriceFilter({ selected, onChange}){
    const [openContent, setOpenContent] = useState(false);
    const [rotateArrow, setRotateArrow] = useState(false);

    return(
        // price Filter
        <div className="price-filter-css mb-3">
            <div className={`priceFilter ${rotateArrow ? "active" : ""}`} onClick={() => {
                setOpenContent(!openContent);
                setRotateArrow(!rotateArrow);
            }}>
                Price Range
                <span className="bi bi-chevron-down arrow"></span>
            </div>

            <div className={`price-filter-content col-6 ${openContent ? "show" : ""}`}>
                {priceRange.map((p) => (
                    <button key={p.value} className={selected === p.value ? "active-filter-btn" : ""} onClick={() => onChange(p.value)}>{p.label}</button>
                ))}
            </div>
        </div>
    );
}

export default PriceFilter;