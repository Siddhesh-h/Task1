import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/forgot-password", {
                email,
            });

            setMessage(response.data.message);
            toast.success(response.data.message);
        } catch (error) {
            setError(
                error.response?.data?.message || "Unable to send reset link.",
            );
            toast.error(
                error.response?.data?.message || "Unable to send reset link.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <h1 className="text-2xl font-bold text-center">
                    Forgot Password?
                </h1>

                <p className="text-gray-500 text-center mt-2 mb-6">
                    Enter your email and we'll send you a password reset link.
                </p>

                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium mb-2">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    {message && (
                        <p className="text-green-600 text-sm mb-4">{message}</p>
                    )}

                    {error && (
                        <p className="text-red-600 text-sm mb-4">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </div>
    );
}
