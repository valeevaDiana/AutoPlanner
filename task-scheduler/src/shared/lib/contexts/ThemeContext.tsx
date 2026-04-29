import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Theme } from "./theme.types";
import { predefinedThemes } from "./theme.constants";
import { ThemeContext } from "./themeContextInstance";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("calendar-theme");
    if (savedTheme) {
      try {
        return JSON.parse(savedTheme);
      } catch (error) {
        console.error("Error parsing saved theme:", error);
        return predefinedThemes[0];
      }
    }
    return predefinedThemes[0];
  });

  const [customThemes, setCustomThemes] = useState<Theme[]>(() => {
    const savedCustomThemes = localStorage.getItem("calendar-custom-themes");
    if (savedCustomThemes) {
      try {
        return JSON.parse(savedCustomThemes);
      } catch (error) {
        console.error("Error parsing custom themes:", error);
        return [];
      }
    }
    return [];
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const isFirstRender = React.useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      applyThemeToDOM(currentTheme);
      return;
    }

    localStorage.setItem("calendar-theme", JSON.stringify(currentTheme));
    applyThemeToDOM(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem(
      "calendar-custom-themes",
      JSON.stringify(customThemes),
    );
  }, [customThemes]);

  const applyThemeToDOM = (theme: Theme) => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    root.style.setProperty(
      "--priority-completed-bg",
      theme.colors.priorityCompleted,
    );
    root.style.setProperty(
      "--priority-completed-text",
      theme.colors.priorityCompletedText,
    );
    root.style.setProperty("--calendar-header-bg", theme.colors.calendarHeader);
    root.style.setProperty(
      "--calendar-navigation-bg",
      theme.colors.calendarNavigation,
    );
  };

  const setTheme = (themeName: string) => {
    const allThemes = [...predefinedThemes, ...customThemes];
    const theme = allThemes.find((t) => t.name === themeName);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  const addCustomTheme = (theme: Theme) => {
    setCustomThemes((prev) => [...prev, theme]);
    setCurrentTheme(theme);
  };

  const updateCurrentTheme = (colors: Partial<Theme["colors"]>) => {
    setCurrentTheme((prev) => ({
      ...prev,
      colors: { ...prev.colors, ...colors },
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        customThemes,
        setTheme,
        addCustomTheme,
        updateCurrentTheme,
        isCustomizerOpen,
        setIsCustomizerOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
