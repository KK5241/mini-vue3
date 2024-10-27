import { NodeTypes } from "./ast";

const enum Tag {
  START,
  END,
}

export function baseParse(content: string) {
  // 创建一个全局的解析对象
  let stack = [];
  const context = createParserContext(content);
  return createRoot(parserChild(context, stack));
}

function createParserContext(content: string) {
  return {
    sourse: content,
  };
}

// 将解析后的内容放到一个根对象中
function createRoot(children) {
  return {
    children,
  };
}

// 解析
function parserChild(context: { sourse: string }, stack): any {
  const nodes: any = [];
  while (!isEnd(context, stack)) {
    let node;
    if (context.sourse.startsWith("{{")) {
      node = parserInterpolation(context);
    } else if (context.sourse[0] === "<") {
      if (/[a-z]/i.test(context.sourse[1])) {
        node = parserElement(context, stack);
      }
    }

    if (!node) {
      node = parserText(context, stack);
    }
    nodes.push(node);
  }
  return nodes;
}
function isEnd(context, stack) {
  // 2. 遇到结束标签
  // 这里使用栈来存储已经遇到的开始标签，从栈顶开始
  // 如果栈顶匹配说明刚好结束，如果不是栈顶匹配说明，上一个开始标签没有结束标签 要抛出错误
  for (let i = stack.length - 1; i >= 0; i--) {
    const endTag = stack[i].tag;
    if (context.sourse.startsWith(`</${endTag}>`)) {
      return true;
    }
  }

  // 1. 没有内容进行解析了
  return !context.sourse;
}
// 解析插值语法
function parserInterpolation(context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";
  const closeIndex = context.sourse.indexOf(
    closeDelimiter,
    openDelimiter.length
  );
  const contentLength = closeIndex - openDelimiter.length;

  // 走两步去掉 {{
  advanceBy(context, openDelimiter.length);
  const rawcontent = context.sourse.slice(0, contentLength);
  const content = rawcontent.trim();

  // 截取插值的全部，表示这部分处理完
  advanceBy(context, contentLength + closeDelimiter.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

function advanceBy(context: any, length: number) {
  context.sourse = context.sourse.slice(length);
}

function parserElement(context: { sourse: string }, stack): any {
  // 处理开始标签 并返回处理后的对象
  const element: any = parserTag(context, Tag.START);
  stack.push(element);
  element.children = parserChild(context, stack);
  stack.pop();
  // 处理结束标签 不需要返回对象
  if (element.tag === context.sourse.slice(2, 2 + element.tag.length)) {
    parserTag(context, Tag.END);
  } else {
    throw new Error("缺少标签");
  }

  return element;
}
function parserTag(context: { sourse: string }, type) {
  // 利用正则取出 Tag
  const element: any = /^<\/?([a-z]*)/i.exec(context.sourse);

  // 移动删除已经处理的部分
  advanceBy(context, element[0].length);
  advanceBy(context, 1);

  const tag = element[1];

  // 表示当前是处理结束标签 只是为了删除字符串不需要返回结果
  if (type === Tag.END) return;

  return {
    type: NodeTypes.ELEMENT,
    tag: tag,
  };
}

function parserText(context: { sourse: string }, stack): any {
  let endIndex = context.sourse.length;
  let endTag
  
  // 判断是否结束标签
  if (stack.length > 0) {
    endTag = stack[stack.length - 1].tag;
  }

  // 确定截取终点下标，有可能是出现插值 {{ 的时候  也有可能是遇到结束标签
  if (getIndex(context, "{{") !== -1) {
    endIndex = getIndex(context, "{{");
  }
  if (
    getIndex(context, `</${endTag}>`) !== -1 &&
    getIndex(context, `</${endTag}>`) < endIndex
  ) { 
    endIndex = getIndex(context, `</${endTag}>`);
  }

  // 获取 TEXT 部分
  const content = context.sourse.slice(0, endIndex);

  console.log(content);

  // 删除 TEXT 部分
  advanceBy(context, content.length);

  return {
    type: NodeTypes.TEXT,
    content,
  };
}

function getIndex(context, tag) {
  return context.sourse.indexOf(tag);
}
