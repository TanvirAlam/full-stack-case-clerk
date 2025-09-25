import 'styled-components';

// Extend DefaultTheme interface
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
      gray: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
      success: {
        50: string;
        100: string;
        500: string;
        600: string;
        700: string;
      };
      warning: {
        50: string;
        100: string;
        500: string;
        600: string;
        700: string;
      };
      error: {
        50: string;
        100: string;
        500: string;
        600: string;
        700: string;
      };
      priority: {
        low: string;
        medium: string;
        high: string;
      };
      white: string;
      black: string;
      transparent: string;
    };
    typography: {
      fonts: {
        primary: string;
        mono: string;
      };
      fontSizes: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
      };
      fontWeights: {
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
      };
      lineHeights: {
        tight: number;
        normal: number;
        relaxed: number;
      };
      letterSpacing: {
        tight: string;
        normal: string;
        wide: string;
      };
    };
    spacing: {
      0: string;
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      6: string;
      8: string;
      10: string;
      12: string;
      16: string;
      20: string;
      24: string;
    };
    borderRadius: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      full: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      inner: string;
      focus: string;
      none: string;
    };
    zIndices: {
      hide: number;
      auto: string;
      base: number;
      docked: number;
      dropdown: number;
      sticky: number;
      banner: number;
      overlay: number;
      modal: number;
      popover: number;
      skipLink: number;
      toast: number;
      tooltip: number;
    };
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
    animations: {
      durations: {
        fast: string;
        normal: string;
        slow: string;
      };
      easings: {
        easeOut: string;
        easeIn: string;
        easeInOut: string;
      };
    };
    components: {
      button: {
        height: {
          sm: string;
          md: string;
          lg: string;
        };
        padding: {
          sm: string;
          md: string;
          lg: string;
        };
      };
      input: {
        height: {
          sm: string;
          md: string;
          lg: string;
        };
        padding: string;
      };
      card: {
        padding: string;
        borderRadius: string;
        shadow: string;
      };
      toast: {
        width: string;
        padding: string;
        borderRadius: string;
      };
    };
  }
}