import { useState } from "react";
export default function App() {
  const [inputValue, setValue] = useState("null");

  return (
    <>
      <p>{inputValue}</p>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
}
