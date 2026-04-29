import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle, Home, Truck, Plus, Check, DollarSign } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, ordersRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/orders', { params: { isHistory: 'false' } })
        ]);
        setStats(dashboardRes.data);
        setRecentOrders(ordersRes.data.slice(0, 4));
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10 text-milk/70">Loading dashboard...</div>;

  const total = stats.totalOrders || 1;
  const getPercentage = (count) => Math.round((count / total) * 100);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'RECEIVED': return <ShoppingBag size={18} className=" text-milk" />;
      case 'PROCESSING': return <Clock size={18} className="text-milk" />;
      case 'READY': return <CheckCircle size={18} className="text-milk" />;
      case 'DELIVERED': return <Check size={18} className="text-milk" />;
      default: return <Home size={18} className="text-milk" />;
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'RECEIVED': return 'bg-blue/500/20';
      case 'PROCESSING': return 'bg-yellow-500/20';
      case 'READY': return 'bg-purple-500/20';
      case 'DELIVERED': return 'bg-green-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto h-full text-milk">
      {/* Left Column (Main Area) */}
      <div className="flex-1 space-y-8 pr-4">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-5xl font-normal font-cursive tracking-tight mb-2">Dashboard</h2>
            <p className="text-milk/70 font-medium text-sm">01 - {new Date().getDate()} {new Date().toLocaleString('default', { month: 'long' })}, {new Date().getFullYear()}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/create-order" className="w-10 h-10 rounded-full border border-milk/20 flex items-center justify-center text-milk/70 hover:text-milk hover:border-milk/50 transition-colors shadow-sm bg-milk/10 backdrop-blur-sm">
              <Plus size={20} />
            </Link>
          </div>
        </div>

        {/* Total Orders Card (Replacing Bar Chart) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 mb-12">
          <div className="card p-6 flex flex-col justify-center relative overflow-hidden group">
            <div className="relative z-10 flex items-center space-x-4">
              <div className="p-3 shadow-sm rounded-xl text-milk-300 backdrop-blur-sm bg-black/50">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-xs text-milk/70 font-semibold uppercase tracking-wider mb-1">Total Orders</p>
                <h3 className="text-3xl font-bold text-milk font-serif">{stats.totalOrders}</h3> 
              </div>
            </div>
          </div>
          <div className="card p-6 flex flex-col justify-center relative overflow-hidden group">
            <div className="relative z-10 flex items-center space-x-4">
              <div className="p-3 shadow-sm rounded-xl text-milk backdrop-blur-sm bg-black/50">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-xs text-milk/70 font-semibold uppercase tracking-wider mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold text-milk font-serif">Rs.{stats.totalRevenue.toFixed(2)}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold font-serif">Today</h3>
            
          </div>

          <div className="space-y-0 card overflow-hidden">
            {recentOrders.map((order, index) => (
              <div key={order._id} className={`flex items-center justify-between p-5 ${index !== recentOrders.length - 1 ? 'border-b border-milk/10' : ''} hover:bg-milk/5 transition-colors`}>
                <div className="flex items-center space-x-5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-milk/10 ${getStatusBg(order.status)}`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[15px] mb-1 font-serif">{order.customerName} </h4>
                    <p className="text-milk/70 text-xs font-medium">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.phone}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold font-mono">
                    Rs. {order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <div className="text-center py-6 text-milk/70">No recent orders.</div>
            )}
          </div>
        </div>

      </div>

      {/* Right Column (Sidebar) */}
      <div className="w-full lg:w-[320px] card rounded-[2rem] p-8 flex flex-col shadow-sm">
        <h3 className="text-[17px] font-bold mb-8 font-serif">Where your orders go?</h3>
        
        <div className="space-y-7 flex-1">
          {/* Progress Bar Item 1 */}
          <div>
            <div className="flex justify-between text-[13px] font-bold mb-3">
              <span>Received</span>
              <span className="text-milk/70 font-medium">{stats.ordersPerStatus.RECEIVED}</span>
            </div>
            <div className="h-[6px] w-full bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-blue-200 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]" style={{ width: `${getPercentage(stats.ordersPerStatus.RECEIVED)}%` }}></div>
            </div>
          </div>

          {/* Progress Bar Item 2 */}
          <div>
            <div className="flex justify-between text-[13px] font-bold mb-3">
              <span>Processing</span>
              <span className="text-milk/70 font-medium">{stats.ordersPerStatus.PROCESSING}</span>
            </div>
            <div className="h-[6px] w-full bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{ width: `${getPercentage(stats.ordersPerStatus.PROCESSING)}%` }}></div>
            </div>
          </div>

          {/* Progress Bar Item 3 */}
          <div>
            <div className="flex justify-between text-[13px] font-bold mb-3">
              <span>Ready</span>
              <span className="text-milk/70 font-medium">{stats.ordersPerStatus.READY}</span>
            </div>
            <div className="h-[6px] w-full bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full shadow-[0_0_10px_rgba(192,132,252,0.5)]" style={{ width: `${getPercentage(stats.ordersPerStatus.READY)}%` }}></div>
            </div>
          </div>

          {/* Progress Bar Item 4 */}
          <div>
            <div className="flex justify-between text-[13px] font-bold mb-3">
              <span>Delivered</span>
              <span className="text-milk/70 font-medium">{stats.ordersPerStatus.DELIVERED}</span>
            </div>
            <div className="h-[6px] w-full bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]" style={{ width: `${getPercentage(stats.ordersPerStatus.DELIVERED)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Promo Card */}
        <div className="mt-12 bg-black/20 border border-milk/10 rounded-[1.5rem] p-6 relative overflow-hidden backdrop-blur-md">
          <div className="relative z-10">
            <div className="bg-milk/20 w-12 h-10 flex items-center justify-center rounded-xl mb-5 shadow-sm border border-milk/10">
              <div className="w-5 h-2 border-t-2 border-b-2 border-milk"></div>
            </div>
            <h4 className="font-bold text-[15px] mb-2 font-serif">Save more time</h4>
            <p className="text-milk/70 text-xs leading-relaxed opacity-80">
              Manage all your laundry operations smoothly and securely in one place.
            </p>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-milk/5 rounded-full blur-xl"></div>
          <div className="absolute top-4 -right-4 w-12 h-12 bg-milk/5 rounded-full blur-lg"></div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
