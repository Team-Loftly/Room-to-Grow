import { useNavigate } from "react-router-dom";
export default function LoginPage() {
    const navigate = useNavigate();
    return (
        <div className="Login">
          <p>Login Page</p>
          <button onClick={() => {navigate('/home')}}>Login</button>
          <button onClick={() => {navigate('/register')}}>Register</button>
        </div>
      );
}