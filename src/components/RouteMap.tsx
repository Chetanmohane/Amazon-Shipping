import React from 'react';
import { MapPin, Navigation, Truck, Building, Home, CheckCircle2 } from 'lucide-react';
import { Shipment, StatusType } from '../types/shipping';

interface RouteMapProps {
  shipment: Shipment;
}

export const RouteMap: React.FC<RouteMapProps> = ({ shipment }) => {
  const getStepProgress = (status: StatusType) => {
    switch (status) {
      case 'ORDER_PLACED': return 15;
      case 'DISPATCHED': return 35;
      case 'IN_TRANSIT': return 65;
      case 'OUT_FOR_DELIVERY': return 88;
      case 'DELIVERED': return 100;
      default: return 10;
    }
  };

  const progressPct = getStepProgress(shipment.status);
  const originCity = shipment.shipper?.city || 'Warehouse FC';
  const destCity = shipment.customer?.city || 'Destination';
  const checkpoints = shipment.checkpoints || [];
  const lastCheckpoint = checkpoints[checkpoints.length - 1];
  const currentLocationName = lastCheckpoint?.location || shipment.customer?.city || 'Hub Station';

  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#1a2332] to-slate-950 text-white rounded-xl p-5 sm:p-6 shadow-xl border border-slate-800 relative overflow-hidden">
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Map Header */}
      <div className="relative z-10 flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <Navigation className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Live Order Transit Map
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Origin: <strong className="text-slate-200">{originCity}</strong> → Destination: <strong className="text-slate-200">{destCity}</strong>
          </p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300">Live Hub:</span>
          <span className="font-bold text-amber-400 font-mono">{currentLocationName}</span>
        </div>
      </div>

      {/* Visual Map Canvas Container */}
      <div className="relative z-10 my-8 py-4 px-2">
        
        {/* Connection Line */}
        <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Moving Truck Icon */}
        <div
          className="absolute -top-3 -translate-x-1/2 transition-all duration-700 z-20"
          style={{ left: `${Math.max(8, Math.min(92, progressPct))}%` }}
        >
          <div className="relative group">
            <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center shadow-lg ring-4 ring-amber-500/30 transform group-hover:scale-110 transition">
              <Truck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 border border-slate-700 text-[10px] text-amber-300 px-2 py-0.5 rounded shadow font-mono">
              {(shipment?.status || 'ORDER_PLACED').toString().replace(/_/g, ' ')}
            </div>
          </div>
        </div>

        {/* Major Node Markers */}
        <div className="flex justify-between items-center mt-6 text-xs">
          {/* Origin Hub */}
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-amber-500 text-amber-400 flex items-center justify-center shadow">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-200">{originCity}</p>
              <p className="text-[10px] text-slate-400">Fulfilment FC</p>
            </div>
          </div>

          {/* Transit Hub */}
          <div className="flex items-center gap-2 text-center hidden sm:flex">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow ${
              progressPct >= 65 ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}>
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-200">Express Air Hub</p>
              <p className="text-[10px] text-slate-400">Regional Gateway</p>
            </div>
          </div>

          {/* Customer Destination */}
          <div className="flex items-center gap-2 text-right">
            <div>
              <p className="font-bold text-slate-200">{destCity}</p>
              <p className="text-[10px] text-slate-400">{shipment.status === 'DELIVERED' ? 'Delivered' : 'Delivery Address'}</p>
            </div>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow ${
              shipment.status === 'DELIVERED'
                ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              {shipment.status === 'DELIVERED' ? <CheckCircle2 className="w-5 h-5" /> : <Home className="w-4 h-4" />}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Summary Bar */}
      <div className="relative z-10 border-t border-slate-800/80 pt-3 flex flex-wrap justify-between items-center text-xs text-slate-400 gap-2">
        <span>Carrier: <strong className="text-slate-200">{shipment.carrierName}</strong></span>
        <span>Routing: <strong className="font-mono text-amber-400">{shipment.routingCode}</strong></span>
        <span>Estimated Delivery: <strong className="text-slate-200">{shipment.estimatedDelivery}</strong></span>
      </div>

    </div>
  );
};
