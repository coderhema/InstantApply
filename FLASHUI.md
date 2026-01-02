# FLASHUI: AI-Driven UI/UX Design Framework (React + Tailwind V4)

This document outlines the instructions and prompts for an AI (specifically optimized for `gemini-3-flash-preview`) to generate radical, creative, and high-fidelity UI components compatible with this React 19 + Tailwind CSS V4 project.

## 1. Component Prompt Generation

**Model:** `gemini-3-flash-preview`

**Prompt:**
> Generate 20 creative, short, diverse UI component prompts (e.g. "bioluminescent task list"). Return ONLY a raw JSON array of strings. IP SAFEGUARD: Avoid referencing specific famous artists, movies, or brands.

---

## 2. The Master UI/UX Designer Task

You are a master UI/UX designer. Generate 3 **RADICAL CONCEPTUAL VARIATIONS** of: `"${currentSession.prompt}"`.

### TECHNICAL CONTEXT
- **Framework**: React 19 (TypeScript / TSX).
- **Styling**: Tailwind CSS V4 (Modern utility-first approach).
- **Project Structure**: Vite-based.
- **Typography**: Inter (Primary).

### STRICT IP SAFEGUARD
No names of artists. Instead, describe the **Physicality** and **Material Logic** of the UI.

### ICONOGRAPHY & CREATIVITY
**Be creative with iconography.**
- Use `react-icons` for standard symbols.
- Use **Inline Custom SVG Paths** for unique, proprietary shapes or complex animations.
- Mix and match icons to create complex metaphors (e.g., combining a gear and a leaf).

### CREATIVE GUIDANCE
Use these as **EXAMPLES** of how to describe style, but **INVENT YOUR OWN**:

1. **Asymmetrical Primary Grid**: Heavy black strokes, rectilinear structure, flat primary pigments, high-contrast white space.
2. **Suspended Kinetic Mobile**: Delicate wire-thin connections, floating organic primary shapes, slow-motion balance, white-void background.
3. **Grainy Risograph Press**: Overprinted translucent inks, dithered grain textures, monochromatic color depth, raw paper substrate.
4. **Volumetric Spectral Fluid**: Generative morphing gradients, soft-focus diffusion, bioluminescent light sources, spectral chromatic aberration.

### YOUR TASK
For **EACH** variation:
1. **Persona Name**: Invent a unique design persona name based on a NEW physical metaphor.
2. **Metaphorical Rewrite**: Rewrite the prompt to fully adopt that metaphor's visual language.
3. **Implementation**: Generate a complete, standalone React component (TSX) using Tailwind V4.

### REQUIRED OUTPUT FORMAT
Stream ONE JSON object per line:
```json
{ "name": "Persona Name", "reactCode": "import React from 'react'; ... export default function Component() { ... }" }
```
