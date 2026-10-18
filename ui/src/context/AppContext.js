"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { api, PLANS_CATALOG } from "@/services/api";

export { PLANS_CATALOG };
const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch fresh data from DB
  const refreshUser = async () => {
    try {
      const freshData = await api.getMe();
      setUser(freshData);
    } catch (error) {
      console.error("Failed to sync:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const data = await api.getMe();
        setUser(data);
      } catch (e) {
        setUser(null);
      } finally {
        setIsLoaded(true);
      }
    };
    init();
  }, []);

  const login = async (phone, password) => {
    const data = await api.login(phone, password);
    setUser(data);
  };

  const register = async (phone, password, inviteCode) => {
    const data = await api.register(phone, password, inviteCode);
    setUser(data);
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const recharge = async (amount) => {
    await api.recharge(amount);
    await refreshUser(); // Auto-update balance after deposit
  };

  const withdraw = async (amount) => {
    const res = await api.withdraw(amount);
    await refreshUser(); // Auto-update balance after withdraw
    return res;
  };

  const purchasePlan = async (plan) => {
    const res = await api.purchasePlan(plan);
    await refreshUser(); // Auto-update nodes and balance
    return res;
  };

  return (
    <AppContext.Provider value={{ 
      user, isLoaded, login, register, logout, recharge, withdraw, purchasePlan, refreshUser, PLANS_CATALOG 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);