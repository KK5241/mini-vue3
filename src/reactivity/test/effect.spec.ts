import { effect } from "../effect"
import { reactive } from "../reactive"

describe('effect',()=>{
    it('happy path',()=>{
        const obj = reactive({
            foo:1
        })

        let acticveValue
        effect(()=>{
            acticveValue = obj.foo + 1
        })

        expect(acticveValue).toBe(2)

        obj.foo ++
        
        expect(acticveValue).toBe(3)
    })
})