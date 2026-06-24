import { useContext } from "react";
import ThemeContext from './themeContext.jsx'

export function useTheme() {
    return useContext(ThemeContext);
}