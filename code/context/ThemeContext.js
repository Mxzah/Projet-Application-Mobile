import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    const lightTheme = {
        background: "#ffffff",
        card: "#ffffff",
        text: "#111827",
        textLight: "#6b7280",
        border: "#e5e7eb",
        primary: "#1877f2",
        primaryLight: "#e6f0ff",
        inputBackground: "#f9fafb",
        // ...
    };

    const darkTheme = {
        background: "#020617",
        card: "#0b1220",
        text: "#e5e7eb",
        textLight: "#9ca3af",
        border: "#1f2937",
        primary: "#60a5fa",
        primaryLight: "#1d3b66",
        inputBackground: "#1f2937",
        // ...
    };


    const theme = isDark ? darkTheme : lightTheme;

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook pratique
export const useTheme = () => useContext(ThemeContext);
