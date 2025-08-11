/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";

const initialState = {
  theme: "dark",
  setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored && stored !== "system" ? stored : defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    root.classList.add(theme);
  }, [theme]);

  const setTheme = (newTheme) => {
    if (newTheme !== "system") {
      localStorage.setItem(storageKey, newTheme);
      setThemeState(newTheme);
    }
  };

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
