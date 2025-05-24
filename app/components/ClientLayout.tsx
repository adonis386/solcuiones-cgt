"use client";

import { useTheme } from './ThemeProvider';
import ThemeSelector from './ThemeSelector';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { currentTheme } = useTheme();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.primary} ${currentTheme.secondary}`}>
      <ThemeSelector />
      {children}
    </div>
  );
} 