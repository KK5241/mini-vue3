import { isReactive, reactive } from "../reactive"

describe('reactivity',()=>{
    it('happy path',()=>{
        const obj = {foo:1,arr:[{moo:1}],x:{m:1}}
        const newObj = reactive(obj)
        expect(newObj).not.toBe(obj)
        expect(newObj.foo).toBe(1)
        expect(isReactive(newObj)).toBe(true)
        expect(isReactive(obj)).toBe(false)
        expect(isReactive(newObj.arr)).toBe(true)
        expect(isReactive(newObj.x)).toBe(true)
        expect(isReactive(newObj.arr[0])).toBe(true)
    })
})