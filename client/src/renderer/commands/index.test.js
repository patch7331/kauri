/** @format */

import {getJSON} from "./index.js";

describe("getJSON", () => {
  it("should log the entire JSON, then the copy array, then return the paste array", async () => {
    const result = await getJSON();
    expect(result).toEqual("hello");
  });
});
