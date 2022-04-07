import { reactive } from '../reactive'

it('init', () => {
    const user = { age: 7 }
    const reactiveUser = reactive(user)
    expect(reactiveUser).not.toBe(user)
    expect(reactiveUser.age).toBe(7)
})