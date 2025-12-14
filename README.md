# Asha Abdulrahman — CFO Portfolio

A sophisticated, minimalist personal portfolio website for Asha Abdulrahman, Chief Financial Officer at Island Tech Solution.

## 🎯 Design Philosophy

This portfolio embodies **luxury through simplicity** — a digital presence that reflects trust, intelligence, discipline, and executive confidence. Every element is intentional, refined, and purpose-driven.

### Key Design Principles
- **Minimalist & Elegant**: Clean lines, generous white space, no visual clutter
- **Executive Confidence**: Typography and layout that commands respect
- **Subtle Refinement**: Animations and interactions that feel intentional
- **Mobile-First**: Responsive design that works beautifully on all devices

## 🎨 Visual Identity

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Off-White | `#FAFAFA` | Primary background |
| Surface White | `#FFFFFF` | Cards, surfaces |
| Charcoal | `#1A1A1A` | Primary text |
| Navy | `#1E2A3A` | CTA buttons, contact section |
| Warm Gold | `#B8977E` | Accent color (used sparingly) |

### Typography
- **Serif**: Cormorant Garamond — Headlines, name, quotes
- **Sans-serif**: Inter — Body text, navigation, labels

## 📁 Project Structure

```
/
├── index.html          # Main HTML document
├── styles.css          # Complete styling
├── script.js           # Subtle interactions
├── assets/
│   └── Asha_Abdulrahman_CV.pdf  # CV download (add your file)
└── README.md           # This file
```

## 🚀 Getting Started

### Option 1: Direct Open
Simply open `index.html` in your browser.

### Option 2: Local Server
For development with live reload:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## 📱 Sections

1. **Hero**: Name, title, personal statement, and CTAs
2. **About**: Professional summary with key metrics
3. **Experience**: Career timeline with highlighted achievements
4. **Core Expertise**: Six key competency areas
5. **Education**: Degrees and professional certifications
6. **Contact**: Email, LinkedIn, and contact form

## ✨ Features

- **Smooth Navigation**: Fixed header with scroll-aware styling
- **Mobile Menu**: Clean hamburger menu for mobile devices
- **Subtle Animations**: Fade-in effects on scroll (respects `prefers-reduced-motion`)
- **Form Validation**: Client-side validation with user feedback
- **Active Section Highlighting**: Navigation reflects current scroll position
- **Accessibility**: Semantic HTML, keyboard navigation, screen reader friendly

## 🛠 Customization

### Adding Your CV
Place your CV file in the `assets` folder:
```
assets/Asha_Abdulrahman_CV.pdf
```

### Updating Content
All content is in `index.html`. Update:
- Personal information in the hero section
- About text and metrics
- Experience timeline entries
- Education and certifications
- Contact information

### Modifying Colors
Edit CSS custom properties in `styles.css`:

```css
:root {
    --color-accent: #B8977E;  /* Change accent color */
    --color-navy: #1E2A3A;    /* Change dark sections */
    /* ... */
}
```

## 📊 Performance

- **No external dependencies** (except Google Fonts)
- **Minimal JavaScript** (~4KB unminified)
- **Optimized CSS** using custom properties
- **Lazy animations** via Intersection Observer

## 🌐 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📄 License

© 2024 Asha Abdulrahman. All rights reserved.

---

*Designed for executive presence. Built with precision.*
