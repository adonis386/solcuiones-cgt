"use client";

import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';

export default function ThemeSelector() {
  const { currentTheme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${currentTheme.accent} text-white p-2 rounded-lg shadow-lg hover:opacity-90 transition-opacity`}
        aria-label="Cambiar tema"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
          <div className="max-h-[60vh] overflow-y-auto">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setTheme(theme.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-700 transition-colors ${
                  currentTheme.id === theme.id ? 'bg-gray-700' : ''
                }`}
              >
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.primary} ${theme.secondary}`} />
                <span className="text-sm text-white">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 