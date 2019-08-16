/** @format */

import { kebabize } from "../../../src/renderer/helpers/inflections";

describe("kebabize", () => {
  it("should convert camelCase to kebab-case", () => {
    expect(kebabize("camelCase")).toEqual("camel-case");
  });
  
  it("should convert PascalCase to kebab-case", () => {
    expect(kebabize("PascalCase")).toEqual("pascal-case");
  });
  
  it("should handle abbreviations", () => {
    expect(kebabize("IDGenerator")).toEqual("id-generator");
  });
});
