import Navbar from "../components/Navbar";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />

            <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
                <h1 className="text-4xl font-bold">Dashboard</h1>
            </div>
        </div>
    );
}
