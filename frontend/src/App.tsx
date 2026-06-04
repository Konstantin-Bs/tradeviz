import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StockDetail from "./pages/StockDetail";
import useWebSocket from "./hooks/useWebSocket";

export default function App() {
  const prices = useWebSocket();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard prices={prices} />} />
        <Route
          path="/stock/:ticker"
          element={<StockDetail prices={prices} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
