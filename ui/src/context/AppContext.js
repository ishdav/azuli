"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { api, PLANS_CATALOG } from "@/services/api";

// Re-export the catalog so pages can import it from Context
export { PLANS_CATALOG };

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load session from mock API
    const session = api.getMe();
    if (session) setUser(session);
    setIsLoaded(true);
  }, []);

  const login = async (phone, password) => {
    const loggedInUser = await api.login(phone, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (phone, password, inviteCode) => {
    const newUser = await api.register(phone, password, inviteCode);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const purchasePlan = async (planId) => {
    if (!user) throw new Error("Not logged in");
    const updatedUser = await api.purchasePlan(user.id, planId);
    setUser(updatedUser);
    return updatedUser;
  };

  const getDownlines = () => {
    if (!user) return [];
    const users = JSON.parse(localStorage.getItem("app_users") || "[]");
    return users.filter((u) => u.invitedBy === user.id);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoaded,
        login,
        register,
        logout,
        purchasePlan,
        getDownlines,
        PLANS_CATALOG,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Guard against missing Provider
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};