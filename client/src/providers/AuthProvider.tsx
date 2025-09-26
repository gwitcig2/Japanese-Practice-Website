import {createContext, useState, useEffect, type ReactNode, useContext} from "react";
import api from "../utils/axios.ts";

type User = {
    _id: string;
    email: string;
    username: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => void;
    logout: (email: string) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        api.get("/users/me")
            .then((res) => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));

    }, []);

    const login = async (credentials: any) => {

        await api.post("/sessions", credentials);

        const res = await api.get("/users/me");

        setUser(res.data);

    };

    const logout = async () => {

        await api.delete("/sessions");

        setUser(null);

    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

}

export function useAuth() {
    return useContext(AuthContext);
}
