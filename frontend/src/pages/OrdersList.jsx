import React, { useState, useEffect } from 'react';
import { Search, Filter, Phone, Calendar, Trash2 } from 'lucide-react';
import GlassDropdown from '../components/GlassDropdown';
import StatusStepper from '../components/StatusStepper';
import api from '../api';
import toast from 'react-hot-toast';

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'ALL',
    search: ''
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('orders', { params: { ...filters, isHistory: 'false' } });
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await api.delete(`orders/${orderId}`);
        toast.success('Order deleted successfully');
        fetchOrders();
      } catch (error) {
        toast.error('Failed to delete order');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'RECEIVED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'READY': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <h2 className="text-5xl font-normal text-milk font-cursive tracking-tight">Orders List</h2>

      <div className="card p-4 flex flex-col md:flex-row gap-4 justify-between items-center relative z-50">
        <div className="relative z-10 w-full md:w-96">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-milk/60 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by customer name or phone..." 
              className="input-field pl-10"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>
        <div className="relative z-10 flex items-center space-x-2 w-full md:w-auto px-4 rounded-xl">
          <Filter className="text-milk/60" size={20} />
          <GlassDropdown 
            value={filters.status}
            onChange={(val) => setFilters({ ...filters, status: val })}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'RECEIVED', label: 'Received' },
              { value: 'PROCESSING', label: 'Processing' },
              { value: 'READY', label: 'Ready' },
              { value: 'DELIVERED', label: 'Delivered' },
            ]}
            buttonClassName="py-2 font-semibold text-milk bg-transparent border-none focus:outline-none min-w-[120px]"
            menuClassName="left-0"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-milk font-medium">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="card py-16 text-center border-dashed border-2 border-milk/20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-milk/10 mb-4 shadow-sm">
            <Search className="text-milk/60" size={32} />
          </div>
          <h3 className="text-xl font-bold text-milk mb-2 font-serif">No orders found</h3>
          <p className="text-milk/70 font-medium">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order, index) => (
            <div key={order._id} className="card p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:-translate-y-1 transition-transform duration-300 relative group" style={{ zIndex: orders.length - index }}>
              
              <div className="space-y-2 flex-1">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-milk font-serif">{order.customerName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  {order.orderId && (
                    <p className="text-xs text-milk/60 font-mono tracking-widest mt-1">
                      ID: {order.orderId}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:space-x-6 text-sm text-milk/80 font-medium">
                  <div className="flex items-center space-x-1.5">
                    <div className="text-milk"><Phone size={14} /></div>
                    <span>{order.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 mt-1 sm:mt-0">
                    <div className="text-milk"><Calendar size={14} /></div>
                    <span>Est. Delivery: {formatDate(order.estimatedDeliveryDate)}</span>
                  </div>
                </div>

                <div className="text-sm text-milk/80 mt-2">
                  <span className="font-bold uppercase tracking-wider text-milk text-xs mr-2">Items: </span> 
                  <span className="bg-milk/10 px-2 py-0.5 rounded border border-milk/20 shadow-sm text-milk">
                    {order.garments.map(g => `${g.quantity}x ${g.type}`).join(', ')}
                  </span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 border-t border-milk/20 md:border-t-0 pt-4 md:pt-0">
                <div className="text-right">
                  <p className="text-xs text-milk/70 uppercase tracking-wider font-bold mb-1">Total Bill</p>
                  <p className="text-2xl font-bold text-milk font-serif">Rs. {order.totalAmount.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <div className="w-full flex-1 max-w-[320px]">
                    <StatusStepper 
                      currentStatus={order.status}
                      onStatusChange={(val) => handleStatusChange(order._id, val)}
                    />
                  </div>
                  <button 
                    onClick={() => handleDeleteOrder(order._id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all shadow-sm hover:shadow-md"
                    title="Delete Order"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersList;
