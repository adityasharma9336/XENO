import React, { useEffect, useState } from 'react';
import { Terminal, RefreshCw } from 'lucide-react';
import { api } from '../utils/api';
import type { ActivityLog } from '../types';

export const LiveConsole: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLogs = async () => {
    try {
      const data = await api.getActivityLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    let interval: any;
    if (autoRefresh) {
      interval = setInterval(fetchLogs, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return 'text-red-400 font-bold';
      case 'WARN':
        return 'text-amber-400';
      case 'INFO':
      default:
        return 'text-emerald-400';
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 glow-indigo overflow-hidden">
      <div className="flex items-center justify-between border-b border-dark-700 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/20 text-primary rounded-lg">
            <Terminal size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">Live Execution Console</h3>
            <p className="text-xs text-dark-500">Real-time CRM & Channel callback feed</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-xs text-dark-500 cursor-pointer">
            <input 
              type="checkbox" 
              checked={autoRefresh} 
              onChange={() => setAutoRefresh(!autoRefresh)}
              className="accent-primary rounded bg-dark-800 border-dark-700" 
            />
            <span>Auto-refresh (2s)</span>
          </label>
          <button 
            onClick={fetchLogs}
            disabled={loading}
            className="p-1.5 hover:bg-dark-700 rounded text-dark-500 hover:text-white transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="bg-black/40 rounded-xl p-4 font-mono text-xs overflow-y-auto h-64 border border-dark-700/50 flex flex-col-reverse">
        <div className="space-y-2.5">
          {logs.length === 0 ? (
            <div className="text-dark-500 italic text-center py-10">
              No recent network activity. Start a campaign to trace events.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start space-x-2 leading-relaxed border-b border-dark-700/20 pb-1.5 last:border-0">
                <span className="text-dark-500 select-none">[{formatTime(log.timestamp)}]</span>
                <span className={getLevelColor(log.level)}>[{log.level}]</span>
                <span className="text-gray-300">{log.message}</span>
                {log.details && (
                  <span className="text-dark-500 block pl-4 text-[10px]">({log.details})</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default LiveConsole;
