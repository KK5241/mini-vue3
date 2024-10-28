export function transform(root, options) {
  const context = createTransformContext(root, options);

  transformNode(root, context);
}
function createTransformContext(root: any, options: any) {
  const context = {
    root,
    options,
  };

  return context;
}

function transformNode(node, context) {
  const children = node.children || [];

  const { nodeTransforms } = context.options;

  // 利用插件处理当前节点
  for (let i = 0; i < nodeTransforms.length; i++) {
    const plugin = nodeTransforms[i];
    plugin(node);
  }

  // dfs 遍历每一个节点
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    transformNode(node, context);
  }
}
