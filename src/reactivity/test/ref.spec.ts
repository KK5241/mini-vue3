import { effect } from "../effect";
import { reactive } from "../reactive";
import { isRef, proxyRefs, ref, unref } from "../ref";

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

  it('isRef',()=>{
    const a = ref(1)
    const b = reactive({foo:1})
    expect(isRef(a)).toBe(true)
    expect(isRef(1)).toBe(false)
    expect(isRef(b)).toBe(false)
  })

  it('unref',()=>{
    const a = ref(1)
    expect(unref(a)).toBe(1)
    expect(unref(1)).toBe(1)
  })

  it('proxyRefs',()=>{
    const user = {
      name:'张三',
      age:ref(18)
    }

    const newUser = proxyRefs(user)
    expect(user.age.value).toBe(18)
    expect(newUser.age).toBe(18)
    expect(newUser.name).toBe('张三')

    newUser.age = 20
    expect(newUser.age).toBe(20)
    expect(user.age.value).toBe(20)

    newUser.age = ref(30)
    expect(newUser.age).toBe(30)
    expect(user.age.value).toBe(30)
  })
});
