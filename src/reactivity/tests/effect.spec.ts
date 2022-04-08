import { reactive } from '../reactive'
import { effect, stop } from '../effect'

describe('init', () => {
    it('effect', () => {
        const user = reactive({ age: 7 })
    
        let nexAge
        effect(() => {
            nexAge = user.age * 10
        })
    
        expect(nexAge).toBe(70)
    
        user.age++
        expect(nexAge).toBe(80)
    })

    it('runner', () => {
        const user = reactive({ foo: 10 })

        let next
        let runner = effect(() => {
            next = user.foo + 1
            return 'foo'
        })

        expect(next).toBe(11)
        const res = runner()
        expect(res).toBe('foo')
    })

    it('scheduler', () => {
        // 初始effect情况下触发fn， 响应式对象触发set时触发scheduler函数
        let dummy;
        let run;
        const scheduler = jest.fn(() => {
            run = runner;
        })

        const user = reactive({ age: 7 })
        const runner = effect(
            () => {
                dummy = user.age + 1;
            },
            { scheduler }
        )
        expect(dummy).toBe(8);
        expect(scheduler).not.toHaveBeenCalled()
        user.age++
        expect(scheduler).toHaveBeenCalledTimes(1)
        expect(dummy).toBe(8)
        // expect(user.age).toBe(8)
        run()
        // expect(user.age).toBe(8)
        expect(dummy).toBe(9)
        expect(scheduler).toHaveBeenCalledTimes(1)
    })

    it('stop', () => {
        let dummy;
        const user = reactive({ age: 10 })
        const runner = effect(() => {
            dummy = user.age;
        })

        expect(dummy).toBe(10)
        user.age = 7;
        expect(dummy).toBe(7)
        stop(runner)
        user.age = 17
        expect(dummy).toBe(7)

        runner()
        expect(dummy).toBe(17)
    })

    it('onStop', () => {
        let dummy;
        const onStop = jest.fn();
        const user = reactive({ age: 1 })
        const runner = effect(() => 
            {
                dummy = user.age
            },
            { onStop }
        )
        expect(dummy).toBe(1)
        stop(runner)
        expect(onStop).toHaveBeenCalled()
    })
})