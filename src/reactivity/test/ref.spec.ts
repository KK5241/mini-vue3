import { effect } from "../effect";
import { ref } from "../ref";

describe("ref", () => {
  it("happy path", () => {
    const x = ref(1);
    expect(x.value).toBe(1);
  });

  it("modify", () => {
    const x = ref(1);
    let dummy;
    let count = 0;
    effect(() => {
      count++;
      dummy = x.value;
    });
    expect(dummy).toBe(1);
    expect(count).toBe(1);
    x.value = 2;
    expect(dummy).toBe(2);
    expect(count).toBe(2);
    //重新赋予相同的值不会再次触发函数
    x.value = 2;
    expect(dummy).toBe(2);
    expect(count).toBe(2);
  });

  it("should make nested properties reactive", () => {
    const x = ref({ foo: 1 });
    let dummy;
    effect(() => {
      dummy = x.value.foo;
    });
    expect(dummy).toBe(1);
    x.value.foo++;
    expect(dummy).toBe(2);
  });
});
