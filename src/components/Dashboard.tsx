import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, Users, ShoppingCart, Percent, TrendingUp, ChevronRight } from 'lucide-react';
import { api } from '../utils/api';
import type { Customer, Campaign } from '../types';
import { LiveConsole } from './LiveConsole';

interface DashboardProps {
  onNavigateToStudio: () => void;
  onNavigateToReports: () => void;
  onNavigateToShoppers: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigateToStudio, 
  onNavigateToReports, 
  onNavigateToShoppers 
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Right side panel tab: dispatches or conversions list
  const [rightPanelTab, setRightPanelTab] = useState<'dispatches' | 'conversions'>('dispatches');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerData, campaignData, orderData] = await Promise.all([
          api.getCustomers(),
          api.getCampaigns(),
          api.getOrders()
        ]);
        setCustomers(customerData);
        setCampaigns(campaignData);
        setOrders(orderData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    // Periodically update dashboard details (every 4s)
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Compute stats
  const totalShoppers = customers.length;
  const activeCampaigns = campaigns.filter(c => c.status !== 'draft').length;
  
  // Total Attributed Sales (from database metrics)
  const totalSent = campaigns.reduce((acc, curr) => acc + (curr.sent || 0), 0);
  const totalConverted = campaigns.reduce((acc, curr) => acc + (curr.converted || 0), 0);
  
  // Attributed revenue from orders made through campaigns
  const totalAttributedRevenue = campaigns.reduce((acc, curr) => {
    // Average order value of ₹2200 per conversion for simple frontend dashboard math
    return acc + ((curr.converted || 0) * 2200);
  }, 0);

  const conversionRate = totalSent > 0 ? ((totalConverted / totalSent) * 100).toFixed(1) : '0';

  // Group shopper spend by city for Recharts
  const cityDataMap: { [key: string]: number } = {};
  customers.forEach(c => {
    cityDataMap[c.city] = (cityDataMap[c.city] || 0) + c.total_spent;
  });
  
  const cityChartData = Object.keys(cityDataMap).map(city => ({
    name: city,
    Spend: Math.round(cityDataMap[city])
  })).sort((a, b) => b.Spend - a.Spend);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-dark-850 animate-shimmer rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-dark-850 animate-shimmer rounded-2xl" />
          <div className="h-96 bg-dark-850 animate-shimmer rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-purple-600 p-8 text-white border border-white/10 glow-indigo">
        <div className="relative z-10 space-y-3 max-w-xl">
          <h2 className="text-3xl font-extrabold tracking-tight">AI-Powered Shopper Engagement</h2>
          <p className="text-sm text-indigo-100 leading-relaxed">
            Organize customer databases, auto-build AI segments, and push strategic marketing alerts across WhatsApp, RCS, Email, and SMS with real-time conversion insights.
          </p>
          <div className="pt-2">
            <button 
              onClick={onNavigateToStudio}
              className="px-5 py-2.5 bg-white text-primary hover:bg-indigo-50 font-bold rounded-xl text-xs transition flex items-center space-x-1.5"
            >
              <Sparkles size={14} className="fill-primary" />
              <span>Launch New Campaign Studio</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute right-0 bottom-0 top-0 opacity-15 flex items-center justify-center pointer-events-none pr-12">
          <TrendingUp size={200} />
        </div>
      </div>

      {/* KPI Cards Grid - CLICKABLE & INTERACTIVE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Attributed Sales */}
        <div 
          onClick={onNavigateToReports}
          className="cursor-pointer glass-panel rounded-2xl p-5 border border-dark-700/50 hover:border-emerald-500/50 hover:bg-dark-800/60 hover-scale transition duration-200"
          title="Click to view analytics reports"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-dark-500 uppercase tracking-wider">Attributed Sales</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <ShoppingCart size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{formatCurrency(totalAttributedRevenue)}</h3>
          <p className="text-[10px] text-emerald-400 flex items-center mt-1">
            <span>🚀 Click to inspect LTV reports</span>
          </p>
        </div>

        {/* Card 2: Conversion Rate */}
        <div 
          onClick={onNavigateToReports}
          className="cursor-pointer glass-panel rounded-2xl p-5 border border-dark-700/50 hover:border-primary/50 hover:bg-dark-800/60 hover-scale transition duration-200"
          title="Click to view analytics reports"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-dark-500 uppercase tracking-wider">Conversion Rate</span>
            <div className="p-2 bg-indigo-500/10 text-primary rounded-lg">
              <Percent size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{conversionRate}%</h3>
          <p className="text-[10px] text-primary flex items-center mt-1">
            <span>📈 Click to view campaign funnel</span>
          </p>
        </div>

        {/* Card 3: Total Shoppers */}
        <div 
          onClick={onNavigateToShoppers}
          className="cursor-pointer glass-panel rounded-2xl p-5 border border-dark-700/50 hover:border-purple-500/50 hover:bg-dark-800/60 hover-scale transition duration-200"
          title="Click to open shopper directory"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-dark-500 uppercase tracking-wider">Total Shoppers</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Users size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{totalShoppers}</h3>
          <p className="text-[10px] text-purple-400 flex items-center mt-1">
            <span>👥 Click to view shopper profiles</span>
          </p>
        </div>

        {/* Card 4: Active Campaigns */}
        <div 
          onClick={onNavigateToReports}
          className="cursor-pointer glass-panel rounded-2xl p-5 border border-dark-700/50 hover:border-amber-500/50 hover:bg-dark-800/60 hover-scale transition duration-200"
          title="Click to view campaign dispatches"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-dark-500 uppercase tracking-wider">Active Campaigns</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <TrendingUp size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{activeCampaigns}</h3>
          <p className="text-[10px] text-amber-400 flex items-center mt-1">
            <span>🔔 Click to monitor server queues</span>
          </p>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Geography chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-dark-700/50 space-y-4">
          <div className="flex justify-between items-center border-b border-dark-700 pb-3">
            <div>
              <h4 className="font-bold text-white text-base">Revenue Distribution by City</h4>
              <p className="text-xs text-dark-500">Accumulated shopper lifetime value across target regions</p>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={cityChartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
                <XAxis dataKey="name" stroke="#4B5563" fontSize={11} />
                <YAxis stroke="#4B5563" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#151B2C', border: '1px solid #1F293D', borderRadius: '10px' }}
                  labelStyle={{ color: '#9CA3AF', fontWeight: 'bold' }}
                  itemStyle={{ color: '#FFF' }}
                  formatter={(value) => [`₹${value}`, 'LTV Spend']}
                />
                <Bar dataKey="Spend" fill="#6366F1" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right side: Dynamic Campaign/Conversions List with Tab selector */}
        <div className="glass-panel rounded-2xl p-6 border border-dark-700/50 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Interactive Tab Selectors */}
            <div className="flex border-b border-dark-700/60 pb-1.5 mb-2.5">
              <button
                onClick={() => setRightPanelTab('dispatches')}
                className={`flex-1 pb-2 text-xs font-bold text-center border-b-2 transition duration-200 ${rightPanelTab === 'dispatches' ? 'border-primary text-white' : 'border-transparent text-dark-500 hover:text-white'}`}
              >
                Recent Dispatches
              </button>
              <button
                onClick={() => setRightPanelTab('conversions')}
                className={`flex-1 pb-2 text-xs font-bold text-center border-b-2 transition duration-200 ${rightPanelTab === 'conversions' ? 'border-primary text-white' : 'border-transparent text-dark-500 hover:text-white'}`}
              >
                Live Conversions
              </button>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {rightPanelTab === 'dispatches' ? (
                campaigns.filter(c => c.status !== 'draft').slice(0, 4).length === 0 ? (
                  <p className="text-xs text-dark-500 italic py-8 text-center">No campaigns launched yet.</p>
                ) : (
                  campaigns.filter(c => c.status !== 'draft').slice(0, 4).map((c) => (
                    <div key={c.id} className="bg-dark-800/40 border border-dark-700/50 rounded-xl p-3 flex justify-between items-center hover:bg-dark-700/20 transition">
                      <div className="space-y-1 overflow-hidden">
                        <span className="text-xs font-semibold text-white block truncate">{c.name}</span>
                        <span className="text-[10px] text-dark-500 block truncate capitalize">Channel: {c.channel}</span>
                      </div>
                      <button 
                        onClick={onNavigateToReports}
                        className="text-[10px] text-primary hover:text-primary-hover font-semibold flex items-center space-x-0.5 flex-shrink-0"
                      >
                        <span>Reports</span>
                        <ChevronRight size={10} />
                      </button>
                    </div>
                  ))
                )
              ) : (
                orders.filter(o => o.campaign_id !== null).slice(0, 4).length === 0 ? (
                  <p className="text-xs text-dark-500 italic py-8 text-center">No sales conversion tracked yet.</p>
                ) : (
                  orders.filter(o => o.campaign_id !== null).slice(0, 4).map((o) => (
                    <div key={o.id} className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 flex justify-between items-center hover:bg-emerald-500/10 transition">
                      <div className="space-y-1 overflow-hidden">
                        <span className="text-xs font-semibold text-white block truncate">{o.customer_name}</span>
                        <span className="text-[10px] text-dark-500 block truncate">Bought: {o.product}</span>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-xs font-bold text-emerald-400 block">₹{o.amount}</span>
                        <span className="text-[8px] text-dark-500 block">Camp #{o.campaign_id}</span>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>

          <button
            onClick={onNavigateToStudio}
            className="w-full mt-4 py-2.5 bg-dark-800 hover:bg-dark-700 text-white rounded-xl text-xs font-semibold border border-dark-700 transition"
          >
            Create New Campaign
          </button>
        </div>
      </div>

      {/* Live web logs console section */}
      <LiveConsole />
    </div>
  );
};
export default Dashboard;
