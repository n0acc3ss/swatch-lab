<div align="center">
  <img src="https://github.com/n0acc3ss/swatch-lab/blob/main/assets/logo_swatchlab.webp?raw=true" width="340" alt="Swatch Lab logo" />

  # Swatch Lab

  **Color Swatches & Palette Analyzer.**
  <br/>
  No upload. No server. No build step.

  [![Live app](https://img.shields.io/badge/live_app-launch-2ea44f?style=for-the-badge)](https://n0acc3ss.github.io/swatch-lab/)
  [![License: GPL v3](https://img.shields.io/badge/license-GPL--3.0-blue?style=for-the-badge)](LICENSE)
</div>

<br/>

A modern, high-fidelity static HTML/CSS/JS single-page application (SPA) that acts as a comprehensive color swatch catalog, real-time analyzer, and visual contrast checker.
The user interface specifically replicates the cyberpunk dark-grid aesthetic of the `al.homelab` homepage, using matching custom fonts, ambient glowing blobs, scanline overlay, and grid patterns.

---

## 🚀 Getting Started

Simply open [swatchlab webapp](https://n0acc3ss.github.io/swatch-lab/) in any modern web browser. The app runs completely on the client side with **zero external server dependencies**.

---

## 🎨 Layout & Key Features

### 1. Left Panel (Inputs & Catalog)
- **Interactive Color Input Card**:
  - Contains a styled color picker alongside manual text fields for HEX (e.g. `#F03CA8`) and RGB values (e.g. `240, 60, 168`).
  - Inputs are bi-directionally bound and sync in real-time.
- **HTML Named Colors catalog**:
  - Dynamically renders all 140 standard CSS/HTML color names (AliceBlue, Tomato, SteelBlue, etc.).
  - Categorized into Warm, Cool, Neutral, and All tabs.
  - Features a real-time fuzzy text search. Clicking any swatch loads it as the active color.
- **Pink Lover's Core Card 🌸**:
  - Curated deck of quick-access pink color templates (Neon Pink, Sakura, Barbie, Bubblegum, Rose Gold, Dusty Rose).
  - **"Pinkify" Modifier**: Snaps the active color's HSL hue to $330^\circ$ (the ideal pink spectrum), forces saturation high ($\ge 85\%$), and balances lightness to create a custom pink aesthetic.

### 2. Right Panel (Analytics & Generation)
- **Core Values**:
  - Displays formatted code output readouts (HEX, RGB) that copy to clipboard with a single click.
  - Evaluates and displays web-safe compliance with a "Snap to nearest Web-Safe" helper.
- **Complementary Contrast Sandbox**:
  - Calculates the complementary color (inverse of active color).
  - Previews two-way readability:
    1. Active color text on complementary background.
    2. Complementary text on active color background.
  - Automatically calculates relative luminance to determine WCAG contrast ratios and AA/AAA compliance ratings.
- **Tonal Shades Grid**:
  - Generates 5 lighter and 5 darker shades using linear interpolation (LERP) between the active color and pure white/black.
  - Clicking any generated block loads it as the active color.
- **Triadic Color harmony**:
  - Converts active RGB to HSL and maps the triadic color harmonies (offsets of $+120^\circ$ and $+240^\circ$ Hue angles).
  - Allows direct values copying.

---

## 📐 Color Math Reference

### Complementary (Inversion)
$$R_{comp} = 255 - R$$
$$G_{comp} = 255 - G$$
$$B_{comp} = 255 - B$$

### Triadic Harmony (HSL rotation)
$$H_1 = (H + 120) \bmod 360$$
$$H_2 = (H + 240) \bmod 360$$

### Web-Safe Checking & Snapping
A color is web-safe if its channel values are multiples of 51:
$$Channel_{safe} = \text{round}\left(\frac{Channel}{51}\right) \times 51$$

### Relative Luminance & Contrast (WCAG Standard)
$$L = 0.2126 \times R_{linear} + 0.7152 \times G_{linear} + 0.0722 \times B_{linear}$$
$$\text{Contrast Ratio} = \frac{L_{brightest} + 0.05}{L_{darkest} + 0.05}$$
*(where linear channels are scaled and gamma-corrected)*.
