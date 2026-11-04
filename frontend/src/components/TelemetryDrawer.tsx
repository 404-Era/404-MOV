import React, { useState, useEffect } from 'react';
import { Terminal, X, Copy, Check } from 'lucide-react';
import { subscribeTelemetry } from '../services/telemetry';
import type { TelemetryLogEntry } from '../services/telemetry';

export const TelemetryDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<TelemetryLogEntry[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeTelemetry((updated) => {
      setLogs(updated);
    });
    return unsubscribe;
  }, []);

  const handleCopyLogs = () => {
    const fullText = logs.map(l => l.rawLine).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Toggle Button (Bottom-Right) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 px-3 py-1.5 rounded-lg bg-[#0E1217]/90 border border-white/10 hover:border-[#00FFA3] text-[#8F9CA8] hover:text-[#00FFA3] font-mono text-[11px] flex items-center space-x-1.5 backdrop-blur-md transition-all shadow-lg cursor-pointer"
        title="Open Live Telemetry Console"
      >
        <Terminal className="w-3.5 h-3.5" />
        <span>TELEMETRY ({logs.length})</span>
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed bottom-14 right-4 z-50 w-full max-w-xl bg-[#090C10] border border-white/16 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs flex flex-col max-h-[460px] animate-fadeIn">
          {/* Header */}
          <div className="px-4 py-2.5 bg-[#12161E] border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse" />
              <span className="text-[#EDEDED] font-bold text-[11px]">
                404MOV Telemetry Feed Standard
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleCopyLogs}
                className="px-2 py-0.5 rounded bg-white/6 hover:bg-white/12 text-[#8F9CA8] hover:text-white text-[10px] flex items-center space-x-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-[#00FFA3]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy All'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#8F9CA8] hover:text-white p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Log Lines Container */}
          <div className="p-3 overflow-y-auto space-y-1.5 flex-1 bg-[#06080B] text-[10.5px] leading-tight">
            {logs.length === 0 ? (
              <div className="text-gray-500 py-6 text-center">No telemetry events logged yet.</div>
            ) : (
              logs.map((log) => {
                let badgeColor = 'text-[#00FFA3]';
                if (log.eventType === 'SEARCH_QUERY') badgeColor = 'text-cyan-400';
                if (log.eventType === 'FILTER_SELECT') badgeColor = 'text-yellow-400';
                if (log.eventType === 'DOWNLOAD_SOURCE_CLICK') badgeColor = 'text-emerald-400';
                if (log.eventType === 'OPEN_MOVIE_TAB') badgeColor = 'text-purple-400';

                return (
                  <div key={log.id} className="hover:bg-white/4 p-1 rounded font-mono break-all">
                    <span className="text-gray-500">[{log.timestamp}] </span>
                    <span className={`font-bold ${badgeColor}`}>[{log.eventType}] </span>
                    <span className="text-[#8F9CA8]">| {log.component} -&gt; </span>
                    <span className="text-gray-300">
                      {Object.entries(log.details)
                        .map(([k, v]) => `${k}=${v}`)
                        .join(', ')}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Format Spec Standard Footer */}
          <div className="px-3 py-1.5 bg-[#0D1016] border-t border-white/6 text-[9.5px] text-gray-500 flex justify-between">
            <span>Standard: [TIMESTAMP] [EVENT_TYPE] | Component -&gt; Details</span>
            <span>Mirroring to Browser Console</span>
          </div>
        </div>
      )}
    </>
  );
};
