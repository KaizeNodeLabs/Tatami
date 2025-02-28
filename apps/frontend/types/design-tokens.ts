// Color Tokens
type BaseColors = {
    background: string
    foreground: string
    card: {
      DEFAULT: string
      foreground: string
    }
    popover: {
      DEFAULT: string
      foreground: string
    }
    primary: {
      DEFAULT: string
      foreground: string
      50: string
      100: string
      200: string
      300: string
      400: string
      500: string
      600: string
      700: string
      800: string
      900: string
      950: string
    }
    secondary: {
      DEFAULT: string
      foreground: string
    }
    accent: {
      DEFAULT: string
      foreground: string
    }
    muted: {
      DEFAULT: string
      foreground: string
    }
    destructive: {
      DEFAULT: string
      foreground: string
    }
    success: {
      DEFAULT: string
      foreground: string
    }
    warning: {
      DEFAULT: string
      foreground: string
    }
    info: {
      DEFAULT: string
      foreground: string
    }
    border: string
    input: string
    ring: string
    chart: {
      1: string
      2: string
      3: string
      4: string
      5: string
    }
  }
  
  type Typography = {
    fonts: {
      sans: string[]
      mono: string[]
      display: string[]
    }
    sizes: {
      xs: [size: string, lineHeight: string]
      sm: [size: string, lineHeight: string]
      base: [size: string, lineHeight: string]
      lg: [size: string, lineHeight: string]
      xl: [size: string, lineHeight: string]
      "2xl": [size: string, lineHeight: string]
      "3xl": [size: string, lineHeight: string]
      "4xl": [size: string, lineHeight: string]
      "5xl": [size: string, lineHeight: string]
    }
    weights: {
      normal: number
      medium: number
      semibold: number
      bold: number
    }
  }
  
  // Spacing Tokens
  type Spacing = {
    px: string
    0: string
    0.5: string
    1: string
    2: string
    3: string
    4: string
    4.5: string
    6: string
    8: string
    12: string
    16: string
    18: string
  }
  
  // Border Radius Tokens
  type BorderRadius = {
    sm: string
    md: string
    lg: string
    full: string
  }
  
  // Animation Tokens
  type Animation = {
    "accordion-down": string
    "accordion-up": string
    "fade-in": string
    "fade-out": string
    "slide-in": string
    "slide-out": string
  }
  
  // Combine all tokens
  export type DesignTokens = {
    colors: BaseColors
    typography: Typography
    spacing: Spacing
    borderRadius: BorderRadius
    animation: Animation
  }
  
  export type TokenValue<T> = T extends object 
    ? { [K in keyof T]: TokenValue<T[K]> }
    : string
  
  export type CSSVariable = `var(--${string})`
  
  export type ComponentVariant<T extends Record<string, unknown>> = {
    [K in keyof T]: string | CSSVariable
  }