import { effect,stop } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  it("happy path", () => {
    const obj = reactive({
      foo: 1,
    });

    let acticveValue;
    effect(() => {
      acticveValue = obj.foo + 1;
    });

    expect(acticveValue).toBe(2);

    obj.foo++;

    expect(acticveValue).toBe(3);
  });
  it("should return runner", () => {
    let x = 1;
    const fn = effect(() => {
      x++;
      return "foo";
    });

    expect(x).toBe(2);
    const m = fn();
    expect(x).toBe(3);
    expect(m).toBe("foo");
  });

  it("scheduler", () => {
    let dummy;
    let run;
    const scheduler = jest.fn(() => {
      run = runner;
    });

    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo + 1;
        return "foo";
      },
      {
        scheduler,
      }
    );
    expect(dummy).toBe(2);
    expect(scheduler).not.toHaveBeenCalled();
    obj.foo++;
    expect(dummy).not.toBe(3);
    expect(scheduler).toHaveBeenCalledTimes(1);
    const res = run();
    expect(dummy).toBe(3);
    expect(res).toBe("foo");
  });

  it('stop',()=>{
    let dummy
    let obj = reactive({foo:1})
    const runner = effect(()=>{
      dummy = obj.foo + 1
    })
    expect(dummy).toBe(2)
    obj.foo = 2
    expect(dummy).toBe(3)
    stop(runner)
    // 目前如果这里用 obj.foo ++ 的还是会存在问题，他会错误的把之前的依赖函数收集起来
    obj.foo = 3
    expect(dummy).toBe(3)
    runner()
    expect(dummy).toBe(4)
  })
});
