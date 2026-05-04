import { Streamdown } from "streamdown";

export default function App() {
  const markdown = `
  # Hello World
  This is **streaming** markdown!
  `;

  return <Streamdown>{markdown}</Streamdown>;
}
