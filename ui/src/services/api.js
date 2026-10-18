// ui/src/services/api.js

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Safe LocalStorage Helpers (prevent SSR crashes)
const isClient = typeof window !== "undefined";
const getUsers = () => isClient ? JSON.parse(localStorage.getItem("app_users") || "[]") : [];
const saveUsers = (users) => { if (isClient) localStorage.setItem("app_users", JSON.stringify(users)); };
const getSession = () => isClient ? JSON.parse(localStorage.getItem("app_session") || "null") : null;
const saveSession = (user) => { if (isClient) localStorage.setItem("app_session", JSON.stringify(user)); };

export const PLANS_CATALOG = [
  { 
    id: 'plan_starter', 
    name: 'Starter Yield Node', 
    price: 10000, 
    dailyYield: 1200, 
    duration: 150, 
    image: '/images/h100.jpg',
    badge: 'Entry Level'
  },
  { 
    id: 'plan_pro', 
    name: 'Pro Yield Node', 
    price: 30000, 
    dailyYield: 4500, 
    duration: 150, 
    image: '/images/mi300x.jpg',
    badge: 'Most Popular'
  },
  { 
    id: 'plan_elite', 
    name: 'Elite Yield Node', 
    price: 90000, 
    dailyYield: 15000, 
    duration: 150, 
    image: '/images/tpu.jpg',
    badge: 'Advanced'
  },
  { 
    id: 'plan_quantum', 
    name: 'Quantum Yield Node', 
    price: 150000, 
    dailyYield: 26000, 
    duration: 150, 
    image: '/images/gaudi.jpg',
    badge: 'High Yield'
  },
  { 
    id: 'plan_enterprise', 
    name: 'Enterprise Yield Node', 
    price: 250000, 
    dailyYield: 45000, 
    duration: 150, 
    image: '/images/samba.jpg',
    badge: 'Enterprise'
  },
  { 
    id: 'plan_vip', 
    name: 'VIP Yield Node', 
    price: 500000, 
    dailyYield: 95000, 
    duration: 150, 
    image: '/images/h100.jpg',
    badge: 'VIP Exclusive'
  },
];

export const api = {
  // Add these inside the 'api' object in ui/src/services/api.js

  // --- ADMIN METHODS ---
  adminLogin: async (username, password) => {
    await delay(500);
    if (username === "admin" && password === "admin123") {
      if (isClient) localStorage.setItem("admin_session", "true");
      return true;
    }
    throw new Error("Invalid admin credentials");
  },

  adminLogout: () => {
    if (isClient) localStorage.removeItem("admin_session");
  },

  getAdminStats: async () => {
    await delay(400);
    const users = getUsers();
    const totalUsers = users.length;
    const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
    const totalStaked = users.reduce((sum, u) => {
      return sum + (u.nodes?.reduce((nSum, n) => nSum + n.buyPrice, 0) || 0);
    }, 0);

    return { totalUsers, totalBalance, totalStaked };
  },

  getAllUsers: async () => {
    await delay(400);
    return getUsers();
  },

  updateUserBalance: async (userId, newBalance) => {
    await delay(500);
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");
    
    users[userIndex].balance = Number(newBalance);
    saveUsers(users);
    return users[userIndex];
  },

  getAllTransactions: async () => {
    await delay(400);
    const users = getUsers();
    let allTx = [];
    users.forEach(u => {
      if (u.transactions) {
        u.transactions.forEach(tx => {
          allTx.push({ ...tx, userPhone: u.phone, userId: u.id });
        });
      }
    });
    // Sort by newest first
    return allTx.sort((a, b) => new Date(b.date) - new Date(a.date));
  },
    // Add inside your existing api object in ui/src/services/api.js

  // --- ADVANCED ADMIN PRIVILEGES ---
  deleteUser: async (userId) => {
    await delay(500);
    const users = getUsers();
    const filtered = users.filter(u => u.id !== userId);
    saveUsers(filtered);
    return true;
  },

  killSystem: async () => {
    await delay(1000);
    if (isClient) {
      localStorage.clear(); // Nukes everything: users, admin session, app session
    }
    return true;
  },

  getAdminChartData: async () => {
    await delay(400);
    // Generates realistic-looking 7-day chart data for the dashboard
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, i) => ({
      name: day,
      users: Math.floor(Math.random() * 50) + 10, // Mock new users
      volume: Math.floor(Math.random() * 500000) + 100000, // Mock transaction volume
    }));
  },
    // Add this inside your api object
  adjustUserBalance: async (userId, amount) => {
    await delay(300);
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");
    
    // Add the amount (can be positive or negative)
    users[userIndex].balance += Number(amount);
    if (users[userIndex].balance < 0) users[userIndex].balance = 0; // Prevent negative balance
    
    saveUsers(users);
    return users[userIndex];
  },
  register: async (phone, password, inviteCode) => {
    await delay(800);
    const users = getUsers();
    if (users.find(u => u.phone === phone)) throw new Error("Phone number already registered");

    let inviter = null;
    if (inviteCode) {
      inviter = users.find(u => u.inviteCode === inviteCode);
      if (!inviter) throw new Error("Invalid invite code");
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      phone,
      password,
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      invitedBy: inviter ? inviter.id : null,
      balance: 1000,
      totalYield: 0,
      nodes: [],
      transactions: [{ id: `tx_${Date.now()}`, type: 'Bonus', amount: 1000, date: new Date().toISOString(), status: 'Success' }],
      lastCheckIn: null,
    };

    if (inviter) {
      inviter.balance += 2500;
      inviter.transactions.push({ id: `tx_${Date.now()}`, type: 'Referral', amount: 2500, date: new Date().toISOString(), status: 'Success' });
      saveUsers(users.map(u => u.id === inviter.id ? inviter : u));
    }
    
    users.push(newUser);
    saveUsers(users);
    saveSession(newUser);
    return newUser;
  },

  login: async (phone, password) => {
    await delay(600);
    const users = getUsers();
    const user = users.find(u => u.phone === phone && u.password === password);
    if (!user) throw new Error("Invalid credentials");
    saveSession(user);
    return user;
  },

  logout: async () => {
    await delay(300);
    if (isClient) localStorage.removeItem("app_session");
  },

  getMe: () => getSession(),

  purchasePlan: async (userId, planId) => {
    await delay(1000);
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    const plan = PLANS_CATALOG.find(p => p.id === planId);

    if (user.balance < plan.price) throw new Error("Insufficient funds");

    user.balance -= plan.price;
    user.nodes.push({
      id: `node_${Date.now()}`,
      planId: plan.id,
      name: plan.name,
      buyPrice: plan.price,
      dailyYield: plan.dailyYield,
      purchaseDate: new Date().toISOString(),
      status: 'Active'
    });
    user.transactions.push({ id: `tx_${Date.now()}`, type: 'Purchase', amount: -plan.price, date: new Date().toISOString(), status: 'Success' });

    saveUsers(users.map(u => u.id === userId ? user : u));
    saveSession(user);
    return user;
  }
};