// src/theme/media.ts

import { Breakpoints } from "./themes";

export const media = (breakpoints: Breakpoints) => ({
  mobile: (styles: string) => `@media (max-width: ${breakpoints.mobile}) { ${styles} }`,
  tablet: (styles: string) => `@media (max-width: ${breakpoints.tablet}) { ${styles} }`,
  desktop: (styles: string) => `@media (min-width: ${breakpoints.desktop}) { ${styles} }`,
  largeDesktop: (styles: string) => `@media (min-width: ${breakpoints.largeDesktop}) { ${styles} }`,
  xLargeDesktop: (styles: string) => `@media (min-width: ${breakpoints.xLargeDesktop}) { ${styles} }`,
});
