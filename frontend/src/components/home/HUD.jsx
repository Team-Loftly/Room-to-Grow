import { useNavigate } from "react-router-dom";

export default function HUD() {
  const navigate = useNavigate();
  return (
    <div className="flex top-0 left-0 w-full h-16 bg-gray-800 flex justify-around items-center text-white">
      <button
        onClick={() => {
          navigate("/tasks");
        }}
        className="hover:cursor-pointer hover:transform hover:scale-120 transition-transform duration-200"
      >
        Tasks
      </button>
      <button
        onClick={() => {
          navigate("/stats");
        }}
        className="hover:cursor-pointer hover:transform hover:scale-120 transition-transform duration-200"
      >
        Stats
      </button>
      <button
        onClick={() => {
          navigate("/marketplace");
        }}
        className="hover:cursor-pointer hover:transform hover:scale-120 transition-transform duration-200"
      >
        Marketplace
      </button>
      <button
        onClick={() => {
          navigate("/edit");
        }}
        className="hover:cursor-pointer hover:transform hover:scale-120 transition-transform duration-200"
      >
        Edit Room
      </button>
      <button
        onClick={() => {
          /*TODO startup timer on home page or create another page*/
        }}
        className="hover:cursor-pointer hover:transform hover:scale-120 transition-transform duration-200"
      >
        Timer
      </button>
    </div>
  );
}
