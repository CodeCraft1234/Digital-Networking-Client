import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  const toggleTheme = (newTheme) => {
    document.documentElement.classList.remove(theme); // Remove the previous theme
    setTheme(newTheme); // Set the new theme
    document.documentElement.classList.add(newTheme); // Add the new theme class to the <html> tag
    localStorage.setItem("theme", newTheme); // Persist the theme in localStorage
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
