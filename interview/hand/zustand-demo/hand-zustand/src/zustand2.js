export function createStore() {
    let state = { count : 0 };
    const getState = () => state;
    const setState = (newState) => {
        state = newState
    }
    return {
        getState,
        setState
    }
}