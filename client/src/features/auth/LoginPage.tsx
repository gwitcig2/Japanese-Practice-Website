import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout.tsx";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return setError("All fields are required.");

        try {
            setLoading(true);
            setError(null);
            await new Promise((res) => setTimeout(res, 800)); // fake request
            console.log("Login success:", { email });
        } catch (err: any) {
            setError(err.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Login">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-red-600 text-sm">{error}</div>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded p-2"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded p-2"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <p className="mt-4 text-sm text-center">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-indigo-600 hover:underline">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    );
}

export default LoginPage