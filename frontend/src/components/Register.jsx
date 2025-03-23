import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/register`, { name, email, password, age });
      setLoading(false);
      navigate("/");
    } catch (err) {
      setError("Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleRegister} className=" p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input className="w-full p-2 border mb-2  border-gray-400 rounded-md" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="w-full p-2 border mb-2 border-gray-400 rounded-md" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full p-2 border mb-2  border-gray-400 rounded-md" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input className="w-full p-2 border mb-4  border-gray-400 rounded-md" type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
        <button className="w-full bg-green-400 border border-black text-white font-bold p-2 rounded-md">{loading ? <div className="flex text-gray-300 justify-center items-center gap-2"><span>Registering</span>< Loader2 className="animate-spin w-6 h-6"/></div> : "Register"}</button>
        <p className="mt-2 text-sm text-center">
          Already have an account? <a href="/" className="text-blue-500">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
