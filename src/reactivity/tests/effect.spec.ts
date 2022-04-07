import { reactive } from '../reactive'
import { effect } from '../effect'

it('init', () => {
    const user = reactive({ age: 7 })

    let nexAge
    effect(() => {
        nexAge = user.age * 10
    })

    expect(nexAge).toBe(70)

    user.age++
    expect(nexAge).toBe(80)
})