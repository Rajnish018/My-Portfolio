// src/context/auth.context.js
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  /* ───── state ───── */
  const [token, setToken] = useState(() =>
    localStorage.getItem("adminToken")
  );

  /* ───── helpers ───── */
  const login  = (jwt) => {
    localStorage.setItem("adminToken", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo"); // if you store it
    setToken(null);
  };

  /* ───── context value ───── */
  const value = { token, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
