import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    const lightTheme = {
        background: "#f4f4f4",
        card: "white",
        text: "#222",
        textLight: "#666",
        primary: "#1877f2",
    };

    const darkTheme = {
        background: "#1a1a1a",
        card: "#2a2a2a",
        text: "white",
        textLight: "#cccccc",
        primary: "#4d9bf0",
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
