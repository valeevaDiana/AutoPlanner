import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ThemeContextType, Theme } from './theme.types';
import { predefinedThemes } from './theme.constants';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(predefinedThemes[1]);
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('calendar-theme');
    const savedCustomThemes = localStorage.getItem('calendar-custom-themes');
    
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setCurrentTheme(theme);
      } catch (error) {
        console.error('Error loading saved theme:', error);
      }
    }
    
    if (savedCustomThemes) {
      try {
        const themes = JSON.parse(savedCustomThemes);
        setCustomThemes(themes);
      } catch (error) {
        console.error('Error loading custom themes:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar-theme', JSON.stringify(currentTheme));
    applyThemeToDOM(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('calendar-custom-themes', JSON.stringify(customThemes));
  }, [customThemes]);

  const applyThemeToDOM = (theme: Theme) => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
    });

    
    root.style.setProperty('--priority-low-bg', theme.colors.priorityLow);
    root.style.setProperty('--priority-low-text', theme.colors.priorityLowText);
    root.style.setProperty('--priority-medium-bg', theme.colors.priorityMedium);
    root.style.setProperty('--priority-medium-text', theme.colors.priorityMediumText);
    root.style.setProperty('--priority-high-bg', theme.colors.priorityHigh);
    root.style.setProperty('--priority-high-text', theme.colors.priorityHighText);
    root.style.setProperty('--priority-completed-bg', theme.colors.priorityCompleted);
    root.style.setProperty('--priority-completed-text', theme.colors.priorityCompletedText);
    
    root.style.setProperty('--calendar-header-bg', theme.colors.calendarHeader);
    root.style.setProperty('--calendar-navigation-bg', theme.colors.calendarNavigation);
    };


  const setTheme = (themeName: string) => {
    const allThemes = [...predefinedThemes, ...customThemes];
    const theme = allThemes.find(t => t.name === themeName);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  const addCustomTheme = (theme: Theme) => {
    setCustomThemes(prev => [...prev, theme]);
    setCurrentTheme(theme);
  };

  const updateCurrentTheme = (colors: Partial<Theme['colors']>) => {
    setCurrentTheme(prev => ({
      ...prev,
      colors: { ...prev.colors, ...colors }
    }));
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      customThemes,
      setTheme,
      addCustomTheme,
      updateCurrentTheme,
      isCustomizerOpen,
      setIsCustomizerOpen
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};