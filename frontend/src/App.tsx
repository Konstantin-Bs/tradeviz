import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StockDetail from "./pages/StockDetail";
import useWebSocket from "./hooks/useWebSocket";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  const prices = useWebSocket();

  return (
    <BrowserRouter>
      <ErrorBoundary fallback={<p>Something went wrong.</p>}>
        <Routes>
          <Route path="/" element={<Dashboard prices={prices} />} />
          <Route
            path="/stock/:ticker"
            element={<StockDetail prices={prices} />}
          />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
