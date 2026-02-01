import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");

  // Load token and username on app start
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const login = (jwtToken, usr) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("username", usr);
    setToken(jwtToken);
    setUsername(usr);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    setUsername("");
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
