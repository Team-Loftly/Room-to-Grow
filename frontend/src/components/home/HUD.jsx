import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openTimer } from "../../features/timerSlice";

export default function HUD() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="flex top-0 left-0 w-full h-16 flex justify-around items-center text-white text-bold ">
      <button
        onClick={() => {
          navigate("/tasks");
        }}
        className="hover:cursor-pointer hover:transform hover:scale-120 transition-transform duration-200"
      >
        Habits
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
          dispatch(openTimer());
        }}
        className="hover:cursor-pointer hover:transform hover:scale-120 transition-transform duration-200"
      >
        Timer
      </button>
    </div>
  );
}
