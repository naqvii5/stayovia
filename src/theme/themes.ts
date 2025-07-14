export type Mode = "light" | "dark";
export type ThemeName = "green" | "red" | "blue" | "default";
export type LogoPosition = "left" | "right";

export interface ThemeFonts {
  primaryHeading: string;
  secondaryHeading: string;
  primaryText: string;
  secondaryText: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  mainBackground: string;
  primaryHeading: string;
  primaryHeadingRevert: string;
  secondaryHeading: string;
  primaryText: string;
  secondaryText: string;
  header: string;
  footer: string;
}

export interface FontSizes {
  xsmall: string;
  small: string;
  medium: string;
  large: string;
  xlarge: string;
  xxlarge: string;
}

export interface Breakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
  largeDesktop: string;
  xLargeDesktop: string;
}

export interface AppTheme {
  logoPosition: LogoPosition;
  fonts: ThemeFonts;
  colors: ThemeColors;
  fontSizes: FontSizes;
  breakpoints: Breakpoints;
  mode: Mode;
  theme: ThemeName;
}

// Base UI structure per mode
const baseColors = {
  light: {
    // mainBackground: "#ffffff",
    mainBackground: "#ffffff",
    whiteText: "#ffffff",
    primaryHeading: "#1a1a1a",
    secondaryHeading: "#333333",
    primaryHeadingRevert: "#ffffff",
    primaryText: "#1a1a1a",
    secondaryText: "#444444",
    header: "#f8fafc",
    footer: "#f1f5f9",
    cardColor: "#ffffff",
    cardColor2: "#f5f5f5",
  },
  dark: {
    mainBackground: "#1a1a1a",
    whiteText: "#ffffff",
    primaryHeading: "#ffffff",
    secondaryHeading: "#dddddd",
    primaryHeadingRevert: "#1a1a1a",
    primaryText: "#ffffff",
    secondaryText: "#cccccc",
    header: "#0f172a",
    footer: "#1e293b",
    cardColor: "#272a32",
    cardColor2: "#1a1a1a",
  },
};

const fontSizes: FontSizes = {
  xsmall: "1.2rem",
  small: "1.5rem",
  medium: "1.75rem",
  large: "2.0rem",
  xlarge: "2.3rem",
  xxlarge: "3.0rem",
};

const breakpoints: Breakpoints = {
  mobile: "450px",
  tablet: "768px",
  desktop: "1024px",
  largeDesktop: "1450px",
  xLargeDesktop: "1920px",
};

const defaultFonts: ThemeFonts = {
  primaryHeading: "Helvetica",
  secondaryHeading: "Helvetica",
  primaryText: "Helvetica",
  secondaryText: "Helvetica",
};
const defaultFonts1: ThemeFonts = {
  primaryHeading: "Poppins, sans-serif",
  secondaryHeading: "Roboto, sans-serif",
  primaryText: "Inter, sans-serif",
  secondaryText: "Arial, sans-serif",
};

export const themePresets: Record<ThemeName, { primary: string; secondary: string; logoPosition: LogoPosition }> = {
  default: {
    primary: "#132057",
    // secondary: "#FFFFFF",
    secondary: "#e6303c",
    logoPosition: "left",
  },
  green: {
    primary: "#184e3b",
    secondary: "#917c4d",
    logoPosition: "left",
  },
  red: {
    primary: "#ef4444",
    secondary: "#fca5a5",
    logoPosition: "right",
  },
  blue: {
    primary: "#3b82f6",
    secondary: "#93c5fd",
    logoPosition: "left",
  },
};

export const generateTheme = (theme: ThemeName, mode: Mode): AppTheme => {

  const preset = themePresets[theme];
  const base = baseColors[mode];
  // Dynamically override secondary for default in dark mode:
  const computedSecondary =
    theme === 'default' && mode === 'dark'
      ? '#000000'           // black in dark mode
      : preset.secondary;   // otherwise whatever you set (e.g. white)
  return {
    logoPosition: preset.logoPosition,
    fonts: defaultFonts,
    colors: {
      ...base,
      primary: preset.primary,
      secondary: computedSecondary,
    },
    fontSizes,
    breakpoints,
    mode,
    theme,
  };
};
