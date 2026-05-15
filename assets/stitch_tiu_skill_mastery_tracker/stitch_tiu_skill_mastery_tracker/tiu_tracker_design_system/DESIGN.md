---
name: TIU Tracker Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444654'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757686'
  outline-variant: '#c5c5d7'
  surface-tint: '#344fd8'
  primary: '#032dbc'
  on-primary: '#ffffff'
  primary-container: '#2e4ad3'
  on-primary-container: '#c9cfff'
  inverse-primary: '#bac3ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#811b1a'
  on-tertiary: '#ffffff'
  tertiary-container: '#a1332f'
  on-tertiary-container: '#ffc3bd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee0ff'
  primary-fixed-dim: '#bac3ff'
  on-primary-fixed: '#00105b'
  on-primary-fixed-variant: '#0f33c0'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb3ac'
  on-tertiary-fixed: '#410003'
  on-tertiary-fixed-variant: '#87201e'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style
The design system is engineered for the high-stakes environment of competitive examinations, specifically focusing on adaptive learning for intelligence tests. The brand personality is **Academic, Precise, and Encouraging**. It balances the rigor of an educational platform with the modern feel of a high-end SaaS product.

The visual style follows a **Corporate / Modern** aesthetic with a strong emphasis on **Minimalism** to reduce cognitive load. This is achieved through generous whitespace, a structured card-based layout, and a functional approach to color where every hue serves a specific informational purpose. The UI seeks to evoke a sense of calm focus and intellectual trust.

## Colors
This design system utilizes a high-contrast palette to distinguish between achievement and growth areas. 

- **Primary (Deep Indigo):** Used for navigation, primary actions, and branding. It represents the "Intelligence" core of the platform.
- **Secondary (Emerald Green):** Reserved exclusively for "Success" states, high accuracy scores, and completed milestones.
- **Tertiary (Coral):** Used for "Areas Needing Improvement." It is softer than a standard error red to encourage learning rather than signaling failure.
- **Neutral (Slate):** A range of greys used for body text, borders, and secondary UI elements to maintain a clean, professional environment.

The system is optimized for a **Light Mode** default to maximize readability during long study sessions, using subtle off-white backgrounds to reduce eye strain.

## Typography
The system uses **Inter** for its exceptional legibility at small sizes and its neutral, systematic appearance. 

The type hierarchy is strictly defined to help users scan exam questions and data dashboards quickly. **Headlines** utilize a tighter letter spacing and heavier weights to command attention, while **Body** text uses a generous 1.6 line height to ensure readability during dense reading comprehension tasks. **Labels** are often used in uppercase with slight letter spacing to differentiate metadata from primary content.

## Layout & Spacing
This design system employs a **Fixed Grid** model for dashboards and exam interfaces to ensure a consistent focal point. A 12-column grid is used for the main container, allowing for flexible card arrangements.

Spacing follows a 4px base scale, emphasizing "Information Density" in exam modes and "Airy Clarity" in dashboard modes. Margins and gutters are kept wide (24px+) to prevent the UI from feeling cluttered, which is essential for maintaining focus during timed assessments.

## Elevation & Depth
Hierarchy is established through **Tonal Layers** and **Ambient Shadows**. 

The background is kept at a low-luminance neutral (`#F8FAFC`), while primary content sits on white surface cards. Shadows are extremely subtle: a soft, diffused blur with low opacity (4-8%) and a slight indigo tint in the shadow color to tie back to the primary brand color. 

- **Level 0 (Flat):** Layout backgrounds.
- **Level 1 (Low):** Standard content cards.
- **Level 2 (Medium):** Hover states for interactive cards or active buttons.
- **Level 3 (High):** Modals, dropdowns, and urgent notifications.

## Shapes
The shape language is defined as **Rounded**, utilizing a 0.5rem (8px) base radius. This softens the professional tone of the platform, making the learning experience feel more accessible and less intimidating. 

Interactive elements like buttons use the base radius, while larger containers (Cards) should utilize `rounded-lg` (16px) to create a clear visual containment of information. Progress bars utilize pill-shaped (fully rounded) end-caps to emphasize movement and completion.

## Components

### Buttons
- **Primary:** Solid Indigo background with white text. High-contrast and prominent.
- **Secondary:** White background with Indigo border and text. 
- **Ghost:** No border, Indigo text. Used for less important actions.

### Cards
Cards are the primary organizational unit. They feature a white background, a 1px soft border (`#E2E8F0`), and a Level 1 shadow. Cards used for "Question Blocks" have increased internal padding (32px) to focus the user on the text.

### Progress Indicators
Linear progress bars should use a neutral light grey track. The fill color is dynamic: Indigo for general progress, Emerald for accuracy targets met, and Coral for sessions requiring more attention.

### Inputs
Text fields use a 1px neutral border that transitions to a 2px Indigo border on focus. Labels sit clearly above the input. Error states utilize Coral for the border and a small supporting text below the field.

### Chips & Tags
Used for categorizing TIU sub-topics (Verbal, Numerical, Figural). These should be low-saturation versions of the primary colors with dark text to maintain professional legibility without overwhelming the page.

### States
- **Success:** Emerald Green background tint with dark green text and a checkmark icon.
- **Warning (Low Score):** Subtle Amber background tint with dark orange text.
- **Neutral Info:** Light Indigo background tint with Primary Indigo text.