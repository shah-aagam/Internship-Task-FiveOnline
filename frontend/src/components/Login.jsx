import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/dashboard");
      setLoading(false);
    } catch (err) {
      setError("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input className="w-full p-2 border border-gray-400 mb-2 rounded-md" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full p-2 border border-gray-400 mb-4 rounded-md" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full bg-green-400 border border-black text-white font-bold p-2 rounded-md">{loading ? <div className="flex text-gray-300 justify-center items-center gap-2"><span>Loging In</span>< Loader2 className="animate-spin w-6 h-6"/></div> : "Login"}</button>
        <p className="mt-2 text-sm text-center">
          Don't have an account? <a href="/register" className="text-blue-500">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
