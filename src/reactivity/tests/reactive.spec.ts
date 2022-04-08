import { reactive, readOnly } from '../reactive'

describe('init', () => {
    it('reactive', () => {
        const user = { age: 7 }
        const reactiveUser = reactive(user)
        expect(reactiveUser).not.toBe(user)
        expect(reactiveUser.age).toBe(7)
    })

    it('readOnly', () => {
        const user = { age: 1 }
        const other = readOnly(user)
        expect(user).not.toBe(other)
        console.warn = jest.fn()
        other.age++
        expect(console.warn).toHaveBeenCalled()
    })
})