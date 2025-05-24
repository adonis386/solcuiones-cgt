"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  description: string;
};

const themes: Theme[] = [
  {
    name: "default",
    primary: "from-purple-600 via-purple-500 to-purple-400",
    secondary: "from-purple-700 via-purple-600 to-purple-500",
    accent: "bg-purple-700",
    background: "bg-white",
    text: "text-white",
    description: "Tema predeterminado"
  },
  {
    name: "protanopia",
    primary: "from-blue-600 via-blue-500 to-blue-400",
    secondary: "from-blue-700 via-blue-600 to-blue-500",
    accent: "bg-blue-700",
    background: "bg-white",
    text: "text-white",
    description: "Tema para Protanopía (dificultad para distinguir rojo-verde)"
  },
  {
    name: "deuteranopia",
    primary: "from-cyan-600 via-cyan-500 to-cyan-400",
    secondary: "from-cyan-700 via-cyan-600 to-cyan-500",
    accent: "bg-cyan-700",
    background: "bg-white",
    text: "text-white",
    description: "Tema para Deuteranopía (dificultad para distinguir verde-rojo)"
  },
  {
    name: "tritanopia",
    primary: "from-amber-600 via-amber-500 to-amber-400",
    secondary: "from-amber-700 via-amber-600 to-amber-500",
    accent: "bg-amber-700",
    background: "bg-white",
    text: "text-white",
    description: "Tema para Tritanopía (dificultad para distinguir azul-amarillo)"
  },
  {
    name: "high-contrast",
    primary: "from-gray-800 via-gray-700 to-gray-600",
    secondary: "from-gray-900 via-gray-800 to-gray-700",
    accent: "bg-gray-900",
    background: "bg-white",
    text: "text-white",
    description: "Tema de alto contraste"
  }
];

type ThemeContextType = {
  currentTheme: Theme;
  setTheme: (themeName: string) => void;
  themes: Theme[];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const theme = themes.find(t => t.name === savedTheme);
      if (theme) setCurrentTheme(theme);
    }
  }, []);

  const setTheme = (themeName: string) => {
    const theme = themes.find(t => t.name === themeName);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('theme', themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      <div className={`min-h-screen ${currentTheme.background}`}>
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