"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../src/context/ThemeContext";
import Grainient from "./Grainient";

// Light green to white shade for light mode
const LIGHT_MODE_COLORS = [
  "#ffffff", // Clean white base
  "#f0fdf4", // Mint cream (emerald-50)
  "#dcfce7", // Soft pastel green (green-100)
  "#bbf7d0", // Fresh foliage green (green-200)
  "#86efac", // Light spring leaf green (green-300)
];

// Dark green to black shade for dark mode
const DARK_MODE_COLORS = [
  "#000000", // Deep black base
  "#050e08", // Dark onyx green
  "#0b1c11", // Deep midnight pine
  "#122e1c", // Dark emerald green
  "#1b492d", // Deep forest green
  "#23643d", // Rich dark foliage highlight
];

export default function BackgroundGrainient() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : false;
  const currentColors = isDark ? DARK_MODE_COLORS : LIGHT_MODE_COLORS;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-700"
      aria-hidden="true"
    >
      <Grainient
        colors={currentColors}
        type="linear"
        angle={55}
        bands={1.5}
        softness={0.9}
        flow={0.5}
        scale={1.4}
        speed={0.12}
        silk={0.2}
        grainAmount={0.04}
        grainSize={1.5}
        grainAnimated={false}
        interactive={false}
        clickSwirl={false}
        intro={true}
        className="w-full h-full"
      />
    </div>
  );
}
