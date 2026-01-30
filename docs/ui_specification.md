# UI & UX Specification: Black Neon Theme

## Component Styles

### 1. Selection Cards (Single/Multi Choice)
- **Default State:** Black background, 1px Border `#1A1A1A`.
- **Hover/Active State:** Border changes to `#00FF94` with a `0px 0px 15px rgba(0, 255, 148, 0.3)` outer glow.
- **Icons:** Emoji icons (as per JSON) rendered with high saturation.

### 2. AI Feedback Card (`order_index: 9`)
- **Style:** Glassmorphism. `backdrop-filter: blur(10px)`.
- **Border:** Gradient border from `#00FF94` to `#BCFF00`.
- **Animation:** "Typewriter" effect for the AI-generated text to simulate real-time thinking.

### 3. Progress Bar
- Fixed at the top.
- Color: `#00FF94`.
- Transition: Smooth `ease-in-out` width change.

## Layout
- **Centered Stack:** All questions should be vertically centered to maintain focus.
- **Transitions:** Fade-in/Slide-up animation (200ms) when switching `order_index`.