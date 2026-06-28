import { useState, useEffect } from "react";

const priceRange = [
    { label: "10 Lakhs", value: "1000000" },
    { label: "20 Lakhs", value: "2000000" },
    { label: "30 Lakhs", value: "3000000" },
    { label: "40 Lakhs", value: "4000000" },
    { label: "50 Lakhs", value: "5000000" },
    { label: "1 crore", value: "9999999" },
    { label: "above 1 crore", value: "10000000" }
];

const sortOptions = [
    { label: "Price: Low to High", value: "1" },
    { label: "Price: High to Low", value: "-1" },
];

function PriceFilter({ selected, onChange, priceSort, onSortChange }) {
    const [openContent, setOpenContent] = useState(false);
    const [rotateArrow, setRotateArrow] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    // Close sort dropdown on outside click
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (!e.target.closest(".price-sort-dropdown")) {
                setSortOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    return (
        <div className="price-filter-css mb-3">

            {/* ── Sort Dropdown ── */}
            <div className="price-sort-dropdown">
                <button
                    className="price-sort-btn"
                    onClick={() => setSortOpen((prev) => !prev)}
                >
                    {sortOptions.find((o) => o.value === priceSort)?.label ?? "Price: Low to High"}
                    <span className={`sort-arrow ${sortOpen ? "open" : ""}`}>▾</span>
                </button>

                {sortOpen && (
                    <ul className="price-sort-menu">
                        {sortOptions.map((option) => (
                            <li
                                key={option.value}
                                className={`price-sort-item ${priceSort === option.value ? "active" : ""}`}
                                onClick={() => {
                                    onSortChange(option.value);
                                    setSortOpen(false);
                                }}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* ── Price Range Filter ── */}
            <div
                className={`priceFilter ${rotateArrow ? "active" : ""}`}
                onClick={() => {
                    setOpenContent(!openContent);
                    setRotateArrow(!rotateArrow);
                }}
            >
                Price Range
                <span className="bi bi-chevron-down arrow"></span>
            </div>

            <div className={`price-filter-content ${openContent ? "show" : ""}`}>
                {priceRange.map((p) => (
                    <button
                        key={p.value}
                        className={selected === p.value ? "active-filter-btn" : ""}
                        onClick={() => onChange(p.value)}
                    >
                        {p.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PriceFilter;