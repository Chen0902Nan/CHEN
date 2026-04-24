const INITIAL_STATE = {
  ready: false,
  loading: false,
  error: "",
  messages: [],
  contexts: [],
};

function cloneState(state) {
  return {
    ...state,
    messages: [...state.messages],
    contexts: [...state.contexts],
  };
}

export function createChatStore() {
  let state = cloneState(INITIAL_STATE);
  const listeners = new Set();

  function notify() {
    const snapshot = cloneState(state);
    for (const listener of listeners) {
      listener(snapshot);
    }
  }

  function setState(partialState) {
    state = {
      ...state,
      ...partialState,
    };
    notify();
  }

  function appendMessage(message) {
    setState({
      messages: [...state.messages, message],
    });
  }

  function setContexts(contexts) {
    setState({
      contexts: Array.isArray(contexts) ? contexts : [],
    });
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener(cloneState(state));

    return () => {
      listeners.delete(listener);
    };
  }

  return {
    subscribe,
    getState: () => cloneState(state),
    setReady(ready) {
      setState({ ready: Boolean(ready) });
    },
    setLoading(loading) {
      setState({ loading: Boolean(loading) });
    },
    setError(error) {
      setState({ error: error || "" });
    },
    appendMessage,
    setContexts,
    reset() {
      state = cloneState(INITIAL_STATE);
      notify();
    },
  };
}

