import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <nav className="border-b border-slate-200 bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link
                    to="/dashboard"
                    className="text-xl font-bold text-blue-600"
                >
                    Home
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        to="/profile"
                        className="text-sm font-medium text-slate-700 hover:text-blue-600"
                    >
                        Profile
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-sm font-medium text-red-600 cursor-pointer hover:text-red-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
