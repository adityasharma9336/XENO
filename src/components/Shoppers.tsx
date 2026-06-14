import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, MapPin, Calendar, CreditCard, ChevronRight, UserPlus, Upload, X } from 'lucide-react';
import { api } from '../utils/api';
import type { Customer, Order } from '../types';

export const Shoppers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Manual Ingestion State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShopper, setNewShopper] = useState({ name: '', email: '', phone: '', age: '', city: '' });
  const [adding, setAdding] = useState(false);

  const fetchData = async () => {
    try {
      const [customerData, orderData] = await Promise.all([
        api.getCustomers(),
        api.getOrders()
      ]);
      setCustomers(customerData);
      setOrders(orderData);
      if (customerData.length > 0 && !selectedCustomer) {
        setSelectedCustomer(customerData[0]);
      }
    } catch (err) {
      console.error('Failed to load customers/orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddShopper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopper.name || !newShopper.email || !newShopper.phone) {
      alert('Please fill out Name, Email, and Phone fields.');
      return;
    }
    setAdding(true);
    try {
      const created = await api.addCustomer({
        name: newShopper.name,
        email: newShopper.email,
        phone: newShopper.phone,
        age: newShopper.age ? parseInt(newShopper.age, 10) : undefined,
        city: newShopper.city
      });
      setCustomers([created, ...customers]);
      setSelectedCustomer(created);
      setShowAddModal(false);
      setNewShopper({ name: '', email: '', phone: '', age: '', city: '' });
    } catch (err: any) {
      alert(err.message || 'Failed to ingest shopper profile.');
    } finally {
      setAdding(false);
    }
  };

  const handleBulkImport = async () => {
    const mockImports = [
      { name: 'Karan Johar', email: 'karan.j@example.com', phone: '+919830012345', age: 51, city: 'Mumbai' },
      { name: 'Alia Bhatt', email: 'alia.b@example.com', phone: '+919920054321', age: 30, city: 'Delhi' },
      { name: 'Ranbir Kapoor', email: 'ranbir.k@example.com', phone: '+919930067890', age: 41, city: 'Mumbai' },
      { name: 'Kiara Advani', email: 'kiara.a@example.com', phone: '+919167888123', age: 31, city: 'Bangalore' },
      { name: 'Virat Kohli', email: 'virat.k@example.com', phone: '+919810018181', age: 35, city: 'Delhi' }
    ];
    
    try {
      const results = [];
      for (const shopper of mockImports) {
        const res = await api.addCustomer(shopper);
        results.push(res);
      }
      setCustomers([...results, ...customers]);
      alert(`Success! Simulated bulk ingestion of ${results.length} shopper profiles.`);
    } catch (err: any) {
      alert('Some mock shoppers were already ingested.');
    }
  };

  const getTierBadge = (ltv: number) => {
    if (ltv >= 10000) {
      return (
        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wide">
          VIP Elite
        </span>
      );
    }
    if (ltv >= 5000) {
      return (
        <span className="bg-primary/20 text-indigo-400 border border-primary/20 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wide">
          VIP Tier
        </span>
      );
    }
    if (ltv > 0) {
      return (
        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md text-[9px] font-medium">
          Active
        </span>
      );
    }
    return (
      <span className="bg-dark-700 text-dark-500 border border-dark-600/50 px-2 py-0.5 rounded-md text-[9px]">
        New Shopper
      </span>
    );
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const customerOrders = orders.filter(o => o.customer_id === selectedCustomer?.id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 w-full animate-shimmer rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 animate-shimmer rounded-2xl" />
          <div className="h-96 animate-shimmer rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Directory Title Section */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Shopper Directory</h2>
          <p className="text-sm text-dark-500">Search customer attributes, analyze spending segments, and manual database ingestion.</p>
        </div>
        
        {/* Manual + Bulk Action buttons */}
        <div className="flex items-center space-x-3 self-start md:self-center">
          <button
            onClick={handleBulkImport}
            className="px-4 py-2.5 bg-dark-800 border border-dark-700 hover:bg-dark-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
            title="Import simulated shopper batch"
          >
            <Upload size={14} />
            <span>Simulate Bulk CSV Ingestion</span>
          </button>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-lg shadow-primary/10"
          >
            <UserPlus size={14} />
            <span>+ Add New Shopper</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-500 pointer-events-none">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-800/80 border border-dark-700 text-white rounded-xl placeholder-dark-500 focus:outline-none focus:border-primary transition"
          />
        </div>
        <div className="text-sm text-dark-500 self-end md:self-center">
          Showing <span className="text-white font-medium">{filteredCustomers.length}</span> of {customers.length} shoppers
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden border border-dark-700/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-700 bg-dark-800/40 text-xs font-semibold uppercase tracking-wider text-dark-500">
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6 text-right">Total Spent</th>
                  <th className="py-4 px-6">Last Order</th>
                  <th className="py-4 px-6 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/50 text-sm">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-dark-500 italic">
                      No shoppers match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr 
                      key={c.id} 
                      onClick={() => setSelectedCustomer(c)}
                      className={`cursor-pointer hover:bg-dark-700/20 transition-colors ${selectedCustomer?.id === c.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}
                    >
                      <td className="py-3.5 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 bg-dark-700 rounded-full flex items-center justify-center text-primary font-bold flex-shrink-0">
                            {c.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-white">{c.name}</span>
                              {getTierBadge(c.total_spent)}
                            </div>
                            <div className="text-xs text-dark-500 mt-0.5">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-dark-500">
                        <div className="flex items-center space-x-1.5">
                          <MapPin size={14} className="text-dark-500" />
                          <span>{c.city} (Age {c.age})</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-right font-semibold text-white">
                        {formatCurrency(c.total_spent)}
                      </td>
                      <td className="py-3.5 px-6 text-dark-500">
                        {formatDate(c.last_order_date)}
                      </td>
                      <td className="py-3.5 px-6">
                        <ChevronRight size={16} className={`text-dark-500 transition-transform ${selectedCustomer?.id === c.id ? 'translate-x-1 text-primary' : ''}`} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Customer Side-Panel */}
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-dark-700/50 space-y-6">
              <div className="flex items-center space-x-4 border-b border-dark-700 pb-5">
                <div className="w-14 h-14 bg-primary/20 text-primary rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedCustomer.name}</h3>
                  <p className="text-xs text-dark-500">{selectedCustomer.phone}</p>
                  <p className="text-xs text-dark-500">{selectedCustomer.email}</p>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-3">
                  <span className="text-[10px] text-dark-500 uppercase tracking-wider block mb-1">Lifetime Value</span>
                  <div className="flex items-center space-x-1.5">
                    <CreditCard size={14} className="text-emerald-400" />
                    <span className="text-sm font-bold text-white">{formatCurrency(selectedCustomer.total_spent)}</span>
                  </div>
                </div>
                <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-3">
                  <span className="text-[10px] text-dark-500 uppercase tracking-wider block mb-1">Orders Count</span>
                  <div className="flex items-center space-x-1.5">
                    <ShoppingBag size={14} className="text-primary" />
                    <span className="text-sm font-bold text-white">{customerOrders.length} orders</span>
                  </div>
                </div>
              </div>

              {/* Purchase History */}
              <div className="space-y-3">
                <h4 className="font-semibold text-xs text-dark-500 uppercase tracking-wider">Purchase History</h4>
                
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {customerOrders.length === 0 ? (
                    <p className="text-xs text-dark-500 italic py-4">No purchases recorded.</p>
                  ) : (
                    customerOrders.map((o) => (
                      <div key={o.id} className="bg-dark-800/30 hover:bg-dark-800/50 border border-dark-700/40 rounded-xl p-3 flex justify-between items-center transition animate-fade-in">
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-white block">{o.product}</span>
                          <div className="flex items-center space-x-1 text-[10px] text-dark-500">
                            <Calendar size={10} />
                            <span>{formatDate(o.order_date)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-white">{formatCurrency(o.amount)}</span>
                          {o.campaign_id && (
                            <span className="block text-[8px] bg-emerald-500/10 text-emerald-400 px-1 py-0.5 rounded font-mono mt-0.5">
                              Campaign #{o.campaign_id}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Manual Ingestion Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-dark-700 p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-dark-750 text-dark-500 hover:text-white rounded-lg transition"
            >
              <X size={18} />
            </button>
            
            <div className="flex items-center space-x-2 text-primary font-bold text-base border-b border-dark-700 pb-3">
              <span>Ingest New Customer Profile</span>
            </div>

            <form onSubmit={handleAddShopper} className="space-y-3.5">
              <div className="space-y-1 text-xs">
                <label className="text-dark-500 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newShopper.name}
                  onChange={(e) => setNewShopper({ ...newShopper, name: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg placeholder-dark-500 focus:outline-none focus:border-primary"
                  placeholder="e.g. Priyal Patel"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-dark-500 font-semibold">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newShopper.email}
                  onChange={(e) => setNewShopper({ ...newShopper, email: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg placeholder-dark-500 focus:outline-none focus:border-primary"
                  placeholder="priyal@example.com"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-dark-500 font-semibold">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={newShopper.phone}
                  onChange={(e) => setNewShopper({ ...newShopper, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg placeholder-dark-500 focus:outline-none focus:border-primary"
                  placeholder="+919876543210"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-xs">
                  <label className="text-dark-500 font-semibold">Age</label>
                  <input
                    type="number"
                    value={newShopper.age}
                    onChange={(e) => setNewShopper({ ...newShopper, age: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg placeholder-dark-500 focus:outline-none focus:border-primary"
                    placeholder="25"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <label className="text-dark-500 font-semibold">City</label>
                  <input
                    type="text"
                    value={newShopper.city}
                    onChange={(e) => setNewShopper({ ...newShopper, city: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg placeholder-dark-500 focus:outline-none focus:border-primary"
                    placeholder="Delhi"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-dark-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-dark-800 hover:bg-dark-750 text-white rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                >
                  {adding ? 'Ingesting...' : 'Add Shopper'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Shoppers;
