import { computed } from "../computed";
import { reactive } from "../reactive";
import { ref } from "../ref";

describe("computed", () => {
  it("happy path", () => {
    const a = ref(1);
    const addA = computed(() => {
      return a.value + 1;
    });
    expect(addA.value).toBe(2);
    a.value = 2;
    expect(addA.value).toBe(3);
  });

  it("should compute lazily", () => {
    const value = reactive({
      foo: 1,
    });
    const getter = jest.fn(() => {
      return value.foo;
    });

    const cValue = computed(getter);

    // lazy
    expect(getter).not.toHaveBeenCalled();
    expect(cValue.value).toBe(1);
    //调用取值后执行一遍
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute until needed
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);
    // 总的来说，就是当我们响应式函数发生改变时，我们触发依赖函数，只有当我们使用计算属性时我们才去触发函数重新获取值
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
