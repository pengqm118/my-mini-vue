import { extend } from "../shared"

class effectClass {
    private _fn
    deps = []
    active = true
    onStop?: () => any
    constructor(fn, public scheduler?) {
        this._fn = fn
    }
    run() {
        activeEffect = this
        return this._fn()
    }
    stop() {
        if (this.active) {
            if (this.onStop) {
                this.onStop()
            }
            cleanEffect(this)
            this.active = false
        }
    }
}

function cleanEffect(effect) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    })
}

const targetMap = new Map()
export function track(target, key) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }

    if (!activeEffect) return;

    dep.add(activeEffect)
    activeEffect.deps.push(dep)
}

export function trigger(target, key) {
    const depsMap = targetMap.get(target)
    const deps = depsMap.get(key)
    for (const effect of deps) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}

let activeEffect
export function effect(fn, options: any = {}) {
    const _effect = new effectClass(fn, options.scheduler)
    _effect.run()

    extend(_effect, options)
    const runner: any = _effect.run.bind(_effect) 
    extend(runner, { effect: _effect })
    return runner
}

export function stop(runner) {
    runner.effect.stop()
}