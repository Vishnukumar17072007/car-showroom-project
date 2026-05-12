import { useState, useEffect } from "react";
import { SearchContext } from "./searchContext";

export function SearchProvider({ children }) {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(""); // ✅ new

    useEffect(() => {
        // ✅ set a 400ms timer every time `search` changes
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        // ✅ if `search` changes before 400ms, cancel the previous timer
        return () => clearTimeout(timer);
    }, [search]);

    return (
        <SearchContext.Provider value={{ search, setSearch, debouncedSearch }}> {/* ✅ expose debouncedSearch */}
            {children}
        </SearchContext.Provider>
    );
}