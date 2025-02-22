import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";

describe("Parse", () => {
  describe("interpolation", () => {
    test("simple interpolation", () => {
      const ast = baseParse("{{ message }}");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: "message",
        },
      });
    });
  });

  describe("element", () => {
    test("simple element", () => {
      const ast = baseParse("<div></div>");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [],
      });
    });
  });

  describe("text", () => {
    test("simple text", () => {
      const ast = baseParse("some content");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content: "some content",
      });
    });
  });

  test("hello world", () => {
    const ast = baseParse("<div>hi,{{message}}</div>");
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: "div",
      children: [
        {
          type: NodeTypes.TEXT,
          content: "hi,",
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: "message",
          },
        },
      ],
    });
  });

  test("other possible", () => {
    const ast = baseParse("<div><p>hi</p>{{message}}</div>");
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: "div",
      children: [
        {
          type: NodeTypes.ELEMENT,
          tag: "p",
          children: [
            {
              type: NodeTypes.TEXT,
              content: "hi",
            },
          ],
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: "message",
          },
        },
      ],
    });
  });

  test("should throw error when lack endTag", () => {
    expect(() => {
      baseParse("<div><span></div>");
    }).toThrow("缺少标签");
  });
});
