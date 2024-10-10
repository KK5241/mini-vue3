import { isReadonly, readonly } from "../reactive"

describe('readonly',()=>{
    it('happy path',()=>{
        const obj = {foo:1}
        const newObj = readonly(obj)
        expect(newObj).not.toBe(obj)
        expect(newObj.foo).toBe(1)
    })
    it('warn then call set',()=>{
        console.warn = jest.fn()
        const readOnlyObj = readonly({foo:1})
        readOnlyObj.foo = 10
        expect(console.warn).toHaveBeenCalled()
        expect(isReadonly(readOnlyObj)).toBe(true)
        expect(isReadonly({foo:1})).toBe(false)
    })
})