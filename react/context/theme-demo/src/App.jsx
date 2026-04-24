import ThemeProvider from "./contexts/ThemeContext";
import Page from "./pages/Page";
export default function App() {
  return (
    <>
      <ThemeProvider>
        <Page />
      </ThemeProvider>
    </>
  );
}
