import { transform } from "../src/transform";
import { baseParse } from "../src/parse";
import { NodeTypes } from "../src/ast";

describe("transform", () => {
  test("happy path", () => {
    const ast = baseParse("<div>hi,{{message}}</div>");

    // 自定义插件，可用通过参数的形式传给函数
    const plugins = (node) => {
        if(node.type === NodeTypes.TEXT){
            node.content = node.content + ' mini-vue'
        }
    };
    transform(ast, {
      nodeTransforms: [plugins],
    });

    const textNode = ast.children[0].children[0]
    expect(textNode.content).toBe('hi, mini-vue')
  });
});
