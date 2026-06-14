import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight, 
  Zap, 
  Target, 
  Database, 
  Terminal, 
  MessageSquare, 
  Send, 
  Info, 
  Cpu, 
  Code
} from 'lucide-react';

interface LandingPageProps {
  onStartApp: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartApp, onOpenAuth }) => {
  // AI Segmenter Simulator State
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0);
  const [typedPrompt, setTypedPrompt] = useState<string>('');
  const [customSql, setCustomSql] = useState<string | null>(null);
  const [simulatedMatchCount, setSimulatedMatchCount] = useState<number | null>(null);

  const prompts = [
    {
      text: "Shoppers with lifetime spending over 5000 in Mumbai",
      sql: "SELECT * FROM shoppers WHERE ltv > 5000 AND city = 'Mumbai';",
      matches: 14,
      channel: "WhatsApp 💬",
      ctr: "48%"
    },
    {
      text: "Customers who haven't made a purchase in 90 days",
      sql: "SELECT * FROM shoppers WHERE last_purchase_days > 90 AND total_orders > 0;",
      matches: 31,
      channel: "SMS / RCS 📱",
      ctr: "32%"
    },
    {
      text: "Loyal VIP buyers aged under 30 with high conversion rates",
      sql: "SELECT * FROM shoppers WHERE ltv >= 10000 AND age < 30 ORDER BY ltv DESC;",
      matches: 8,
      channel: "WhatsApp / Email ✉️",
      ctr: "56%"
    }
  ];

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedPrompt.trim()) return;

    // Generate simulated SQL based on keyword matches
    const text = typedPrompt.toLowerCase();
    let sql = "SELECT * FROM shoppers WHERE ";
    let matches = 12;

    if (text.includes("mumbai") || text.includes("city")) {
      sql += "city = 'Mumbai'";
      matches = 14;
    } else if (text.includes("delhi")) {
      sql += "city = 'Delhi'";
      matches = 10;
    } else if (text.includes("spending") || text.includes("ltv") || text.includes("money")) {
      sql += "ltv > 4000";
      matches = 18;
    } else if (text.includes("inactive") || text.includes("days") || text.includes("last")) {
      sql += "last_purchase_days > 60";
      matches = 25;
    } else {
      sql += "ltv > 1000 AND total_orders >= 1";
      matches = 35;
    }
    sql += " LIMIT 50;";
    
    setCustomSql(sql);
    setSimulatedMatchCount(matches);
  };

  // Copywriter Simulator State
  const [activeObjective, setActiveObjective] = useState<'sale' | 'cart' | 'reward'>('sale');
  const [activeTone, setActiveTone] = useState<'playful' | 'urgent' | 'professional'>('playful');
  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');

  const copyTemplates = {
    sale: {
      playful: {
        whatsapp: "Hey {{name}}! 🌟 Guess what? Our exclusive premium collections just dropped! Grab a flat 20% off today with code XENOPLAY. Let's shop!",
        sms: "Hey {{name}}! 🌟 Exclusive premium collection is live! Get 20% off. Use code XENOPLAY now.",
        email: "Subject: 🌟 Just for you {{name}}: Our new premium collection is finally here!\n\nDear {{name}},\n\nGuess what? The new arrivals just dropped and they have your name written all over them! Enjoy 20% off on your first order with code: XENOPLAY.\n\nHappy Shopping!"
      },
      urgent: {
        whatsapp: "Hurry {{name}}! 🚨 The Collection Launch code XENOURGENT expires in 2 hours. Secure your favorites before stocks vanish!",
        sms: "Hurry {{name}}! 🚨 20% off code XENOURGENT expires in 2 hrs. Grab your styles now!",
        email: "Subject: 🚨 Urgent: {{name}}, 20% Off Collection Launch expires in 2 Hours!\n\nDear {{name}},\n\nThis is your final alert. The premium collection drop is selling out rapidly. Your 20% discount code XENOURGENT expires in exactly 2 hours.\n\nDon't miss out!"
      },
      professional: {
        whatsapp: "Dear {{name}}, we are pleased to announce the launch of our premium D2C collection. Enjoy an exclusive 20% savings with code XENOPRO.",
        sms: "Dear {{name}}, we invite you to view our premium collection. Enjoy 20% off with code XENOPRO.",
        email: "Subject: Announcing the Launch of our Premium Collection - Exclusive 20% Invited Access\n\nDear {{name}},\n\nWe are pleased to introduce our latest premium D2C collection. As a valued customer, please enjoy a 20% savings on your purchase by using the code: XENOPRO.\n\nSincerely,\nXeno Client Services"
      }
    },
    cart: {
      playful: {
        whatsapp: "Oh no! 🛒 Did your cart get lonely, {{name}}? We saved your favorite items. Complete checkout now and get free shipping!",
        sms: "Oh no! 🛒 We saved your cart items, {{name}}. Complete checkout today for free shipping!",
        email: "Subject: 🛒 Did your cart get lonely, {{name}}? We saved your items!\n\nHi {{name}},\n\nWe noticed you left some premium goodies in your cart. We've saved them for you. Check out now to receive complimentary delivery!"
      },
      urgent: {
        whatsapp: "Action Required, {{name}}! ⏰ Items in your cart are selling out fast. Complete checkout within 15 minutes to guarantee reservation.",
        sms: "Cart Alert! ⏰ Items selling out fast. Complete checkout in 15 mins to secure your order.",
        email: "Subject: ⏰ Action Required: Complete checkout in 15 minutes to secure your items\n\nDear {{name}},\n\nDue to exceptionally high demand, items in your shopping cart cannot be reserved indefinitely. Complete your order within 15 minutes to ensure availability."
      },
      professional: {
        whatsapp: "Hello {{name}}, this is a reminder that items remain in your shopping cart. Select the link to securely complete your order.",
        sms: "Reminder: Items remain in your shopping cart. Click here to secure your order.",
        email: "Subject: Shopping Cart Reminder - Complete Your Order\n\nDear {{name}},\n\nThis email is to notify you that items remain in your shopping cart. If you require assistance or wish to finalize your order, please visit our checkout page."
      }
    },
    reward: {
      playful: {
        whatsapp: "Woohoo {{name}}! 🥳 You've unlocked VIP status. Here's a ₹500 loyalty reward voucher for your next order. Enjoy!",
        sms: "Woohoo {{name}}! 🥳 VIP unlocked. Get ₹500 off your next purchase. Code: VIP500",
        email: "Subject: 🥳 Woohoo {{name}}! You've unlocked VIP status + ₹500 Reward!\n\nHi {{name}},\n\nYou're officially a superstar! To celebrate your loyalty, we've loaded a ₹500 voucher onto your profile. Use code VIP500 at checkout."
      },
      urgent: {
        whatsapp: "VIP Alert: {{name}}! 💎 Your ₹500 loyalty statement credit expires tonight. Redeem it now before it goes to waste.",
        sms: "VIP Alert! 💎 Your ₹500 loyalty credit expires tonight. Use code VIP500 now.",
        email: "Subject: 💎 VIP Alert: {{name}}, your ₹500 loyalty voucher expires tonight!\n\nDear {{name}},\n\nThis is a quick reminder that your VIP loyalty reward of ₹500 expires at midnight tonight. Apply code VIP500 at checkout to claim your credit."
      },
      professional: {
        whatsapp: "Dear {{name}}, we appreciate your continued patronage. A VIP loyalty statement credit of ₹500 has been applied to your profile.",
        sms: "Thank you for your support. A ₹500 loyalty credit has been applied to your account.",
        email: "Subject: Statement Notification: VIP Loyalty Credit Applied to Your Profile\n\nDear {{name}},\n\nIn recognition of your support, we have credited a VIP loyalty voucher valued at ₹500 to your profile. You can apply code VIP500 at your next checkout."
      }
    }
  };

  const getSimulatedCopy = () => {
    return copyTemplates[activeObjective][activeTone][activeChannel];
  };

  return (
    <div className="space-y-20 pb-20 select-none">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-dark-800 to-[#1e152f] border border-dark-700/80 p-8 md:p-16 text-center space-y-6 flex flex-col items-center justify-center min-h-[520px]">
        {/* Glowing visual indicators */}
        <div className="absolute top-[-10%] left-[20%] w-[350px] h-[350px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[20%] w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center space-x-2 bg-primary/15 border border-primary/25 text-indigo-400 px-4.5 py-1.5 rounded-full text-xs font-bold font-mono tracking-wide animate-pulse">
          <Sparkles size={12} className="fill-indigo-400/20" />
          <span>AI-Native D2C CRM Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Hyper-Personalize D2C Campaigns at <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Scale</span>
        </h1>

        <p className="text-sm md:text-base text-dark-500 max-w-2xl mx-auto leading-relaxed">
          Xeno consolidates disparate customer records, translates conversational prompts into accurate SQL database segments, generates personalized channel templates, and tracks conversions through an integrated asynchronous simulator loop.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 w-full max-w-md">
          <button
            onClick={onStartApp}
            className="flex-1 py-3 px-6 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-primary/25 glow-indigo"
          >
            <span>Launch Campaign Console</span>
            <ArrowRight size={16} />
          </button>
          
          <button
            onClick={onOpenAuth}
            className="flex-1 py-3 px-6 bg-dark-800 hover:bg-dark-700 text-white font-semibold rounded-xl text-sm border border-dark-700 transition"
          >
            Sign In / Sign Up
          </button>
        </div>
      </section>

      {/* Real-time Sandbox Statistics Counter */}
      <section className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-dark-700/50 text-center space-y-1">
          <span className="text-[10px] text-dark-500 font-mono block uppercase">Total Dispatched</span>
          <span className="text-2xl font-black text-white block">148,930</span>
          <span className="text-[9px] text-emerald-400 font-medium">+12.4% this week</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-dark-700/50 text-center space-y-1">
          <span className="text-[10px] text-dark-500 font-mono block uppercase">Average Open Rate</span>
          <span className="text-2xl font-black text-white block">64.2%</span>
          <span className="text-[9px] text-indigo-400 font-medium">AI Template Boosted</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-dark-700/50 text-center space-y-1">
          <span className="text-[10px] text-dark-500 font-mono block uppercase">Conversion Orders</span>
          <span className="text-2xl font-black text-white block">18,342</span>
          <span className="text-[9px] text-emerald-400 font-medium">12.3% Conversion ROI</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-dark-700/50 text-center space-y-1">
          <span className="text-[10px] text-dark-500 font-mono block uppercase">Simulator Health</span>
          <span className="text-2xl font-black text-emerald-400 block">ACTIVE</span>
          <span className="text-[9px] text-dark-500 font-medium">Webhook Port: 5001</span>
        </div>
      </section>

      {/* Interactive AI Segmenter Simulator Playground */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs text-primary font-bold font-mono">
            <Cpu size={12} />
            <span>PLAYGROUND SIMULATOR</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Natural Language AI SQL Cohort Builder</h2>
          <p className="text-xs text-dark-500 max-w-xl mx-auto">
            Test how our NLP compiler instantly extracts filters and constructs SQL statements. Select a prompt or type your own.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Prompts list (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <span className="text-[10px] text-dark-500 font-bold tracking-wider uppercase">Select Standard Prompt:</span>
              {prompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPromptIdx(idx);
                    setCustomSql(null);
                    setSimulatedMatchCount(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition ${
                    selectedPromptIdx === idx && !customSql
                      ? 'bg-primary/10 border-primary text-white font-semibold'
                      : 'bg-dark-850 hover:bg-dark-800 border-dark-700/80 text-dark-400 hover:text-white'
                  }`}
                >
                  "{p.text}"
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <form onSubmit={handleCustomPromptSubmit} className="space-y-2 mt-4 pt-4 border-t border-dark-800">
              <span className="text-[10px] text-dark-500 font-bold tracking-wider uppercase block">Or Try Your Custom Criteria:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={typedPrompt}
                  onChange={(e) => setTypedPrompt(e.target.value)}
                  placeholder="e.g. Inactive buyers in Delhi..."
                  className="flex-1 px-3 py-2 text-xs bg-dark-800 border border-dark-700 text-white rounded-xl placeholder-dark-500 focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
                >
                  <Sparkles size={12} />
                  <span>Translate</span>
                </button>
              </div>
            </form>
          </div>

          {/* Generated SQL Code viewer (Right 7 Cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl border border-dark-700/70 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-dark-800 pb-2.5">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[9px] text-dark-500 font-mono">SQL-TRANSLATOR.LOG</span>
              </div>

              {/* Code Box */}
              <div className="bg-dark-900 border border-dark-800 p-4 rounded-xl font-mono text-xs text-indigo-400 overflow-x-auto min-h-[80px]">
                {customSql ? customSql : prompts[selectedPromptIdx].sql}
              </div>
            </div>

            {/* Simulated output stats badge */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-[10px] font-semibold bg-dark-850 p-3 rounded-xl border border-dark-750">
              <div>
                <span className="text-dark-500 block uppercase mb-0.5">Matched Shoppers</span>
                <span className="text-sm font-bold text-white">
                  {customSql ? simulatedMatchCount : prompts[selectedPromptIdx].matches}
                </span>
              </div>
              <div>
                <span className="text-dark-500 block uppercase mb-0.5">Optimal Channel</span>
                <span className="text-sm font-bold text-primary">
                  {customSql ? "WhatsApp 💬" : prompts[selectedPromptIdx].channel}
                </span>
              </div>
              <div>
                <span className="text-dark-500 block uppercase mb-0.5">Estimated CTR</span>
                <span className="text-sm font-bold text-emerald-400">
                  {customSql ? "44%" : prompts[selectedPromptIdx].ctr}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copywriter AI Assistant Preview Simulator */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-bold font-mono">
            <MessageSquare size={12} />
            <span>COPYWRITER ENGINE</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Interactive Campaign Template Assistant</h2>
          <p className="text-xs text-dark-500 max-w-xl mx-auto">
            See how the copywriting assistant tailors campaigns by adapting messages based on objective, tone of voice, and dispatch channel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Controls Panel (Left 7 Cols) */}
          <div className="md:col-span-7 glass-panel rounded-2xl border border-dark-700/60 p-6 flex flex-col justify-between space-y-5">
            {/* Objective */}
            <div className="space-y-2">
              <span className="text-[10px] text-dark-500 font-mono uppercase block tracking-wider">1. Select Campaign Objective</span>
              <div className="grid grid-cols-3 gap-2">
                {(['sale', 'cart', 'reward'] as const).map((obj) => (
                  <button
                    key={obj}
                    onClick={() => setActiveObjective(obj)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition ${
                      activeObjective === obj 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                        : 'bg-dark-850 border-dark-700 text-dark-400 hover:text-white'
                    }`}
                  >
                    {obj === 'sale' && 'Sale Launch'}
                    {obj === 'cart' && 'Cart Recovery'}
                    {obj === 'reward' && 'VIP Reward'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <span className="text-[10px] text-dark-500 font-mono uppercase block tracking-wider">2. Tone of Voice</span>
              <div className="grid grid-cols-3 gap-2">
                {(['playful', 'urgent', 'professional'] as const).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setActiveTone(tone)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition ${
                      activeTone === tone 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                        : 'bg-dark-850 border-dark-700 text-dark-400 hover:text-white'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {/* Channel Selection */}
            <div className="space-y-2">
              <span className="text-[10px] text-dark-500 font-mono uppercase block tracking-wider">3. Deliver Channel</span>
              <div className="grid grid-cols-3 gap-2">
                {(['whatsapp', 'sms', 'email'] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setActiveChannel(ch)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition ${
                      activeChannel === ch 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                        : 'bg-dark-850 border-dark-700 text-dark-400 hover:text-white'
                    }`}
                  >
                    {ch === 'whatsapp' && 'WhatsApp'}
                    {ch === 'sms' && 'SMS'}
                    {ch === 'email' && 'Email'}
                  </button>
                ))}
              </div>
            </div>

            {/* Info Message */}
            <div className="text-[10px] text-dark-500 leading-relaxed bg-dark-850 p-3 rounded-lg border border-dark-750 flex items-start space-x-2">
              <Info size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>In the campaign studio, variables like <code>{`{{name}}`}</code>, <code>{`{{city}}`}</code>, and <code>{`{{ltv}}`}</code> are automatically resolved with actual database properties during dispatch.</span>
            </div>
          </div>

          {/* Interactive Mobile Device Simulator (Right 5 Cols) */}
          <div className="md:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-[270px] aspect-[9/18] bg-[#0E1320] border-4 border-dark-700 rounded-[36px] shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
              {/* Speaker / Notch bar */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-dark-700 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-dark-900 mr-2" />
                <div className="w-8 h-1 bg-dark-900 rounded-full" />
              </div>

              {/* Status Header */}
              <div className="flex justify-between items-center text-[8px] text-dark-500 font-semibold px-2 pt-2">
                <span>9:41</span>
                <div className="flex items-center space-x-1">
                  <span>5G</span>
                  <div className="w-3.5 h-1.5 border border-dark-500 rounded-sm" />
                </div>
              </div>

              {/* Chat Window Frame */}
              <div className="flex-1 mt-4 overflow-y-auto px-1 space-y-3">
                {/* Brand Contact Header */}
                <div className="flex items-center space-x-2 bg-dark-850 p-2 rounded-xl border border-dark-750">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white">X</div>
                  <div>
                    <span className="text-[9px] font-extrabold text-white block">Xeno Brand Center</span>
                    <span className="text-[7px] text-emerald-400 block flex items-center gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                      Online
                    </span>
                  </div>
                </div>

                {/* Message Balloon */}
                <div className="bg-[#1C243B] border border-dark-700 p-2.5 rounded-2xl rounded-tl-sm text-[9px] text-dark-300 leading-normal max-w-[90%] shadow-md">
                  <p className="whitespace-pre-line">{getSimulatedCopy().replace("{{name}}", "Aditya")}</p>
                  <span className="text-[6px] text-dark-500 block text-right mt-1.5 font-mono">9:41 AM ✓✓</span>
                </div>
              </div>

              {/* Chat Input Indicator */}
              <div className="border-t border-dark-850 pt-2 pb-1.5 flex items-center gap-1.5">
                <div className="flex-1 bg-dark-800 border border-dark-700 rounded-full py-1.5 px-3 text-[8px] text-dark-500">
                  Type a reply...
                </div>
                <div className="p-1.5 bg-primary text-white rounded-full">
                  <Send size={10} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section: What is Xeno? */}
      <section className="max-w-4xl mx-auto space-y-8 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">Core Marketing Mission</h2>
        
        <p className="text-sm text-dark-500 leading-relaxed max-w-2xl mx-auto">
          Xeno empowers retail brands to replace broad, costly, and ineffective spam campaigns with highly targeted communication. By mapping user behavior directly to automated message triggers, Xeno saves acquisition costs and drives repeat conversions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="glass-panel p-6 rounded-2xl border border-dark-700/50 space-y-3 text-left">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit">
              <Database size={20} />
            </div>
            <h4 className="font-bold text-white text-sm">Unified Shopper CDP</h4>
            <p className="text-xs text-dark-500 leading-relaxed">
              Consolidate online, store, and loyalty purchase events. Maintain complete shopper metadata profiles containing lifetime value (LTV), city tags, and age brackets.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-dark-700/50 space-y-3 text-left">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit">
              <Target size={20} />
            </div>
            <h4 className="font-bold text-white text-sm">Smart AI Translation</h4>
            <p className="text-xs text-dark-500 leading-relaxed">
              Describe segments in conversational English. Xeno automatically builds the SQL filters, estimates audience size, and validates templates against delivery channels.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-dark-700/50 space-y-3 text-left">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit">
              <Zap size={20} />
            </div>
            <h4 className="font-bold text-white text-sm">Asynchronous Dispatch Loop</h4>
            <p className="text-xs text-dark-500 leading-relaxed">
              Execute blasts through our built-in simulator. Live webhooks feedback actual state updates (delivered, read, checkout) for instant conversion reporting.
            </p>
          </div>
        </div>
      </section>

      {/* Architectural Flowchart / Component Visual */}
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] text-dark-500 font-mono block uppercase">How It Connects</span>
          <h2 className="text-2xl font-bold text-white">System Architecture Overview</h2>
          <p className="text-xs text-dark-500">How data moves through the Xeno campaign engine from ingestion to conversion.</p>
        </div>

        {/* CSS Flowchart Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Step 1 */}
          <div className="glass-panel p-4 rounded-xl border border-dark-700/50 text-center space-y-2">
            <div className="mx-auto w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Database size={16} />
            </div>
            <span className="text-[10px] font-bold text-white block">1. CRM DB</span>
            <p className="text-[9px] text-dark-500">Shopper profiles & transaction ingestion</p>
          </div>
          
          <div className="hidden md:flex justify-center text-dark-600">
            <ArrowRight size={16} />
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-4 rounded-xl border border-dark-700/50 text-center space-y-2">
            <div className="mx-auto w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Code size={16} />
            </div>
            <span className="text-[10px] font-bold text-white block">2. Segment SQL</span>
            <p className="text-[9px] text-dark-500">Translate NLP prompt to DB queries</p>
          </div>

          <div className="hidden md:flex justify-center text-dark-600">
            <ArrowRight size={16} />
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-4 rounded-xl border border-dark-700/50 text-center space-y-2">
            <div className="mx-auto w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Terminal size={16} />
            </div>
            <span className="text-[10px] font-bold text-white block">3. Simulator</span>
            <p className="text-[9px] text-dark-500">Asynchronous delivery loop</p>
          </div>
        </div>
      </section>

      {/* Xeno vs Legacy CRMs Comparison Table */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Why Select Xeno AI?</h2>
          <p className="text-xs text-dark-500">A look at how Xeno stacks up against legacy database and campaign builders.</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-dark-700/50 bg-[var(--bg-color)]">
          <table className="w-full text-xs text-left text-dark-500">
            <thead className="text-[10px] text-dark-400 uppercase tracking-wider bg-dark-850/50 border-b border-dark-700/50">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold text-white">Capabilities</th>
                <th scope="col" className="px-6 py-4 text-center font-bold text-indigo-400">Xeno AI Native</th>
                <th scope="col" className="px-6 py-4 text-center">Legacy SaaS CRM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700/50">
              <tr>
                <td className="px-6 py-4 font-semibold text-white">AI Cohort Builder</td>
                <td className="px-6 py-4 text-center text-emerald-400 font-bold">Natural Language (NLP)</td>
                <td className="px-6 py-4 text-center">Manual Rule Builders / SQL only</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-white">Delivery Simulator</td>
                <td className="px-6 py-4 text-center text-emerald-400 font-semibold">Yes, Port 5001 Callback stub</td>
                <td className="px-6 py-4 text-center">None / Live tokens required</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-white">Visual Webhook Logging</td>
                <td className="px-6 py-4 text-center text-emerald-400 font-semibold">Live Console Feed</td>
                <td className="px-6 py-4 text-center">Complex background audit files</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-white">Unified Campaigns</td>
                <td className="px-6 py-4 text-center text-emerald-400 font-semibold">WhatsApp + RCS + SMS + Email</td>
                <td className="px-6 py-4 text-center">Fragmented plugin modules</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-white">Visual Skin Customization</td>
                <td className="px-6 py-4 text-center text-emerald-400 font-semibold">Midnight, Emerald, Crimson, Light</td>
                <td className="px-6 py-4 text-center">Fixed theme</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Capability Feature Grid Showcase */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Platform Sandbox Integrations</h2>
          <p className="text-xs text-dark-500">Every sandbox component is fully operational and clickable.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="glass-panel p-8 rounded-3xl border border-dark-700/50 flex space-x-5 items-start">
            <div className="p-3 bg-indigo-500/15 text-indigo-400 rounded-2xl flex-shrink-0">
              <Sparkles size={24} className="fill-indigo-400/20" />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-white text-base">Generative Prompt-to-Query Segmenter</h4>
              <p className="text-xs text-dark-500 leading-relaxed">
                marketers can build shopper cohorts using conversational criteria. Our translation engine analyzes the request and produces query filters matching target LTV and inactivity days.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-8 rounded-3xl border border-dark-700/50 flex space-x-5 items-start">
            <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-2xl flex-shrink-0">
              <Terminal size={24} />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-white text-base">Asynchronous Callback Console</h4>
              <p className="text-xs text-dark-500 leading-relaxed">
                Observe the delivery funnel as it operates asynchronously. The webhook console logs receipt transactions (Delivered, Read, Clicked, Checked Out) from our Port 5001 channel simulator.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-8 rounded-3xl border border-dark-700/50 flex space-x-5 items-start">
            <div className="p-3 bg-purple-500/15 text-purple-400 rounded-2xl flex-shrink-0">
              <BarChart3 size={24} />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-white text-base">Conversion Funnel & Attribution Charts</h4>
              <p className="text-xs text-dark-500 leading-relaxed">
                Review live campaign statistics. Our Recharts conversion charts show customer click progression and sales conversions. You can also trigger AI Growth analysis on finalized dispatches.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-panel p-8 rounded-3xl border border-dark-700/50 flex space-x-5 items-start">
            <div className="p-3 bg-amber-500/15 text-amber-400 rounded-2xl flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-white text-base">Customer Profiling & Theme Customization</h4>
              <p className="text-xs text-dark-500 leading-relaxed">
                Add shopper records manually or import bulk data profiles with computed spending value tier tags. Instantly swap visual skins: Midnight Neon, Emerald Mint, Cyber Rose, or Clean Light.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="text-center bg-gradient-to-tr from-dark-800 to-dark-750 border border-dark-700/50 rounded-3xl p-8 md:p-12 space-y-4">
        <h3 className="text-xl md:text-2xl font-bold text-white">Ready to explore shopper campaigns?</h3>
        <p className="text-xs text-dark-500 max-w-lg mx-auto">
          Access the full system, seed standard profiles, launch campaigns, and monitor log callbacks.
        </p>
        <div className="pt-2">
          <button
            onClick={onStartApp}
            className="py-2.5 px-8 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-xs transition inline-flex items-center space-x-1.5 shadow-lg shadow-primary/20 glow-indigo animate-pulse"
          >
            <span>Launch Campaign Console</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
