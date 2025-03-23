import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logOutImg from "../assets/logoutImg.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";

const Dashboard = ({ setToken }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  console.log(API_URL)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setLoggedInUserId(decoded.id);
    }

    axios
      .get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/api/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setUsers(users.filter((user) => user._id !== id));
    localStorage.removeItem("token");
    setLoggedInUserId(null);
    setToken("");
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/users/${selectedUser._id}`,
        {
          name: selectedUser.name,
          age: selectedUser.age,
          password: selectedUser.password,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers(
        users.map((user) => (user._id === selectedUser._id ? selectedUser : user))
      );
      setIsModalOpen(false);
      setLoading(false);
    } catch (error) {
      console.error("Update failed", error);
      setLoading(false);
    }
  };

  return (
    <div className="md:p-6">
      <div className="relative flex justify-center items-center mb-5 md:mb-10 border-b border-b-green-400">
        <h1 className="p-2 text-lg md:text-4xl font-bold text-center">
          <span className="text-green-500 text-lg md:text-4xl">User Dashboard</span>
        </h1>
        <div
          className="absolute right-5 top-1/4 flex gap-2 cursor-pointer"
          onClick={handleLogout}
        >
          <span className="text-lg font-normal hidden sm:visible">Logout</span>
          <img src={logOutImg} alt="logOutLogo" className="w-5 md:w-8"/>
        </div>
      </div>

      {users.length === 0 && <div className="text-center mt-2">No users to show</div>}
      {users.length !== 0 && (
        <div className="overflow-x-auto">
        <table className="table-auto w-full rounded-md">
          <thead className="bg-green-800 text-center text-white">
            <tr>
              <th className="p-2 border border-black">Name</th>
              <th className="p-2 border border-black">Email</th>
              <th className="p-2 border border-black">Age</th>
              <th className="p-2 border border-black">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-green-100">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="p-2 border border-black text-center">{user.name}</td>
                <td className="p-2 border border-black text-center">{user.email}</td>
                <td className="p-2 border border-black text-center">{user.age}</td>
                <td className="p-2 border border-black text-center w-32">
                  {user._id === loggedInUserId ? (
                    <>
                      <span className="mx-2 cursor-pointer" onClick={() => handleUpdateClick(user)}>
                        <lord-icon
                          src="https://cdn.lordicon.com/gwlusjdu.json"
                          trigger="hover"
                          style={{ width: "25px", height: "25px" }}
                        ></lord-icon>
                      </span>
                      <span className="mx-2 cursor-pointer" onClick={() => handleDelete(user._id)}>
                        <lord-icon
                          src="https://cdn.lordicon.com/skkahier.json"
                          trigger="hover"
                          style={{ width: "25px", height: "25px" }}
                        ></lord-icon>
                      </span>
                    </>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      {/* Modal for Updating User */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">Update User</h2>

            <div className="mb-3">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Age</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded"
                value={selectedUser.age}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, age: e.target.value })
                }
              />
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label className="block text-sm font-medium">New Password</label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded"
                placeholder="Leave blank if not changing"
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, password: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleUpdate}
              >
                {loading ? <div className="flex text-gray-300 justify-center items-center gap-2"><span>Updating</span>< Loader2 className="animate-spin w-6 h-6"/></div> : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;