import { isReactive, reactive } from "../reactive"

describe('reactivity',()=>{
    it('happy path',()=>{
        const obj = {foo:1}
        const newObj = reactive(obj)
        expect(newObj).not.toBe(obj)
        expect(newObj.foo).toBe(1)
        expect(isReactive(newObj)).toBe(true)
        expect(isReactive(obj)).toBe(false)
    })
})