import { useState, useEffect } from "react";
export default function App() {
  const [num, setNum] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(num);
    }, 1000);
    // console.log(num);
  }, [num]);

  return (
    <div
      onClick={() =>
        setNum((prevNum) => {
          // console.log(prevNum);
          return prevNum + 1;
        })
      }
    >
      {num}
    </div>
  );
}
