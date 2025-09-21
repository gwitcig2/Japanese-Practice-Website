import type { ReactNode } from "react";

interface AuthLayoutProps {
    title: string;
    children: ReactNode;
}

export default function AuthLayout({ title, children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
                {children}
            </div>
        </div>
    );
}
