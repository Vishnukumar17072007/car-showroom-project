import { useContext } from "react";
import { SearchContext } from "./searchContext";

export function useSearch(){
    return useContext(SearchContext);
}