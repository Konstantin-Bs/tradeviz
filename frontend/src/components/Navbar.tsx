import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, House } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  function isMarketOpen(): boolean {
    const now = Date();
    const eastern = new Date(
      (now as any).toLocaleString("en-US", { timeZone: "America/New_York" }),
    );

    const day = eastern.getDay();
    const hours = eastern.getHours();
    const minutes = eastern.getMinutes();

    if (day === 0 || day === 6) return false;

    const time = hours * 60 + minutes;
    return time >= 570 && time < 960;
  }

  return (
    <div className="fixed inset-x-0 top-0 left-0 right-0 z-50 border-b border-gray-600 bg-mist-900">
      {location.pathname === "/" ? (
        <div className="py-2">
          <div className="flex items-center justify-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isMarketOpen() ? "bg-green-400" : "bg-red-400"}`}
            />
            <h1 className="font-bold">tradeviz</h1>
          </div>
        </div>
      ) : (
        <div className="flex items-center relative py-2">
          <button
            className="absolute left-4 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            className="absolute left-14 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <House size={20} />
          </button>
          <div className="flex items-center justify-center gap-2 w-full">
            <div
              className={`w-2 h-2 rounded-full ${isMarketOpen() ? "bg-green-400" : "bg-red-400"}`}
            />
            <h1 className="font-bold">tradeviz</h1>
          </div>
        </div>
      )}
    </div>
  );
}
