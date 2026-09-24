import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/user");

                setUser(response.data);
            } catch (error) {
                console.error("Authentication failed:", error);

                localStorage.removeItem("auth_token");

                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <p className="text-slate-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-900">
                        Dashboard
                    </h1>

                    <button
                        onClick={() => {
                            localStorage.removeItem("auth_token");
                            navigate("/login");
                        }}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
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

                        <div className="mt-4 space-y-2 text-sm">
                            <p>
                                <span className="font-medium">Name:</span>{" "}
                                {user?.name}
                            </p>

                            <p>
                                <span className="font-medium">Email:</span>{" "}
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
