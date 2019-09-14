/** @format */

export interface StylesMap {
  [property: string]: string;
}

/**
 * Render CSS styles to KCSS styles.
 * @param styles A CSS styles map.
 */
export function renderStyles(styles: StylesMap): StylesMap {
  return styles;
}
