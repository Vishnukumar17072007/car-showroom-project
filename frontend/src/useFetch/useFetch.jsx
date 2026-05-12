import { useEffect, useState } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        setLoading(true);
        setError(null);
        
        fetch(url, {
            signal,
            credentials: 'include'   // ← add this
        })
        .then(response => {
            if(!response.ok){
                throw Error("Couldn't fetch the data");
            }
            return response.json()
        })
        .then(data => {
            setData(data);
            setLoading(false);
        })
        .catch(err => {
            if (err.name === "AbortError") return;
                setError(err.message);
                setLoading(false);
        })

        return ()=>{
            controller.abort();
        }
    },[url]);
    return [data, error, loading];
}

export default useFetch;