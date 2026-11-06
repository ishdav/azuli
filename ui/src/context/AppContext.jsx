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

    const recharge = async (amount, paymentProof) => {
    await api.recharge(amount, paymentProof);
    await refreshUser();
  };

  const withdraw = async (amount, phoneNumber, network, withdrawPassword) => {
    const res = await api.withdraw(amount, phoneNumber, network, withdrawPassword);
    await refreshUser(); 
    return res;
  };

    const purchasePlan = async (planId) => {
    const res = await api.purchasePlan(planId);
    await refreshUser(); // Auto-update nodes and balance
    return res;
  };
  const checkIn = async () => {
    const res = await api.checkIn();
    await refreshUser(); // Auto-update balance
    return res;
  };
  // Remember to add `checkIn` to the `value={{ ... }}` object passed to the provider!

  // ✅ ADDED: The missing getDownlines function
  const getDownlines = async () => {
    try {
      return await api.getDownlines();
    } catch (error) {
      console.error("Failed to fetch downlines:", error);
      return [];
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      isLoaded, 
      login, 
      register, 
      logout, 
      recharge, 
      withdraw, 
      purchasePlan, 
      refreshUser, 
      checkIn, // ✅ ADDED to the provider value
      getDownlines, // ✅ ADDED to the provider value
      PLANS_CATALOG 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);