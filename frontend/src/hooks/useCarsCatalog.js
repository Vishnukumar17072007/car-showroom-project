import { useEffect, useState, useMemo } from "react";
import API from "../api/axios";
import { normalizeCarsResponse } from "../utils/carsApi";

const DEFAULT_LIMIT = 12;

function buildCarsQuery({ filters, search, page, limit, refreshKey, priceSort}) {
    const params = new URLSearchParams();
    if (filters?.available) params.append("available", "true");
    if (filters?.bodyType) params.append("bodyType", filters.bodyType);
    if (filters?.transmission) params.append("transmission", filters.transmission);
    if (filters?.fuelType) params.append("fuelType", filters.fuelType);
    if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (search) params.append("search", search);
    params.append("priceSort", priceSort);
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (refreshKey) params.append("_refresh", String(refreshKey));
    return params.toString();
}

export function useCarsCatalog({ filters, search, page, limit = DEFAULT_LIMIT, refreshKey = 0, priceSort = 1 }) {
    const [raw, setRaw] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const queryString = useMemo(
        () => buildCarsQuery({ filters, search, page, limit, refreshKey, priceSort }),
        [filters, search, page, limit, refreshKey, priceSort]
    );

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        API.get(`/cars?${queryString}`, { signal: controller.signal })
            .then((res) => {
                setRaw(res.data);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
                setError(err.response?.data?.message || err.message || "Failed to load cars");
                setRaw(null);
                setLoading(false);
            });

        return () => controller.abort();
    }, [queryString]);

    const { cars, page: currentPage, pages, total } = normalizeCarsResponse(raw);

    return { cars, page: currentPage, pages, total, loading, error };
}

export { DEFAULT_LIMIT as CARS_PAGE_SIZE };
