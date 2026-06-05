import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") {
    return <p>tradeviz</p>;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>
      <p>tradeviz</p>
    </div>
  );
}
