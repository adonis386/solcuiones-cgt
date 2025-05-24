"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  description: string;
};

const themes: Theme[] = [
  {
    id: "default",
    name: "Default",
    primary: "from-purple-600",
    secondary: "to-purple-400",
    accent: "bg-purple-700",
    text: "text-white",
    description: "Tema predeterminado"
  },
  {
    id: "dark",
    name: "Dark",
    primary: "from-gray-800",
    secondary: "to-gray-900",
    accent: "bg-gray-900",
    text: "text-white",
    description: "Tema oscuro"
  },
  {
    id: "light",
    name: "Light",
    primary: "from-blue-100",
    secondary: "to-blue-200",
    accent: "bg-blue-500",
    text: "text-gray-900",
    description: "Tema claro"
  },
  {
    id: "protanopia",
    name: "Protanopia",
    primary: "from-blue-600",
    secondary: "to-blue-400",
    accent: "bg-blue-700",
    text: "text-white",
    description: "Tema para Protanopía"
  },
  {
    id: "deuteranopia",
    name: "Deuteranopia",
    primary: "from-cyan-600",
    secondary: "to-cyan-400",
    accent: "bg-cyan-700",
    text: "text-white",
    description: "Tema para Deuteranopía"
  },
  {
    id: "tritanopia",
    name: "Tritanopia",
    primary: "from-amber-600",
    secondary: "to-amber-400",
    accent: "bg-amber-700",
    text: "text-white",
    description: "Tema para Tritanopía"
  }
];

type ThemeContextType = {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const theme = themes.find(t => t.id === savedTheme);
      if (theme) setCurrentTheme(theme);
    }
  }, []);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('theme', themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      <div className="min-h-screen">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 