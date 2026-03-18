export function createStore() {
    let state = { count: 0 };
    const listeners = new Set();
    const getState = () => state;
    // 不是替换，而是合并
    // 支持函数
    // replace 
    const setState = (partial) => {
        const nextState = 
            typeof partial === 'function'
            ? partial(state)
            : partial
        state =typeof nextState!=='object'
        ?partial
        : Object.assign({},state,nextState)
        listeners.forEach(listener => listener())
    }

    const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }
    return {
        getState,
        setState,
        subscribe
    }
}