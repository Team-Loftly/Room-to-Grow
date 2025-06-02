import { useNavigate } from "react-router-dom";
export default function HomePage() {
    const navigate = useNavigate();
  return (
    <div className="Home">
      <p>Home Page</p>
      <button onClick={() => {navigate('/tasks')}}>My tasks</button>
      <button onClick={() => {navigate('/stats')}}>My stats</button>
      <button onClick={() => {navigate('/marketplace')}}>Marketplace</button>
      <button onClick={() => {navigate('/edit')}}>Edit</button>
      <button onClick={() => {/*TODO startup timer on home page or create another page*/}}>Timer</button>
    </div>
  );
}
