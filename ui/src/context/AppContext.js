"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export const EQUIPMENT_CATALOG = [
  { id: 'eq1', name: 'NVIDIA DGX H100', price: 10000, dailyEarning: 1667, image: '/images/h100.jpg' },
  { id: 'eq2', name: 'AMD Instinct MI300X', price: 30000, dailyEarning: 5250, image: '/images/mi300x.jpg' },
  { id: 'eq3', name: 'Google TPU v5e', price: 90000, dailyEarning: 16575, image: '/images/tpu.jpg' },
  { id: 'eq4', name: 'Intel Gaudi 3', price: 270000, dailyEarning: 52500, image: '/images/gaudi.jpg' },
  { id: 'eq5', name: 'SambaNova DataScale', price: 680000, dailyEarning: 140000, image: '/images/samba.jpg' },
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("shadeform_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      localStorage.setItem("shadeform_user", JSON.stringify(user));
    }
  }, [user, isLoaded]);

  const processDailyEarnings = (currentUser) => {
    let updatedBalance = currentUser.balance;
    let updatedTotalEarnings = currentUser.totalEarnings;
    const now = new Date().getTime();

    const updatedEquipment = currentUser.equipment.map(eq => {
      const lastCollected = new Date(eq.lastCollected).getTime();
      const daysPassed = Math.floor((now - lastCollected) / (1000 * 60 * 60 * 24));

      if (daysPassed > 0) {
        const earned = daysPassed * eq.dailyEarning;
        updatedBalance += earned;
        updatedTotalEarnings += earned;
        return { ...eq, lastCollected: new Date().toISOString() };
      }
      return eq;
    });

    return { ...currentUser, balance: updatedBalance, totalEarnings: updatedTotalEarnings, equipment: updatedEquipment };
  };

  const register = (phone, password, inviteCode) => {
    const users = JSON.parse(localStorage.getItem("shadeform_users") || "[]");

    if (users.find(u => u.phone === phone)) {
      throw new Error("Phone number already registered");
    }

    let inviter = null;
    let grandInviter = null;

    if (inviteCode) {
      inviter = users.find(u => u.invitationCode === inviteCode);
      if (!inviter) throw new Error("Invalid invitation code");

      if (inviter.invitedBy) {
        grandInviter = users.find(u => u.id === inviter.invitedBy);
      }
    }

    const newUser = {
      id: uuidv4(),
      phone,
      password,
      invitationCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      invitedBy: inviter ? inviter.id : null,
      balance: 1000,
      totalEarnings: 0,
      equipment: [],
      transactions: [{ id: uuidv4(), type: 'Bonus', amount: 1000, date: new Date().toISOString(), status: 'Success' }],
      lastCheckin: null,
      consecutiveDays: 0,
    };

    if (inviter) {
      inviter.balance += 2500;
      inviter.transactions.push({ id: uuidv4(), type: 'Referral', amount: 2500, date: new Date().toISOString(), status: 'Success' });
      if (grandInviter) {
        grandInviter.balance += 300;
        grandInviter.transactions.push({ id: uuidv4(), type: 'Referral L2', amount: 300, date: new Date().toISOString(), status: 'Success' });
      }
    }

    const updatedUsers = users.map(u => {
      if (u.id === inviter?.id) return inviter;
      if (u.id === grandInviter?.id) return grandInviter;
      return u;
    });
    updatedUsers.push(newUser);
    localStorage.setItem("shadeform_users", JSON.stringify(updatedUsers));

    setUser(processDailyEarnings(newUser));
    return newUser;
  };

  const login = (phone, password) => {
    const users = JSON.parse(localStorage.getItem("shadeform_users") || "[]");
    const foundUser = users.find(u => u.phone === phone && u.password === password);
    if (!foundUser) throw new Error("Invalid credentials");

    const processedUser = processDailyEarnings(foundUser);
    setUser(processedUser);

    const updatedUsers = users.map(u => u.id === processedUser.id ? processedUser : u);
    localStorage.setItem("shadeform_users", JSON.stringify(updatedUsers));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("shadeform_user");
  };

  const recharge = (amount) => {
    if (amount < 10000) throw new Error("Minimum deposit is 10,000 RWF");
    const updatedUser = { ...user };
    updatedUser.balance += amount;
    updatedUser.transactions.push({ id: uuidv4(), type: 'Deposit', amount, date: new Date().toISOString(), status: 'Success' });
    setUser(updatedUser);
  };

  const withdraw = (amount) => {
    if (amount < 3000) throw new Error("Minimum withdrawal is 3,000 RWF");
    if (amount > user.balance) throw new Error("Insufficient balance");

    const tax = amount * 0.15;
    const finalAmount = amount - tax;

    const updatedUser = { ...user };
    updatedUser.balance -= amount;
    updatedUser.transactions.push({ id: uuidv4(), type: 'Withdraw', amount: -amount, date: new Date().toISOString(), status: 'Success' });
    setUser(updatedUser);
    return finalAmount;
  };

  const buyEquipment = (equipmentId) => {
    const eq = EQUIPMENT_CATALOG.find(e => e.id === equipmentId);
    if (user.balance < eq.price) throw new Error("Insufficient balance");

    const newEquipment = {
      id: uuidv4(),
      equipmentId: eq.id,
      name: eq.name,
      buyPrice: eq.price,
      dailyEarning: eq.dailyEarning,
      purchaseDate: new Date().toISOString(),
      lastCollected: new Date().toISOString(),
      status: 'Running'
    };

    const updatedUser = { ...user };
    updatedUser.balance -= eq.price;
    updatedUser.equipment.push(newEquipment);
    updatedUser.transactions.push({ id: uuidv4(), type: 'Purchase', amount: -eq.price, date: new Date().toISOString(), status: 'Success' });
    setUser(updatedUser);
  };

  const checkIn = () => {
    const today = new Date().toDateString();
    if (user.lastCheckin && new Date(user.lastCheckin).toDateString() === today) {
      throw new Error("Already checked in today");
    }

    let consecutive = user.consecutiveDays || 0;
    if (user.lastCheckin && (new Date().getTime() - new Date(user.lastCheckin).getTime()) < 48 * 60 * 60 * 1000) {
      consecutive += 1;
    } else {
      consecutive = 1;
    }

    const updatedUser = { ...user };
    updatedUser.balance += 200;
    updatedUser.totalEarnings += 200;
    updatedUser.lastCheckin = new Date().toISOString();
    updatedUser.consecutiveDays = consecutive;
    updatedUser.transactions.push({ id: uuidv4(), type: 'Check-in', amount: 200, date: new Date().toISOString(), status: 'Success' });
    setUser(updatedUser);
  };

  const getDownlines = () => {
    if (!user) return [];
    const users = JSON.parse(localStorage.getItem("shadeform_users") || "[]");
    return users.filter(u => u.invitedBy === user.id);
  };

  return (
    <AppContext.Provider value={{ user, isLoaded, register, login, logout, recharge, withdraw, buyEquipment, checkIn, getDownlines }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);