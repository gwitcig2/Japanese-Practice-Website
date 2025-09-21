import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout.tsx";

function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !confirm) return setError("All fields are required.");
        if (password !== confirm) return setError("Passwords do not match.");

        try {
            setLoading(true);
            setError(null);
            await new Promise((res) => setTimeout(res, 800)); // fake request
            console.log("Signup success:", { email });
        } catch (err: any) {
            setError(err.message || "Signup failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Sign Up">
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

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full border rounded p-2"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
                >
                    {loading ? "Creating account..." : "Sign Up"}
                </button>
            </form>

            <p className="mt-4 text-sm text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 hover:underline">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
}

export default SignupPage