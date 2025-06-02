import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    return (
        <div className="Register">
          <p>Register Page</p>
          <button onClick={() => {navigate('/home')}}>Register</button>
        </div>
      );
}