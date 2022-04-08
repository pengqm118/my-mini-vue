import { track, trigger } from "./effect"

const get = createGetters()
const set = createSetters()
const readonlyGet = createGetters(true)

function createGetters(isReadOnly = false) {
    return function get(target, key) {
        const res = Reflect.get(target, key)
        if (!isReadOnly) {
            track(target, key)
        }
        return res
    } 
}

function createSetters(isReadOnly = false) {
    return function set(target, key, val) {
        const res = Reflect.set(target, key, val)
        if (!isReadOnly) {
            trigger(target, key)
        }
        return res
    }
}

export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, val) {
        console.warn(`key: ${key} set operator failure, because it's target is readonly`)
        return true
    }
}