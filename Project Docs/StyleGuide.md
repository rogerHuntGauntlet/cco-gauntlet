# CCO Style Guide & Component Library

## Overview

This style guide provides the technical specifications, code examples, and implementation details for the CCO design system. It serves as the bridge between design principles and practical implementation for developers who contribute to the CCO platform.

## Table of Contents

1. [Design Tokens](#design-tokens)
2. [Typography](#typography)
3. [Component Library](#component-library)
4. [Layout & Grid System](#layout--grid-system)
5. [Animation & Transitions](#animation--transitions)
6. [Dark Mode Implementation](#dark-mode-implementation)
7. [Accessibility Requirements](#accessibility-requirements)
8. [Code Standards](#code-standards)

## Design Tokens

Design tokens are the foundation of our design system, representing the smallest visual elements such as colors, typography, spacing, and more. These tokens are implemented as CSS variables for easy application and consistency across the platform.

### Color Tokens

```css
:root {
  /* Primary Colors */
  --color-midnight-blue: #121C42;
  --color-electric-indigo: #6016FC;
  --color-cosmic-latte: #FFF8E7;
  
  /* Secondary Colors */
  --color-neon-teal: #00F5D4;
  --color-digital-lavender: #D9C6F5;
  --color-electric-crimson: #FF003C;
  
  /* Neutral Colors */
  --color-obsidian: #1E1E2E;
  --color-cosmic-grey: #2A2A3A;
  --color-stardust: #8B8B9E;
  --color-nebula-white: #E9E9F0;
  
  /* Semantic Colors */
  --color-background-primary: var(--color-midnight-blue);
  --color-background-secondary: var(--color-obsidian);
  --color-background-tertiary: var(--color-cosmic-grey);
  
  --color-text-primary: var(--color-nebula-white);
  --color-text-secondary: var(--color-stardust);
  --color-text-inverted: var(--color-midnight-blue);
  
  --color-accent-primary: var(--color-electric-indigo);
  --color-accent-secondary: var(--color-neon-teal);
  --color-accent-tertiary: var(--color-digital-lavender);
  
  --color-status-success: var(--color-neon-teal);
  --color-status-error: var(--color-electric-crimson);
  --color-status-warning: #FFAA00;
  --color-status-info: #0099FF;
}
```

### Spacing Tokens

```css
:root {
  --space-2: 2px;
  --space-4: 4px;
  --space-8: 8px;
  --space-12: 12px;
  --space-16: 16px;
  --space-24: 24px;
  --space-32: 32px;
  --space-40: 40px;
  --space-48: 48px;
  --space-64: 64px;
  --space-80: 80px;
  --space-96: 96px;
  --space-128: 128px;
}
```

### Radius Tokens

```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-round: 9999px;
}
```

### Shadow Tokens

```css
:root {
  --shadow-sm: 0px 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0px 2px 4px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0px 4px 8px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0px 8px 16px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-inner: inset 0px 1px 2px rgba(0, 0, 0, 0.1);
}
```

## Typography

Our typography system is based on the Inter (sans-serif) and JetBrains Mono (monospace) font families. 

### Font Imports

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
```

### Typography Tokens

```css
:root {
  /* Font Families */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  --font-mono: 'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  
  /* Font Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Font Sizes */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-md: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */
  
  /* Line Heights */
  --line-height-tight: 1.2;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;
  
  /* Letter Spacing */
  --letter-spacing-tight: -0.01em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.01em;
  --letter-spacing-wider: 0.02em;
}
```

### Typography Mixins (SCSS)

```scss
@mixin heading-1 {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

@mixin heading-2 {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

@mixin heading-3 {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-2xl);
  line-height: var(--line-height-snug);
  letter-spacing: var(--letter-spacing-normal);
}

@mixin body-text {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
  letter-spacing: var(--letter-spacing-normal);
}

@mixin body-text-small {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  letter-spacing: var(--letter-spacing-normal);
}

@mixin code-text {
  font-family: var(--font-mono);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  letter-spacing: var(--letter-spacing-normal);
}
```

## Component Library

Our component library provides reusable UI elements with consistent styling and behavior.

### Button Component

#### HTML Structure

```html
<button class="button button--primary">
  <span class="button__text">Button Text</span>
</button>

<button class="button button--secondary">
  <span class="button__text">Button Text</span>
</button>

<button class="button button--tertiary">
  <span class="button__text">Button Text</span>
</button>

<button class="button button--icon">
  <svg class="button__icon" width="24" height="24" viewBox="0 0 24 24">
    <!-- SVG path here -->
  </svg>
</button>
```

#### CSS Implementation

```scss
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 var(--space-16);
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-md);
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-accent-tertiary);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &__text {
    margin: 0 var(--space-8);
  }
  
  &__icon {
    width: 20px;
    height: 20px;
  }
  
  // Primary Button
  &--primary {
    background-color: var(--color-accent-primary);
    color: var(--color-text-primary);
    border: none;
    
    &:hover {
      background-color: lighten(var(--color-accent-primary), 5%);
      transform: translateY(-1px);
    }
    
    &:active {
      background-color: darken(var(--color-accent-primary), 5%);
      transform: translateY(0);
    }
  }
  
  // Secondary Button
  &--secondary {
    background-color: transparent;
    color: var(--color-accent-primary);
    border: 1.5px solid var(--color-accent-primary);
    
    &:hover {
      background-color: rgba(var(--color-accent-primary), 0.05);
      transform: translateY(-1px);
    }
    
    &:active {
      background-color: rgba(var(--color-accent-primary), 0.1);
      transform: translateY(0);
    }
  }
  
  // Tertiary Button
  &--tertiary {
    background-color: transparent;
    color: var(--color-accent-primary);
    border: none;
    padding: 0 var(--space-8);
    
    &:hover {
      text-decoration: underline;
    }
    
    &:active {
      opacity: 0.8;
    }
  }
  
  // Icon Button
  &--icon {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: var(--radius-round);
    background-color: transparent;
    border: none;
    color: var(--color-text-primary);
    
    &:hover {
      background-color: rgba(var(--color-stardust), 0.1);
    }
    
    &:active {
      background-color: rgba(var(--color-stardust), 0.2);
    }
  }
}
```

### Card Component

#### HTML Structure

```html
<div class="card">
  <div class="card__header">
    <h3 class="card__title">Card Title</h3>
    <button class="button button--icon card__action">
      <!-- Icon SVG -->
    </button>
  </div>
  <div class="card__content">
    <!-- Card content here -->
  </div>
  <div class="card__footer">
    <!-- Card footer here -->
  </div>
</div>
```

#### CSS Implementation

```scss
.card {
  background-color: var(--color-background-tertiary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-16);
    border-bottom: 1px solid rgba(var(--color-stardust), 0.1);
  }
  
  &__title {
    margin: 0;
    font-family: var(--font-primary);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-lg);
    color: var(--color-text-primary);
  }
  
  &__content {
    padding: var(--space-16);
  }
  
  &__footer {
    padding: var(--space-16);
    border-top: 1px solid rgba(var(--color-stardust), 0.1);
  }
  
  &__action {
    color: var(--color-text-secondary);
    
    &:hover {
      color: var(--color-text-primary);
    }
  }
}
```

### Input Component

#### HTML Structure

```html
<div class="input-group">
  <label class="input-group__label" for="example-input">Label</label>
  <div class="input-group__wrapper">
    <input 
      type="text" 
      id="example-input" 
      class="input-group__input" 
      placeholder="Placeholder text"
    >
  </div>
  <p class="input-group__helper">Helper text</p>
</div>

<!-- With icon -->
<div class="input-group">
  <label class="input-group__label" for="icon-input">With Icon</label>
  <div class="input-group__wrapper">
    <input 
      type="text" 
      id="icon-input" 
      class="input-group__input" 
      placeholder="Search..."
    >
    <div class="input-group__icon">
      <!-- Search icon SVG -->
    </div>
  </div>
</div>

<!-- Error state -->
<div class="input-group input-group--error">
  <label class="input-group__label" for="error-input">Email</label>
  <div class="input-group__wrapper">
    <input 
      type="email" 
      id="error-input" 
      class="input-group__input" 
      value="invalid-email"
    >
  </div>
  <p class="input-group__error">Please enter a valid email address</p>
</div>
```

#### CSS Implementation

```scss
.input-group {
  margin-bottom: var(--space-16);
  
  &__label {
    display: block;
    margin-bottom: var(--space-8);
    font-family: var(--font-primary);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
  }
  
  &__wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  &__input {
    width: 100%;
    height: 40px;
    padding: 0 var(--space-12);
    background-color: transparent;
    border: 1px solid var(--color-stardust);
    border-radius: var(--radius-md);
    font-family: var(--font-primary);
    font-size: var(--font-size-md);
    color: var(--color-text-primary);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    
    &::placeholder {
      color: var(--color-text-secondary);
      opacity: 0.6;
    }
    
    &:focus {
      outline: none;
      border-color: var(--color-accent-primary);
      box-shadow: 0 0 0 2px rgba(var(--color-accent-primary), 0.2);
    }
  }
  
  &__icon {
    position: absolute;
    right: var(--space-12);
    color: var(--color-text-secondary);
    pointer-events: none;
  }
  
  &__helper {
    margin: var(--space-4) 0 0;
    font-family: var(--font-primary);
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
  }
  
  &__error {
    margin: var(--space-4) 0 0;
    font-family: var(--font-primary);
    font-size: var(--font-size-xs);
    color: var(--color-status-error);
  }
  
  // Error state
  &--error {
    .input-group__input {
      border-color: var(--color-status-error);
      
      &:focus {
        box-shadow: 0 0 0 2px rgba(var(--color-status-error), 0.2);
      }
    }
  }
}
```

## Layout & Grid System

Our layout system is based on a 12-column grid with responsive breakpoints.

### Container

```scss
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-16);
  padding-right: var(--space-16);
  
  @media (min-width: 640px) {
    max-width: 640px;
  }
  
  @media (min-width: 768px) {
    max-width: 768px;
    padding-left: var(--space-24);
    padding-right: var(--space-24);
  }
  
  @media (min-width: 1024px) {
    max-width: 1024px;
    padding-left: var(--space-32);
    padding-right: var(--space-32);
  }
  
  @media (min-width: 1280px) {
    max-width: 1280px;
  }
  
  @media (min-width: 1440px) {
    max-width: 1440px;
  }
}
```

### Grid System

```scss
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-24);
  
  &--gap-sm {
    gap: var(--space-16);
  }
  
  &--gap-lg {
    gap: var(--space-32);
  }
  
  // Column spans
  @for $i from 1 through 12 {
    &__col-#{$i} {
      grid-column: span $i / span $i;
    }
  }
  
  // Responsive column spans
  @media (min-width: 768px) {
    @for $i from 1 through 12 {
      &__col-md-#{$i} {
        grid-column: span $i / span $i;
      }
    }
  }
  
  @media (min-width: 1024px) {
    @for $i from 1 through 12 {
      &__col-lg-#{$i} {
        grid-column: span $i / span $i;
      }
    }
  }
}
```

### Flexbox Utilities

```scss
.flex {
  display: flex;
  
  &--inline {
    display: inline-flex;
  }
  
  &--col {
    flex-direction: column;
  }
  
  &--wrap {
    flex-wrap: wrap;
  }
  
  &--center {
    align-items: center;
    justify-content: center;
  }
  
  &--between {
    justify-content: space-between;
  }
  
  &--around {
    justify-content: space-around;
  }
  
  &--start {
    justify-content: flex-start;
  }
  
  &--end {
    justify-content: flex-end;
  }
  
  &--stretch {
    align-items: stretch;
  }
  
  &--gap-sm {
    gap: var(--space-8);
  }
  
  &--gap-md {
    gap: var(--space-16);
  }
  
  &--gap-lg {
    gap: var(--space-24);
  }
}
```

## Animation & Transitions

We use CSS variables and custom timing functions to create consistent animations throughout the application.

### Animation Tokens

```css
:root {
  /* Durations */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  
  /* Easing Functions */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Transition Mixins

```scss
@mixin transition-base {
  transition-property: color, background-color, border-color, box-shadow, transform;
  transition-duration: var(--duration-normal);
  transition-timing-function: var(--ease-out);
}

@mixin transition-transform {
  transition-property: transform;
  transition-duration: var(--duration-normal);
  transition-timing-function: var(--ease-out);
}

@mixin transition-opacity {
  transition-property: opacity;
  transition-duration: var(--duration-normal);
  transition-timing-function: var(--ease-out);
}

@mixin transition-colors {
  transition-property: color, background-color, border-color;
  transition-duration: var(--duration-normal);
  transition-timing-function: var(--ease-out);
}
```

### Loading Animation

```scss
@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

.loading-pulse {
  animation: pulse 1.5s var(--ease-in-out) infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}
```

## Dark Mode Implementation

Our application supports both light and dark themes. Here's how to implement dark mode:

### CSS Variables for Dark Mode

```css
:root {
  /* Light Mode (Default) */
  --color-background-primary: #FFFFFF;
  --color-background-secondary: #F8F9FB;
  --color-background-tertiary: #EDF0F5;
  
  --color-text-primary: #121C42;
  --color-text-secondary: #6C7693;
  
  /* Other light mode variables... */
  
  /* Dark Mode */
  .dark-mode {
    --color-background-primary: #121C42;
    --color-background-secondary: #1E1E2E;
    --color-background-tertiary: #2A2A3A;
    
    --color-text-primary: #E9E9F0;
    --color-text-secondary: #8B8B9E;
    
    /* Other dark mode variables... */
  }
}
```

### JavaScript Toggle for Dark Mode

```javascript
// Simple dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved user preference or system preference
if (localStorage.getItem('darkMode') === 'true' || 
    (localStorage.getItem('darkMode') === null && prefersDarkScheme.matches)) {
  document.body.classList.add('dark-mode');
  darkModeToggle.checked = true;
}

// Listen for toggle change
darkModeToggle.addEventListener('change', function() {
  if (this.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
  }
});

// Listen for system preference change
prefersDarkScheme.addEventListener('change', function(e) {
  if (localStorage.getItem('darkMode') === null) {
    if (e.matches) {
      document.body.classList.add('dark-mode');
      darkModeToggle.checked = true;
    } else {
      document.body.classList.remove('dark-mode');
      darkModeToggle.checked = false;
    }
  }
});
```

## Accessibility Requirements

All components must meet WCAG 2.1 AA standards. Here are key requirements:

### Focus Management

```scss
// Focus styles
:focus-visible {
  outline: 2px solid var(--color-accent-primary);
  outline-offset: 2px;
}

// For elements where outline doesn't look good
.focus-ring:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-background-primary), 0 0 0 4px var(--color-accent-primary);
}
```

### Keyboard Navigation

```javascript
// Example of keyboard navigation for a dropdown menu
const dropdown = document.querySelector('.dropdown');
const dropdownToggle = dropdown.querySelector('.dropdown__toggle');
const dropdownMenu = dropdown.querySelector('.dropdown__menu');
const dropdownItems = dropdown.querySelectorAll('.dropdown__item');

// Toggle dropdown with keyboard
dropdownToggle.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    this.click();
  }
});

// Navigate dropdown items with keyboard
dropdownMenu.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    
    const activeElement = document.activeElement;
    const currentIndex = Array.from(dropdownItems).indexOf(activeElement);
    let nextIndex;
    
    if (e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % dropdownItems.length;
    } else {
      nextIndex = (currentIndex - 1 + dropdownItems.length) % dropdownItems.length;
    }
    
    dropdownItems[nextIndex].focus();
  }
  
  if (e.key === 'Escape') {
    dropdownToggle.click();
    dropdownToggle.focus();
  }
});
```

### Screen Reader Support

```html
<!-- Example of screen reader friendly toggle button -->
<button 
  class="theme-toggle" 
  id="dark-mode-toggle"
  aria-pressed="false"
  aria-label="Toggle dark mode"
>
  <span class="theme-toggle__icon" aria-hidden="true">
    <!-- Icon SVG -->
  </span>
</button>

<script>
  const toggle = document.getElementById('dark-mode-toggle');
  
  toggle.addEventListener('click', function() {
    const isPressed = this.getAttribute('aria-pressed') === 'true';
    this.setAttribute('aria-pressed', !isPressed);
    
    // Toggle dark mode logic here
  });
</script>
```

## Code Standards

### CSS/SCSS Guidelines

- Follow BEM (Block, Element, Modifier) naming convention
- Use variables for all values defined in design tokens
- Avoid hardcoding values for colors, spacing, etc.
- Group related properties together
- Comment complex or non-obvious code
- Avoid deep nesting (max 3 levels)
- Use utility classes for common patterns

### JavaScript Guidelines

- Use ES6+ features
- Prefer const and let over var
- Use async/await for asynchronous code
- Document functions with JSDoc comments
- Implement appropriate error handling
- Use descriptive variable and function names
- Ensure all interactive elements have keyboard support

### Accessibility Checklist

- All interactive elements are keyboard accessible
- Focus states are clearly visible
- Color is not the only means of conveying information
- Text has sufficient contrast against its background
- Images have appropriate alt text
- Forms have proper labels and error messages
- ARIA attributes are used appropriately

---

This style guide is a living document and will be updated as the CCO platform evolves. All developers are expected to follow these guidelines to maintain consistency and quality across the application. 