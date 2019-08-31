/** @format */

const dpi = 96;

export function convertToPixels(length) {
  return ((length / 2.54) * dpi) / 10;
}
