import { useEffect, useState } from "react";
import API from "../api/axios";

function toApiPath(url) {
    const base = import.meta.env.VITE_API_URL || '';
    if (base && url.startsWith(base)) {
        const path = url.slice(base.length);
        return path.startsWith('/') ? path : `/${path}`;
    }
    return url.startsWith('/') ? url : `/${url}`;
}

/**
 * Generic GET hook. For car lists use useCarsCatalog — it handles pagination shape.
 * Single-resource responses (e.g. GET /cars/:id) are returned as-is.
 */
const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!url) {
            setLoading(false);
            return undefined;
        }

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        API.get(toApiPath(url), { signal: controller.signal })
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
                setError(err.response?.data?.message || err.message || "Couldn't fetch the data");
                setLoading(false);
            });

        return () => controller.abort();
    }, [url]);

    return [data, error, loading];
};

export default useFetch;
