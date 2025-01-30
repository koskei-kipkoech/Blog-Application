import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Initially, user is null (not logged in)

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser)); // Try parsing only if storedUser exists
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
            }
        }
    }, []);

    // Update localStorage whenever user state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user)); // Persist login state
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);  // Save the token in localStorage
        console.log('User stored in local storage', userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");  // Remove the token as well
    };

    useEffect(() => {
        console.log("User in AuthContext:", user);
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export function useAuth() {
    const { user, login, logout } = useContext(AuthContext);

    const getToken = () => localStorage.getItem("token");  // Retrieve the token
    
    return { user, login, logout, getToken };
}
