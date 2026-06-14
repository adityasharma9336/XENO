import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, MessageSquare, BarChart3, Users, Clock, Compass } from 'lucide-react';
import { api } from '../utils/api';
import type { Campaign, Communication } from '../types';

export const CampaignReports: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  // Selected Campaign Details
  const [campaignDetails, setCampaignDetails] = useState<{
    campaign: Campaign;
    metrics: any;
    communications: Communication[];
  } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // AI Insights State
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const data = await api.getCampaigns();
      setCampaigns(data);
      if (data.length > 0 && selectedCampaignId === null) {
        setSelectedCampaignId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // Refresh campaigns list periodically (every 4s) to update stats in sending state
    const interval = setInterval(fetchCampaigns, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedCampaignId === null) return;

    const fetchDetails = async () => {
      setLoadingDetails(true);
      try {
        const data = await api.getCampaignDetails(selectedCampaignId);
        setCampaignDetails(data);
        setAiInsights(''); // Reset insights for new selection
      } catch (err) {
        console.error('Failed to load campaign details:', err);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
    
    // Auto-refresh details if the campaign is currently 'sending'
    const activeCampaign = campaigns.find(c => c.id === selectedCampaignId);
    let interval: any;
    if (activeCampaign && activeCampaign.status === 'sending') {
      interval = setInterval(async () => {
        const data = await api.getCampaignDetails(selectedCampaignId);
        setCampaignDetails(data);
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedCampaignId, campaigns]);

  const handleGenerateInsights = async () => {
    if (selectedCampaignId === null) return;
    setLoadingInsights(true);
    try {
      const data = await api.getCampaignInsights(selectedCampaignId);
      setAiInsights(data.insights);
    } catch (err) {
      console.error('Failed to get insights:', err);
      setAiInsights('Failed to generate insights. Please try again.');
    } finally {
      setLoadingInsights(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'sending':
        return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse';
      case 'draft':
      default:
        return 'bg-dark-700 text-dark-500 border border-dark-600/50';
    }
  };

  const getCommunicationStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONVERTED':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20';
      case 'CLICKED':
        return 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20';
      case 'OPENED':
      case 'READ':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/20';
      case 'DELIVERED':
        return 'bg-purple-500/15 text-purple-400 border border-purple-500/20';
      case 'FAILED':
        return 'bg-red-500/15 text-red-400 border border-red-500/20';
      case 'SENT':
      default:
        return 'bg-dark-700 text-dark-500';
    }
  };

  const formatPercentage = (numerator: number, denominator: number) => {
    if (!denominator) return '0%';
    return `${Math.round((numerator / denominator) * 100)}%`;
  };

  const channelIcons = {
    whatsapp: '💬',
    sms: '📱',
    email: '✉️',
    rcs: '⚡'
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-dark-800 animate-shimmer rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="h-96 bg-dark-850 animate-shimmer rounded-2xl" />
          <div className="lg:col-span-3 h-96 bg-dark-850 animate-shimmer rounded-2xl" />
        </div>
      </div>
    );
  }

  // Set up chart data from metrics
  const chartData = campaignDetails?.metrics ? [
    { name: 'Sent', value: campaignDetails.metrics.sent },
    { name: 'Delivered', value: campaignDetails.metrics.delivered },
    { name: 'Opened', value: campaignDetails.metrics.opened },
    { name: 'Clicked', value: campaignDetails.metrics.clicked },
    { name: 'Converted', value: campaignDetails.metrics.converted }
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Campaign Analytics Reports</h2>
        <p className="text-sm text-dark-500">Monitor live campaign funnels, customer dispatches, and consult growth AI insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Campaign List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-xs text-dark-500 uppercase tracking-wider">Campaign History</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {campaigns.length === 0 ? (
              <div className="glass-panel rounded-2xl p-6 text-center text-dark-500 italic text-sm">
                No campaigns found. Build and launch one in the Campaign Studio.
              </div>
            ) : (
              campaigns.map((camp) => (
                <div
                  key={camp.id}
                  onClick={() => setSelectedCampaignId(camp.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${selectedCampaignId === camp.id ? 'bg-primary/15 border-primary shadow-lg shadow-primary/5' : 'bg-dark-800/40 border-dark-750 hover:bg-dark-700/20 hover:border-dark-600'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-white truncate max-w-[150px]">{camp.name}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-mono ${getStatusColor(camp.status)}`}>
                      {camp.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-dark-500">
                    <div className="flex items-center space-x-1 capitalize">
                      <span>{channelIcons[camp.channel]}</span>
                      <span>{camp.channel}</span>
                    </div>
                    <span>{camp.converted || 0} purchases</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Detailed Stats Panel */}
        <div className="lg:col-span-3 space-y-6">
          {loadingDetails ? (
            <div className="glass-panel rounded-2xl p-10 flex flex-col items-center justify-center space-y-4 h-[500px]">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-dark-500">Loading campaign statistics and history...</p>
            </div>
          ) : campaignDetails ? (
            <>
              {/* Campaign Header Summary */}
              <div className="glass-panel rounded-2xl p-6 border border-dark-700/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{campaignDetails.campaign.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-dark-500 mt-1.5">
                    <span className="capitalize">{channelIcons[campaignDetails.campaign.channel]} {campaignDetails.campaign.channel}</span>
                    <span>•</span>
                    <span className="flex items-center"><Users size={12} className="mr-1" /> {campaignDetails.campaign.segment_name}</span>
                    <span>•</span>
                    <span className="flex items-center"><Clock size={12} className="mr-1" /> Launched {new Date(campaignDetails.campaign.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-dark-800/40 border border-dark-750 px-4 py-2.5 rounded-xl text-center min-w-[80px]">
                    <span className="text-[10px] text-dark-500 block uppercase font-semibold">Sent</span>
                    <span className="text-base font-bold text-white">{campaignDetails.metrics.sent}</span>
                  </div>
                  <div className="bg-dark-800/40 border border-dark-750 px-4 py-2.5 rounded-xl text-center min-w-[80px]">
                    <span className="text-[10px] text-dark-500 block uppercase font-semibold">Opened</span>
                    <span className="text-base font-bold text-blue-400">
                      {formatPercentage(campaignDetails.metrics.opened, campaignDetails.metrics.delivered)}
                    </span>
                  </div>
                  <div className="bg-dark-800/40 border border-dark-750 px-4 py-2.5 rounded-xl text-center min-w-[80px]">
                    <span className="text-[10px] text-dark-500 block uppercase font-semibold">Purchases</span>
                    <span className="text-base font-bold text-emerald-400">{campaignDetails.metrics.converted}</span>
                  </div>
                </div>
              </div>

              {/* Message Template Text */}
              <div className="glass-panel rounded-2xl p-5 border border-dark-700/50 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs text-dark-500 font-semibold uppercase tracking-wider">
                  <MessageSquare size={14} />
                  <span>Message Copy Template</span>
                </div>
                <div className="bg-dark-800/40 border border-dark-750 p-4 rounded-xl font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed select-all">
                  {campaignDetails.campaign.message_template}
                </div>
              </div>

              {/* Conversion Funnel Visualization */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Funnel chart */}
                <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-dark-700/50 space-y-4">
                  <h4 className="font-bold text-white text-sm flex items-center space-x-1.5">
                    <BarChart3 size={16} className="text-primary" />
                    <span>Conversion Funnel Analysis</span>
                  </h4>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
                        <XAxis dataKey="name" stroke="#4B5563" fontSize={11} />
                        <YAxis stroke="#4B5563" fontSize={11} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#151B2C', border: '1px solid #1F293D', borderRadius: '10px' }}
                          labelStyle={{ color: '#9CA3AF', fontWeight: 'bold' }}
                          itemStyle={{ color: '#FFF' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AI Performance Insights */}
                <div className="glass-panel rounded-2xl p-6 border border-dark-700/50 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center space-x-1.5">
                      <Sparkles size={16} className="text-emerald-400 fill-emerald-400/20" />
                      <span>AI Growth Insights</span>
                    </h4>

                    {loadingInsights ? (
                      <div className="space-y-3 py-6">
                        <div className="h-4 w-full bg-dark-700 animate-shimmer rounded" />
                        <div className="h-4 w-5/6 bg-dark-700 animate-shimmer rounded" />
                        <div className="h-4 w-4/6 bg-dark-700 animate-shimmer rounded" />
                      </div>
                    ) : aiInsights ? (
                      <div className="text-xs text-gray-300 leading-relaxed space-y-3 overflow-y-auto max-h-[170px] pr-1 whitespace-pre-wrap font-sans">
                        {aiInsights}
                      </div>
                    ) : (
                      <p className="text-xs text-dark-500 leading-relaxed py-4 italic">
                        Let AI analyze conversion patterns, high-performing cohorts, and channels.
                      </p>
                    )}
                  </div>

                  {!aiInsights && !loadingInsights && (
                    <button
                      onClick={handleGenerateInsights}
                      className="w-full mt-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-2 shadow-md shadow-emerald-500/10"
                    >
                      <Sparkles size={12} className="fill-white/20" />
                      <span>Generate Campaign Insights</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Targeted Customers & Individual Statuses */}
              <div className="glass-panel rounded-2xl p-6 border border-dark-700/50 space-y-4">
                <h4 className="font-bold text-white text-sm flex items-center space-x-1.5">
                  <Users size={16} className="text-primary" />
                  <span>Audience Dispatch Logs ({campaignDetails.communications.length} Shoppers)</span>
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-dark-700 text-dark-500 font-semibold uppercase bg-dark-800/20">
                        <th className="py-3 px-4">Recipient</th>
                        <th className="py-3 px-4">Contact Info</th>
                        <th className="py-3 px-4">Channel</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Updated At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700/30 text-gray-300">
                      {campaignDetails.communications.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-dark-500 italic">No communications dispatched yet.</td>
                        </tr>
                      ) : (
                        campaignDetails.communications.map((comm) => (
                          <tr key={comm.id} className="hover:bg-dark-700/10 transition">
                            <td className="py-2.5 px-4 font-semibold text-white">{comm.customer_name}</td>
                            <td className="py-2.5 px-4 text-dark-500">
                              <div>{comm.customer_email}</div>
                              <div>{comm.customer_phone}</div>
                            </td>
                            <td className="py-2.5 px-4 capitalize font-mono text-dark-500">{comm.channel}</td>
                            <td className="py-2.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[9px] uppercase border ${getCommunicationStatusBadge(comm.status)}`}>
                                {comm.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-dark-500">
                              {new Date(comm.updated_at).toLocaleTimeString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-panel rounded-2xl p-10 flex flex-col items-center justify-center space-y-4 h-[500px]">
              <Compass size={40} className="text-dark-500" />
              <p className="text-sm text-dark-500">Select a campaign on the left to review metrics and dispatches.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CampaignReports;
