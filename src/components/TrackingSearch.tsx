import React from 'react';
import { Search, Package, Sparkles, AlertTriangle } from 'lucide-react';
import { Shipment } from '../types/shipping';

interface TrackingSearchProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  shipments: Shipment[];
  notFound: boolean;
  searchedAwb?: string;
}

export const TrackingSearch: React.FC<TrackingSearchProps> = ({
  onSearch,
  searchQuery,
  setSearchQuery,
  notFound,
  searchedAwb
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      onSearch(''); // Reset details when input field is cleared
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white py-16 px-4 shadow-2xl">
      {/* Background Image with Dark Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition transform duration-1000"
        style={{ backgroundImage: `url('/hero_shipping_bg.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#131921] via-slate-950/80 to-slate-950/95" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-400/40 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5 shadow-lg backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Official Amazon Logistics Express Tracking</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white drop-shadow-md">
          Track Your <span className="bg-gradient-to-r from-amber-400 via-[#FF9900] to-yellow-200 bg-clip-text text-transparent">Amazon Shipment</span>
        </h1>
        <p className="text-gray-200 text-sm sm:text-lg max-w-2xl mx-auto mb-6 leading-relaxed font-medium">
          Enter your <span className="text-amber-400 font-bold underline decoration-amber-400/50 underline-offset-4">AWB Tracking Number</span> or Order ID to inspect live hub updates & delivery status.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-xs font-bold text-gray-300">
          <span className="bg-slate-900/80 border border-slate-700/80 px-3 py-1 rounded-lg backdrop-blur shadow-sm">⚡ 24/7 Real-Time Scanning</span>
          <span className="bg-slate-900/80 border border-slate-700/80 px-3 py-1 rounded-lg backdrop-blur shadow-sm">✈️ Express Air & Surface Transit</span>
          <span className="bg-slate-900/80 border border-slate-700/80 px-3 py-1 rounded-lg backdrop-blur shadow-sm">🔒 Handshake OTP Delivery</span>
        </div>

        {/* Search Bar Container Card */}
        <div className="max-w-2xl mx-auto bg-slate-900/95 border border-amber-500/40 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-md text-left">
          
          {/* Card Label */}
          <label 
            htmlFor="tracking-search-input" 
            className="block text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-2.5 flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-amber-400" />
              <span>Enter AWB Tracking ID / Order Number</span>
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">LIVE TRACK</span>
          </label>

          <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col sm:flex-row items-stretch bg-white rounded-xl p-2 shadow-2xl border-2 border-amber-400 ring-4 ring-amber-400/20 transition">
              
              <div className="flex items-center px-3 flex-1 text-slate-900 gap-2 min-h-[52px]">
                <Search className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <input
                  id="tracking-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="Enter AWB or Order ID"
                  className="w-full text-base sm:text-lg text-slate-950 font-mono font-extrabold focus:outline-none placeholder:text-slate-400 placeholder:font-sans bg-transparent"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); onSearch(''); }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition"
                    title="Clear tracking ID"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="mt-2 sm:mt-0 w-full sm:w-auto bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 font-black px-8 py-3.5 sm:py-3 rounded-lg text-base flex items-center justify-center gap-2 shadow-md transition transform active:scale-95 cursor-pointer flex-shrink-0"
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
                <span>Track Order</span>
              </button>

            </div>
          </form>

          {/* Quick Helper Guidance */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-300 px-1 font-medium">
            <span>💡 Enter AWB Number or Order ID generated by Admin/Seller</span>
            <span className="text-amber-400 font-mono font-semibold">24x7 Live Hub Sync</span>
          </div>

        </div>

        {/* Error message when AWB is invalid / not found */}
        {notFound && (
          <div className="mt-8 bg-red-950/95 border-2 border-red-500 text-red-100 p-5 rounded-2xl max-w-xl mx-auto text-xs text-left shadow-2xl space-y-2 animate-shake backdrop-blur-md">
            <div className="flex items-center gap-2 text-red-400 font-extrabold text-base border-b border-red-800/80 pb-2">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <span>Invalid Tracking ID!</span>
            </div>
            <p className="leading-relaxed text-sm">
              The tracking ID <strong className="font-mono text-amber-300 underline font-bold">{searchedAwb}</strong> is invalid or order not found.
            </p>
            <p className="text-xs text-gray-300 pt-1">
              ⚠️ Please check the tracking number for any typos or contact your seller for the official AWB tracking number.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
