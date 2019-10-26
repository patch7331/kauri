/** @format */

import { translateKDFNode } from "./translateKDF";

describe("translate KDF node", () => {
  it("should translate a KDF text node", () => {
    const node = {
      type: "Text",
      content: "Hello, world!",
    };

    const expectedId = 1;
    const expected = {
      id: expectedId,
      type: "Text",
      content: "Hello, world!",
    };

    const nextId = () => expectedId;
    const addToById = node => expect(node).toEqual(expected);

    expect(translateKDFNode(node, nextId, addToById)).toEqual(expectedId);
  });

  it("should translate KDF string shorthand", () => {
    const node = "Hello, world!";
    const expectedId = 1;
    const expected = {
      id: expectedId,
      type: "Text",
      content: "Hello, world!",
    };

    const nextId = () => expectedId;
    const addToById = node => expect(node).toEqual(expected);

    expect(translateKDFNode(node, nextId, addToById)).toEqual(expectedId);
  });

  it("should handle nested KDF nodes", () => {
    const node = {
      type: "Paragraph",
      children: [
        "The quick brown fox ",
        {
          type: "Span",
          styles: { textDecoration: "underline" },
          children: ["jumps"],
        },
        " over the lazy dog.",
      ],
    };

    const expectedId = 0;
    const expected = {
      id: expectedId,
      type: "Paragraph",
      children: [1, 2, 4],
    };

    let id = 0;
    const nextId = () => id++;
    const addToById = node => {
      if (node.id === expectedId) {
        expect(node).toEqual(expected);
      }
    };

    expect(translateKDFNode(node, nextId, addToById)).toEqual(expectedId);
  });
});
