import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, PlusCircle, ListOrdered, LogOut, History as HistoryIcon } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import CreateOrder from './pages/CreateOrder';
import OrdersList from './pages/OrdersList';
import Login from './pages/Login';

import History from './pages/History';

function Sidebar({ handleLogout }) {
  return (
    <aside className="w-64 bg-milk/10 backdrop-blur-lg shadow-lg border-r border-milk/20 min-h-screen flex flex-col fixed z-10">
      <div className="p-6 border-b border-milk/20 flex items-center justify-center space-x-3">
        <img src="/logo.png" alt="VC Symbol" className="w-12 h-12 object-contain rounded-xl " />
        <h1 className="text-3xl font-normal text-milk tracking-tight font-cursive text-center">Velvet Clean</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 mt-2">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              isActive ? 'bg-milk/20 shadow-sm text-milk font-bold' : 'text-milk/70 hover:bg-milk/10 hover:text-milk font-medium'
            }`
          }
        >
          <LayoutDashboard size={20} />
          <span className="font-serif text-base">Dashboard</span>
        </NavLink>
        <NavLink 
          to="/create-order" 
          className={({ isActive }) => 
            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              isActive ? 'bg-milk/20 shadow-sm text-milk font-bold' : 'text-milk/70 hover:bg-milk/10 hover:text-milk font-medium'
            }`
          }
        >
          <PlusCircle size={20} />
          <span className="font-serif text-base">Create Order</span>
        </NavLink>
        <NavLink 
          to="/orders" 
          className={({ isActive }) => 
            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              isActive ? 'bg-milk/20 shadow-sm text-milk font-bold' : 'text-milk/70 hover:bg-milk/10 hover:text-milk font-medium'
            }`
          }
        >
          <ListOrdered size={20} />
          <span className="font-serif text-base">Orders List</span>
        </NavLink>
        <NavLink 
          to="/history" 
          className={({ isActive }) => 
            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              isActive ? 'bg-milk/20 shadow-sm text-milk font-bold' : 'text-milk/70 hover:bg-milk/10 hover:text-milk font-medium'
            }`
          }
        >
          <HistoryIcon size={20} />
          <span className="font-serif text-base">History</span>
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-milk/20">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 font-medium transition-all"
        >
          <LogOut size={20} />
          <span className="font-serif text-base">Logout</span>
        </button>
      </div>
    </aside>
  );
}

function ProtectedRoute({ children, token }) {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <div className="flex font-sans min-h-screen bg-transparent">
        {token && <Sidebar handleLogout={handleLogout} />}
        
        <main className={`flex-1 ${token ? 'ml-64 p-8' : 'p-0'} min-h-screen relative z-0`}>
          <Routes>
            <Route 
              path="/login" 
              element={token ? <Navigate to="/" /> : <Login setToken={setToken} />} 
            />
            
            <Route 
              path="/" 
              element={
                <ProtectedRoute token={token}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-order" 
              element={
                <ProtectedRoute token={token}>
                  <CreateOrder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute token={token}>
                  <OrdersList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute token={token}>
                  <History />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;

