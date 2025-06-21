// src/theme/ThemeProvider.tsx

import React, { createContext, useContext, useState, useMemo } from "react";
import { ThemeProvider as StyledProvider } from "styled-components";
import { generateTheme, ThemeName, Mode } from "./themes";

type ThemeContextType = {
  theme: ThemeName;
  mode: Mode;
  toggleTheme: (theme: ThemeName) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext not available");
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeName>("default");
  const [mode, setMode] = useState<Mode>(    localStorage.getItem("mode") === "dark" ? "dark" : "light"
);

  const toggleTheme = (newTheme: ThemeName) => {
    // console.log(`Toggling theme to: ${newTheme}`);
    setTheme(newTheme);
  };
  
  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    // console.log(`Toggling mode to: ${newMode}`);
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  };

  const themeObject = useMemo(() => generateTheme(theme, mode), [theme, mode]);

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, toggleMode }}>
      <StyledProvider theme={themeObject}>{children}</StyledProvider>
    </ThemeContext.Provider>
  );
};
