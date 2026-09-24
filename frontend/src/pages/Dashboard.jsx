import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();

        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-900">
                        Dashboard
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-10">
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Welcome, {user?.name}!
                    </h2>

                    <div className="mt-6 rounded-lg bg-slate-50 p-5">
                        <h3 className="font-semibold text-slate-800">
                            Account Information
                        </h3>

                        <div className="mt-4 space-y-2 text-sm text-slate-600">
                            <p>
                                <span className="font-medium text-slate-800">
                                    Name:
                                </span>{" "}
                                {user?.name}
                            </p>

                            <p>
                                <span className="font-medium text-slate-800">
                                    Email:
                                </span>{" "}
                                {user?.email}
                            </p>

                            <p>
                                <span className="font-medium text-slate-800">
                                    Gender:
                                </span>{" "}
                                {user?.gender}
                            </p>

                            <p>
                                <span className="font-medium text-slate-800">
                                    DOB:
                                </span>{" "}
                                {user?.dob}
                            </p>

                            <p>
                                <span className="font-medium text-slate-800">
                                    Qualification:
                                </span>{" "}
                                {user?.qualification}
                            </p>

                            <p>
                                <span className="font-medium text-slate-800">
                                    Work Experience:
                                </span>{" "}
                                {user?.work_experience}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
