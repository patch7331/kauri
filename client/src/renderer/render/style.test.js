/** @format */

import { renderStyle } from "./style";

describe("Convert object to css string using renderStyle", () => {
  it("Convert object to css string", () => {
    const style = {
      body: {
        display: "Body Text",
        styles: {
          fontFamily: "Inter, sans-serif",
        },
      },
      h1: {
        styles: {
          color: "#111",
          padding: "4em 0 1em",
        },
      },
    };

    const expected =
      ".__editor__body { font-family: Inter, sans-serif; }" +
      ".__editor__h1 { color: #111; padding: 4em 0 1em; }";

    expect(renderStyle(style)).toEqual(expected);
  });
});
