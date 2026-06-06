import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="bg-mist-800 w-full py-4 px-6 flex items-center justify-center gap-12 mt-auto">
      <Link
        className="text-gray-400 hover:underline hover:text-blue-600/73"
        to="/Impressum"
      >
        Impressum
      </Link>
      <Link
        className="text-gray-400 hover:underline hover:text-blue-600/73"
        to="/Datenschutzerklaerung"
      >
        Datenschutzerklärung
      </Link>
    </div>
  );
}
