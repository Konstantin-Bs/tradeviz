import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StockDetail from "./pages/StockDetail";
import Impressum from "./pages/Impressum";
import Datenschutzerklaerung from "./pages/Datenschutzerklaerung";
import useWebSocket from "./hooks/useWebSocket";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  const prices = useWebSocket();

  return (
    <BrowserRouter>
      <ErrorBoundary
        fallback={
          <h1 className="text-center mt-10 text-2xl">Something went wrong.</h1>
        }
      >
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard prices={prices} />} />
              <Route
                path="/stock/:ticker"
                element={<StockDetail prices={prices} />}
              />
              <Route path="/impressum" element={<Impressum />} />
              <Route
                path="/datenschutzerklaerung"
                element={<Datenschutzerklaerung />}
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
