// ui/src/services/api.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const isClient = typeof window !== "undefined";
const getSession = () => isClient ? JSON.parse(localStorage.getItem("app_session") || "null") : null;
const saveSession = (user) => { if (isClient) localStorage.setItem("app_session", JSON.stringify(user)); };

const request = async (endpoint, data, method = 'POST', isAdmin = false) => {
  const headers = { 'Content-Type': 'application/json' };
  const tokenKey = isAdmin ? 'admin_token' : 'azuli_token';
  const token = isClient ? localStorage.getItem(tokenKey) : null;
  
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (data) config.body = JSON.stringify(data);

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const result = await response.json();

  if (!response.ok) throw new Error(result.message || 'Something went wrong');
  return result;
};

export const PLANS_CATALOG = [
  { id: 'plan_starter', name: 'Starter Yield Node', price: 10000, dailyYield: 1200, duration: 150, image: '/images/h100.jpg', badge: 'Entry Level' },
  { id: 'plan_pro', name: 'Pro Yield Node', price: 30000, dailyYield: 4500, duration: 150, image: '/images/mi300x.jpg', badge: 'Most Popular' },
  { id: 'plan_elite', name: 'Elite Yield Node', price: 90000, dailyYield: 15000, duration: 150, image: '/images/tpu.jpg', badge: 'Advanced' },
  { id: 'plan_quantum', name: 'Quantum Yield Node', price: 150000, dailyYield: 26000, duration: 150, image: '/images/gaudi.jpg', badge: 'High Yield' },
  { id: 'plan_enterprise', name: 'Enterprise Yield Node', price: 250000, dailyYield: 45000, duration: 150, image: '/images/samba.jpg', badge: 'Enterprise' },
  { id: 'plan_vip', name: 'VIP Yield Node', price: 500000, dailyYield: 95000, duration: 150, image: '/images/h100.jpg', badge: 'VIP Exclusive' },
];

export const api = {
  // Auth
  register: async (phone, password, inviteCode) => {
    const data = await request('/auth/register', { phone, password, inviteCode });
    if (isClient) {
      localStorage.setItem('azuli_token', data.token);
      saveSession(data);
    }
    return data;
  },

  login: async (phone, password) => {
    const data = await request('/auth/login', { phone, password });
    if (isClient) {
      localStorage.setItem('azuli_token', data.token);
      saveSession(data);
    }
    return data;
  },

  logout: () => {
    if (isClient) {
      localStorage.removeItem('azuli_token');
      localStorage.removeItem('app_session');
    }
  },

  // User Actions
  getMe: async () => {
    const token = isClient ? localStorage.getItem('azuli_token') : null;
    if (!token) return getSession(); // Fallback to session if no token
    
    const data = await request('/users/me', null, 'GET');
    saveSession(data); // Update local session with fresh data
    return data;
  },

  recharge: async (amount) => {
    return await request('/users/deposit', { amount });
  },

  withdraw: async (amount) => {
    return await request('/users/withdraw', { amount });
  },

  purchasePlan: async (plan) => {
    return await request('/users/purchase', { plan });
  },

  // ✅ ADDED: Get Downlines (Referrals) from real backend
  getDownlines: async () => {
    return await request('/users/downlines', null, 'GET');
  },

  // Admin Actions
  adminLogin: async (username, password) => {
    const data = await request('/admin/login', { username, password }, 'POST', true);
    if (isClient) {
      localStorage.setItem("admin_session", "true");
      localStorage.setItem("admin_token", data.token);
    }
    return true;
  },

  adminLogout: () => {
    if (isClient) {
      localStorage.removeItem("admin_session");
      localStorage.removeItem("admin_token");
    }
  },

  getAdminStats: async () => await request('/admin/stats', null, 'GET', true),
  getAllUsers: async () => await request('/admin/users', null, 'GET', true),
  updateUserBalance: async (userId, newBalance) => await request(`/admin/users/${userId}/balance`, { newBalance }, 'PUT', true),
  getAllTransactions: async () => await request('/admin/transactions', null, 'GET', true),
  killSystem: async () => {
    const res = await request('/admin/kill-system', null, 'POST', true);
    if (isClient) localStorage.clear();
    return res;
  },

  // Mocks (To be implemented on backend later)
  adjustUserBalance: async (userId, amount) => {
    const users = await api.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    return await api.updateUserBalance(userId, user.balance + Number(amount));
  },
  deleteUser: async () => true,
  getAdminChartData: async () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => ({
      name: day,
      users: Math.floor(Math.random() * 50) + 10,
      volume: Math.floor(Math.random() * 500000) + 100000,
    }));
  }
};