# Design System Strategy: High-Velocity Sustainability

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"Kinetic Precision."** 

This is not a standard dashboard; it is a high-performance telemetry interface. It bridges the raw, mechanical aggression of Formula 1 with the ethereal, data-driven aesthetics of a cyberpunk future. To break the "template" look, we move away from static grids. We embrace **intentional asymmetry**, where data modules "clutch" onto the edges of the screen, and **overlapping glass layers** that create a sense of physical cockpit depth. We treat the UI as a heads-up display (HUD), where every pixel serves a tactical purpose in the race toward zero emissions.

---

## 2. Colors & Surface Architecture
The palette is built on "OLED-Perfect" blacks and high-octane neon accents.

*   **Primary (#DC0000):** Used for critical sustainability alerts and high-impact performance metrics.
*   **Secondary (#00FFFF):** Represents the "Electric" future—used for interactive states and flow-based data.
*   **Tertiary (#FF8700):** Used for cautionary data and progress transitions.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. We define space through contrast, not outlines. Boundaries must be established using:
1.  **Background Shifts:** Transitioning from `surface` (#131313) to `surface-container-low` (#1c1b1b).
2.  **Negative Space:** Utilizing the `spacing-16` (3.5rem) or `spacing-20` (4.5rem) tokens to let content breathe.

### Surface Hierarchy & Nesting
Treat the UI as a layered carbon-fiber chassis. 
*   **Base:** `surface-container-lowest` (#0e0e0e) for the deep background.
*   **Mid-Layer:** `surface-container` (#201f1f) for primary content zones.
*   **Top-Layer:** `surface-bright` (#3a3939) for active widgets or hovered states.

### The "Glass & Gradient" Rule
To achieve the "Cyberpunk" aesthetic, use **Frosted Glassmorphism** for floating overlays. Apply `surface-variant` (#353534) at 40% opacity with a `backdrop-filter: blur(20px)`. 

### Signature Textures
Main CTAs must use a linear gradient from `primary` (#ffb4a8) to `primary_container` (#dc0000) at a 135-degree angle. This mimics the light reflecting off a polished F1 car body.

---

## 3. Typography: Technical Authority
We use a high-contrast typographic scale to separate human-readable narrative from machine-generated data.

*   **Display & Headlines (Space Grotesk):** Geometric, wide, and aggressive. These are used for "Track Titles" or "Impact Scores." Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for an editorial, premium feel.
*   **Data & Labels (JetBrains Mono):** For live telemetry, CO2 calculations, and lap times. The monospaced nature ensures numbers don't "jump" during live updates, maintaining technical stability.
*   **Body (Inter):** Reserved for long-form insights. It provides a neutral, highly readable anchor to the more aggressive technical fonts.

---

## 4. Elevation & Depth
In this system, depth is a function of light emission, not just shadow.

*   **The Layering Principle:** Stack `surface-container-low` on `surface` to create a "recessed" look, suggesting the UI is carved out of a matte charcoal block.
*   **Neon Ambient Shadows:** Floating elements (like glassmorphic cards) should not use grey shadows. Use a 4-8% opacity shadow tinted with `secondary` (#00FFFF) or `primary` (#DC0000) with a 40px blur to simulate a neon glow reflecting off the carbon surface.
*   **The "Ghost Border" Fallback:** If containment is required, use the `outline-variant` token at 15% opacity. This creates a "barely-there" structural hint that feels like a laser-etched guide.
*   **Glassmorphism:** Use semi-transparent layers for any component that moves (modals, tooltips, dropdowns). This ensures the "OLED Black" of the background is never fully lost, maintaining the premium dark-mode aesthetic.

---

## 5. Components

### Buttons
*   **Primary:** Solid gradient (`primary` to `primary-container`) with a subtle 2px glow shadow of the same color. 
*   **Secondary:** Ghost style. Transparent background, `secondary` (#00FFFF) "Ghost Border" at 20% opacity, and `label-md` JetBrains Mono text.
*   **Tactile Feedback:** On press, the button should "sink" (scale 0.98) and the glow intensity should double.

### Circular Gauges (The "Telemetry" Component)
*   **Visuals:** Use a 270-degree arc. The track uses `surface-container-highest`. The "fill" uses a gradient from `secondary` (#00FFFF) to `tertiary` (#FF8700) to represent the transition from clean to high-carbon energy.

### Glassmorphic Cards
*   **Structure:** No solid backgrounds. Use `surface-variant` at 30% opacity with `backdrop-filter: blur(12px)`.
*   **Spacing:** Use `spacing-5` (1.1rem) for internal padding to maintain a compact, "cockpit" feel.

### Progress Bars (The "Pulse" Component)
*   **Visuals:** 4px height. The background is `surface-container-lowest`. The active bar is a neon glow of `secondary_fixed`. Include a "lead pixel"—a 100% white dot at the tip of the progress bar to simulate a moving light.

### Input Fields
*   **Style:** Underline only (2px). Use `outline-variant` at 20% opacity. Upon focus, the underline transitions to `secondary` (#00FFFF) with a subtle neon bleed onto the surface below.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Place smaller data labels (`label-sm`) in the corners of large cards to mimic technical blueprints.
*   **Embrace Vantablack:** Use `#000000` for the deepest background layers to save battery on OLED and increase the "pop" of neon elements.
*   **Monospace for Numbers:** Always use JetBrains Mono for any value that changes over time.

### Don't:
*   **Don't use Dividers:** Never use a horizontal line to separate list items. Use a `spacing-4` gap and a subtle background shift on hover.
*   **Don't use Rounded Corners over 12px:** Stay within the `md` (0.375rem) to `xl` (0.75rem) range. This is a precision instrument, not a social media app. Extreme roundness kills the "Motorsport" edge.
*   **Don't use Grey Shadows:** A grey shadow on an OLED black background looks "muddy." If you need lift, use a colored glow or a lighter surface tier.