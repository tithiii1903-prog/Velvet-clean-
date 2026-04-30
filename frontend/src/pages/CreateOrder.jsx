import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import GlassDropdown from '../components/GlassDropdown';
import api from '../api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AVAILABLE_GARMENTS = [
  { id: 'Shirt', name: 'Shirt' },
  { id: 'Pants', name: 'Pants' },
  { id: 'Saree', name: 'Saree' },
  { id: 'Suit', name: 'Suit' },
  { id: 'Dress', name: 'Dress' },
  { id: 'Jacket', name: 'Jacket' },
];

function CreateOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    garments: []
  });

  const addGarment = () => {
    setFormData({
      ...formData,
      garments: [...formData.garments, { type: 'Shirt', quantity: 1, price: 100 }]
    });
  };

  const removeGarment = (index) => {
    const newGarments = [...formData.garments];
    newGarments.splice(index, 1);
    setFormData({ ...formData, garments: newGarments });
  };

  const updateGarment = (index, field, value) => {
    const newGarments = [...formData.garments];
    newGarments[index][field] = value;
    setFormData({ ...formData, garments: newGarments });
  };

  const calculateTotal = () => {
    return formData.garments.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.garments.length === 0) {
      toast.error('Please add at least one garment.');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Phone number must be exactly 10 digits.');
      return;
    }

    setLoading(true);
    try {
      await api.post('orders', formData);
      toast.success('Order created successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <h2 className="text-5xl font-normal text-milk font-cursive tracking-tight">Create New Order</h2>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-milk/90 uppercase tracking-wider mb-2 ml-1">Customer Name *</label>
              <input 
                type="text" 
                required
                className="input-field" 
                placeholder="e.g. Jane Doe"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-milk/90 uppercase tracking-wider mb-2 ml-1">Phone Number *</label>
              <input 
                type="tel" 
                required
                pattern="\d{10}"
                title="Phone number must be exactly 10 digits"
                className="input-field" 
                placeholder="e.g. 1234567890"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="border-t border-milk/20 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-milk font-serif">Garments</h3>
              <button 
                type="button" 
                onClick={addGarment}
                className="btn-secondary flex items-center space-x-2 py-2 px-4"
              >
                <Plus size={16} />
                <span>Add Item</span>
              </button>
            </div>

            {formData.garments.length === 0 ? (
              <div className="text-center py-8 bg-milk/5 rounded-xl border border-dashed border-milk/20 text-milk/70">
                <p className="font-medium">No garments added yet.</p>
                <p className="text-sm">Click "Add Item" to begin.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.garments.map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 items-end bg-milk/5 p-4 rounded-xl border border-milk/10 shadow-sm relative group" style={{ zIndex: 50 - index }}>
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-milk/70 uppercase tracking-wider mb-1 ml-1">Type</label>
                      <GlassDropdown 
                        value={item.type}
                        onChange={(val) => updateGarment(index, 'type', val)}
                        options={AVAILABLE_GARMENTS.map(g => ({ value: g.id, label: g.name }))}
                        buttonClassName="input-field py-2"
                        menuClassName="left-0"
                      />
                    </div>
                    <div className="w-full md:w-24">
                      <label className="block text-xs font-bold text-milk/70 uppercase tracking-wider mb-1 ml-1">Qty</label>
                      <input 
                        type="number" 
                        min="1"
                        required
                        className="input-field py-2"
                        value={item.quantity}
                        onChange={(e) => updateGarment(index, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    <div className="w-full md:w-32">
                      <label className="block text-xs font-bold text-milk/70 uppercase tracking-wider mb-1 ml-1">Price (Rs.)</label>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        required
                        className="input-field py-2"
                        value={item.price}
                        onChange={(e) => updateGarment(index, 'price', Number(e.target.value))}
                      />
                    </div>
                    <div className="w-full md:w-32 pb-2">
                      <p className="font-bold text-milk">
                        Rs. {(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeGarment(index)}
                      className="p-2 mb-1 text-red-400 hover:bg-milk/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 flex justify-between items-center border-t border-milk/20">
            <div>
              <p className="text-milk/70 font-bold uppercase tracking-wider text-xs mb-1">Total Estimated Bill</p>
              <h3 className="text-3xl font-bold text-milk font-serif">Rs. {calculateTotal().toFixed(2)}</h3>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className={`btn-primary px-8 py-3 text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOrder;
