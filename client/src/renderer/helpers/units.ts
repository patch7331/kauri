/** @format */

const dpi = 96;
const re = /^(\d+)([a-zA-Z]+)$/;

const convert = (value: number, unit: string) => {
  switch (unit) {
    case "mm":
      return ((value / 2.54) * dpi) / 10;
    case "cm":
      return (value / 2.54) * dpi;
    default:
      throw `Unknown unit '${unit}'.`;
  }
};

/**
 * Convert a CSS length to pixels.
 * @param length A CSS length.
 */
export function convertToPixels(length: string): number {
  const [_, valueStr, unit] = length.toLowerCase().match(re);
  const value = parseFloat(valueStr);
  return convert(value, unit);
}
