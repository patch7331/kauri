/** @format */

const KEBAB_REGEX = /[A-Z]{2,}(?=[A-Z][a-z]+|\b)|[A-Z]?[a-z]+|[A-Z]/g;

/**
 * Convert a camelCase string into a kebab-case string.
 * @param {String} str String to convert to kebab-case.
 * @return {String} Kebab-case string.
 */
export function kebabize(str) {
  return str
    .match(KEBAB_REGEX)
    .map(group => group.toLowerCase())
    .join("-");
}
