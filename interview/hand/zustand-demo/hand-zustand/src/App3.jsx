import { createStore } from "./zustand";

export default function App() {
  const store = createStore();
  console.log(store.getState());
  store.setState({
    count: 10,
  });
  console.log(store.getState());
  return <></>;
}
