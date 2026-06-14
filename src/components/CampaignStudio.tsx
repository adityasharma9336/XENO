import React, { useState } from 'react';
import { Sparkles, MessageSquare, Send, Users, ShieldAlert, Cpu, ArrowRight, Check } from 'lucide-react';
import { api } from '../utils/api';
import type { Customer } from '../types';

interface CampaignStudioProps {
  onCampaignLaunched: () => void;
}

export const CampaignStudio: React.FC<CampaignStudioProps> = ({ onCampaignLaunched }) => {
  // Wizard Steps
  const [step, setStep] = useState<1 | 2>(1);

  // Loading States
  const [parsingSegment, setParsingSegment] = useState(false);
  const [generatingCreative, setGeneratingCreative] = useState(false);
  const [launching, setLaunching] = useState(false);

  // Step 1: Segment Builder State
  const [nlpPrompt, setNlpPrompt] = useState('Customers who spent more than 4000 and haven\'t ordered in last 45 days');
  const [parsedSegment, setParsedSegment] = useState<{
    name: string;
    description: string;
    query_sql: string;
    matchedCount: number;
    previewCustomers: Customer[];
  } | null>(null);


  // Step 2: Campaign Details State
  const [campaignName, setCampaignName] = useState('Win-Back High Spenders');
  const [campaignGoal, setCampaignGoal] = useState('Re-engage dormant customers who spent highly in past');
  const [offerDetails, setOfferDetails] = useState('15% OFF using code COMEBACK15');
  const [messageTemplate, setMessageTemplate] = useState('');
  
  // AI Channel Recommendation state
  const [channelRecommendation, setChannelRecommendation] = useState<{
    channel: 'whatsapp' | 'sms' | 'email' | 'rcs';
    confidence: number;
    reasoning: string;
  } | null>(null);
  
  // Active chosen channel
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'sms' | 'email' | 'rcs'>('whatsapp');

  // Step 1 Trigger: Parse Segment Prompt
  const handleParseSegment = async () => {
    if (!nlpPrompt.trim()) return;
    setParsingSegment(true);
    try {
      const data = await api.parseSegment(nlpPrompt);
      setParsedSegment(data);
      // Auto fill campaign name from generated segment
      setCampaignName(`Campaign for ${data.name}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error parsing segment');
    } finally {
      setParsingSegment(false);
    }
  };

  // Step 2 Trigger: Generate Message copy & Channel Strategic suggestion
  const handleGenerateCreative = async () => {
    if (!parsedSegment) return;
    setGeneratingCreative(true);
    try {
      const [msgData, channelData] = await Promise.all([
        api.generateAIMessage(campaignGoal, parsedSegment.description, offerDetails),
        api.recommendChannel(parsedSegment.description, campaignGoal)
      ]);
      setMessageTemplate(msgData.message);
      setChannelRecommendation(channelData);
      setSelectedChannel(channelData.channel);
      setStep(2);
    } catch (err) {
      alert('Error generating campaign content');
    } finally {
      setGeneratingCreative(false);
    }
  };

  // Final Trigger: Save Segment, Campaign, and launch
  const handleLaunchCampaign = async () => {
    if (!parsedSegment || !messageTemplate) return;
    setLaunching(true);
    try {
      // 1. Save segment first
      const savedSegment = await api.saveSegment({
        name: parsedSegment.name,
        description: parsedSegment.description,
        query_sql: parsedSegment.query_sql
      });

      // 2. Save campaign
      const savedCampaign = await api.createCampaign({
        name: campaignName,
        segment_id: savedSegment.id,
        channel: selectedChannel,
        message_template: messageTemplate
      });

      // 3. Launch the simulation in the backend
      await api.launchCampaign(savedCampaign.id);

      // Reset Form State
      setParsedSegment(null);
      setChannelRecommendation(null);
      setMessageTemplate('');
      setStep(1);
      
      // Callback to root to shift tabs
      onCampaignLaunched();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error launching campaign');
    } finally {
      setLaunching(false);
    }
  };

  const channelIcons = {
    whatsapp: '💬',
    sms: '📱',
    email: '✉️',
    rcs: '⚡'
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Sparkles className="text-indigo-400 fill-indigo-400/20" size={24} />
            <span>AI Campaign Studio</span>
          </h2>
          <p className="text-sm text-dark-500">Intelligently target shoppers, optimize messaging copy, and launch campaigns.</p>
        </div>
        
        {/* Step Indicator */}
        <div className="flex items-center space-x-2 text-xs bg-dark-800/80 px-3.5 py-2 rounded-xl border border-dark-700">
          <span className={`w-5 h-5 flex items-center justify-center rounded-full font-bold ${step === 1 ? 'bg-primary text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {step > 1 ? <Check size={12} /> : '1'}
          </span>
          <span className={step === 1 ? 'text-white font-medium' : 'text-dark-500'}>Target Segment</span>
          <ArrowRight size={12} className="text-dark-500" />
          <span className={`w-5 h-5 flex items-center justify-center rounded-full font-bold ${step === 2 ? 'bg-primary text-white' : 'bg-dark-700 text-dark-500'}`}>
            2
          </span>
          <span className={step === 2 ? 'text-white font-medium' : 'text-dark-500'}>Creative & Launch</span>
        </div>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Segment Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-dark-700/50 space-y-4">
              <div className="flex items-center space-x-2 text-sm text-indigo-400 font-semibold uppercase tracking-wider">
                <Cpu size={16} />
                <span>Natural Language Segment Builder</span>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs text-dark-500">Describe the shoppers you want to reach</label>
                <textarea
                  value={nlpPrompt}
                  onChange={(e) => setNlpPrompt(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-dark-800/80 border border-dark-700 text-white rounded-xl placeholder-dark-500 focus:outline-none focus:border-primary font-sans text-sm resize-none"
                  placeholder="Example: Customers from Delhi who spent more than 5000 and haven't ordered in the last 30 days..."
                />
              </div>

              <button
                onClick={handleParseSegment}
                disabled={parsingSegment}
                className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold text-sm transition flex items-center justify-center space-x-2 glow-indigo disabled:opacity-50"
              >
                {parsingSegment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Database & SQL...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="fill-white/20" />
                    <span>Analyze & Match Audience</span>
                  </>
                )}
              </button>
            </div>

            {/* AI segment preview */}
            {parsedSegment && (
              <div className="glass-panel rounded-2xl p-6 border border-dark-700/50 space-y-4">
                <div className="flex justify-between items-center border-b border-dark-700 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">{parsedSegment.name}</h3>
                    <p className="text-xs text-dark-500 mt-0.5">{parsedSegment.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-400">{parsedSegment.matchedCount}</span>
                    <span className="text-[10px] text-dark-500 block">Matched Shoppers</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs text-dark-500 font-semibold uppercase tracking-wider flex items-center space-x-1">
                    <Users size={12} />
                    <span>Audience Preview (Max 5 shown)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {parsedSegment.previewCustomers.slice(0, 5).map((c) => (
                      <div key={c.id} className="bg-dark-800/40 border border-dark-700/40 rounded-xl p-3 flex items-center space-x-3 text-xs">
                        <div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center text-primary font-bold">
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="overflow-hidden">
                          <span className="font-semibold text-white block truncate">{c.name}</span>
                          <span className="text-dark-500 block truncate">{c.city} • Spend: ₹{Math.round(c.total_spent)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/30 border border-dark-700/30 rounded-xl p-3 font-mono text-[10px] text-indigo-300 overflow-x-auto whitespace-pre">
                  <span className="text-dark-500 font-semibold select-none">Generated SQL:</span><br />
                  {parsedSegment.query_sql}
                </div>
              </div>
            )}
          </div>

          {/* Goals & Campaign Settings (Right column) */}
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-dark-700/50 space-y-4">
              <h3 className="font-bold text-white text-base">Campaign Strategy</h3>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-dark-500">Campaign Name</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-800/80 border border-dark-700 text-white rounded-lg text-sm placeholder-dark-500 focus:outline-none focus:border-primary"
                    placeholder="e.g. Win-Back Inactives"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-dark-500">Campaign Goal</label>
                  <input
                    type="text"
                    value={campaignGoal}
                    onChange={(e) => setCampaignGoal(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-800/80 border border-dark-700 text-white rounded-lg text-sm placeholder-dark-500 focus:outline-none focus:border-primary"
                    placeholder="e.g. Re-engage shoppers with discount"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-dark-500">Offer / Incentives</label>
                  <input
                    type="text"
                    value={offerDetails}
                    onChange={(e) => setOfferDetails(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-800/80 border border-dark-700 text-white rounded-lg text-sm placeholder-dark-500 focus:outline-none focus:border-primary"
                    placeholder="e.g. 15% OFF, Free Delivery"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateCreative}
                disabled={generatingCreative || !parsedSegment || parsedSegment.matchedCount === 0}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-dark-800 disabled:text-dark-500 text-white rounded-xl font-semibold text-sm transition flex items-center justify-center space-x-2 glow-emerald disabled:opacity-50"
              >
                {generatingCreative ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Consulting AI Strategy...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Creative & Channel</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
              
              {!parsedSegment && (
                <div className="flex items-center space-x-2 text-[10px] text-dark-500 bg-dark-800/30 p-2.5 rounded-lg border border-dark-700/20">
                  <ShieldAlert size={14} className="text-amber-500 flex-shrink-0" />
                  <span>Please analyze and match a segment first to proceed.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 2 && parsedSegment && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Creative Draft */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-dark-700/50 space-y-4">
              <div className="flex items-center justify-between border-b border-dark-700 pb-3">
                <div className="flex items-center space-x-2 text-sm text-indigo-400 font-semibold uppercase tracking-wider">
                  <MessageSquare size={16} />
                  <span>Personalized Campaign Creative</span>
                </div>
                <span className="text-[10px] text-dark-500 bg-dark-800 border border-dark-700 px-2 py-0.5 rounded font-mono">
                  Supports: {"{{name}}"}, {"{{city}}"}, {"{{email}}"}, {"{{phone}}"}
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-dark-500">Message copy (AI Generated template, editable)</label>
                <textarea
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 bg-dark-800/80 border border-dark-700 text-white rounded-xl placeholder-dark-500 focus:outline-none focus:border-primary font-mono text-sm resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2.5 bg-dark-800 border border-dark-700 hover:bg-dark-700 text-white rounded-xl text-sm transition font-medium"
                >
                  Back to Audience
                </button>
                
                <button
                  onClick={handleLaunchCampaign}
                  disabled={launching || !messageTemplate}
                  className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold text-sm transition flex items-center justify-center space-x-2 glow-indigo"
                >
                  {launching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Launching Campaign simulation...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Launch Campaign ({parsedSegment.matchedCount} Shoppers)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Channel Recommendation panel */}
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-dark-700/50 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center space-x-1.5">
                <Sparkles size={16} className="text-emerald-400 fill-emerald-400/20" />
                <span>AI Channel Strategy</span>
              </h3>

              {channelRecommendation && (
                <div className="space-y-4">
                  <div className="bg-dark-800/60 border border-dark-700/50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{channelIcons[channelRecommendation.channel]}</span>
                        <span className="font-bold text-white capitalize">{channelRecommendation.channel}</span>
                      </div>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-semibold font-mono border border-emerald-500/20">
                        {channelRecommendation.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed italic">
                      "{channelRecommendation.reasoning}"
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-dark-500">Dispatch Channel</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {(['whatsapp', 'sms', 'email', 'rcs'] as const).map((ch) => (
                        <button
                          key={ch}
                          onClick={() => setSelectedChannel(ch)}
                          className={`py-2 px-3 rounded-lg border text-left flex items-center space-x-1.5 capitalize transition ${selectedChannel === ch ? 'bg-primary/25 border-primary text-white font-semibold' : 'bg-dark-800/40 border-dark-700 text-dark-500 hover:text-white hover:border-dark-600'}`}
                        >
                          <span>{channelIcons[ch]}</span>
                          <span>{ch}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CampaignStudio;
