import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  Package, 
  User, 
  Phone, 
  FileText, 
  Copy, 
  Share2, 
  Play,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  AlertTriangle,
  Printer
} from 'lucide-react';
import { Shipment, StatusType } from '../types/shipping';
import { RouteMap } from './RouteMap';

interface TrackingDetailsProps {
  shipment: Shipment;
  onOpenLabel: (shipment: Shipment) => void;
  onSimulateNextStep?: (awb: string) => void;
}

const statusSteps: { key: StatusType; label: string; description: string }[] = [
  { key: 'ORDER_PLACED', label: 'Order Placed', description: 'Seller packaged item' },
  { key: 'DISPATCHED', label: 'Dispatched', description: 'Picked up by ATS' },
  { key: 'IN_TRANSIT', label: 'In Transit', description: 'On the way to hub' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', description: 'With delivery agent' },
  { key: 'DELIVERED', label: 'Delivered', description: 'Handed to customer' }
];

export const TrackingDetails: React.FC<TrackingDetailsProps> = ({ 
  shipment, 
  onOpenLabel,
  onSimulateNextStep
}) => {
  const [copied, setCopied] = React.useState(false);
  const [linkCopied, setLinkCopied] = React.useState(false);

  const handleCopyAWB = () => {
    navigator.clipboard.writeText(shipment.awbNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = () => {
    const directUrl = `${window.location.origin}/?awb=${encodeURIComponent(shipment.awbNumber)}`;
    navigator.clipboard.writeText(directUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const getStepIndex = (status: StatusType) => {
    switch (status) {
      case 'ORDER_PLACED': return 0;
      case 'DISPATCHED': return 1;
      case 'IN_TRANSIT': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  const getEffectiveStage = (s: Shipment): StatusType => {
    if (s.status !== 'ON_HOLD') return s.status;
    const cpList = s.checkpoints || [];
    for (let i = cpList.length - 1; i >= 0; i--) {
      if (cpList[i].status && cpList[i].status !== 'ON_HOLD') {
        return cpList[i].status;
      }
    }
    return 'ORDER_PLACED';
  };

  const effectiveStage = getEffectiveStage(shipment);
  const currentStepIdx = getStepIndex(effectiveStage);
  const isHeld = shipment.status === 'ON_HOLD';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* On Hold Alert Banner for Customer */}
      {isHeld && (
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-2 border-amber-500 rounded-2xl p-5 shadow-2xl text-amber-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-shake">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center font-black flex-shrink-0 mt-0.5 shadow-md">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-300">
                Your Order is on Hold ({statusSteps[currentStepIdx]?.label || 'Order Placed'} Stage)!
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-amber-100 mt-1 leading-relaxed">
                This shipment has been placed on hold at the <strong>{statusSteps[currentStepIdx]?.label}</strong> stage. Please contact your seller or customer support for assistance.
              </p>
            </div>
          </div>
          
          <div className="bg-amber-500/20 border border-amber-400/50 px-4 py-2 rounded-xl text-xs font-mono font-black text-amber-300 flex-shrink-0">
            HELD AT: {statusSteps[currentStepIdx]?.label?.toUpperCase()} ⚠️
          </div>
        </div>
      )}

      {/* Top Banner & Quick Actions */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded border flex items-center gap-1.5 shadow-sm ${
                isHeld
                  ? 'bg-amber-100 text-amber-950 border-amber-400'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isHeld ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-ping'}`} />
                {isHeld ? `On Hold (${statusSteps[currentStepIdx]?.label})` : 'Live Working Tracking ID'}
              </span>
              <h2 className="text-lg sm:text-xl font-mono font-bold text-gray-900 flex items-center gap-2">
                {shipment.awbNumber}
                <button
                  onClick={handleCopyAWB}
                  className="text-gray-400 hover:text-amber-600 transition"
                  title="Copy AWB Number"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {copied && <span className="text-xs text-emerald-600 font-sans font-bold">Copied!</span>}
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <span>Order ID: <strong className="text-gray-800 font-mono">{shipment.orderId}</strong></span>
              <span>•</span>
              <span>Placed: {shipment.orderDate}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">

            {/* Share Direct Tracking Link */}
            <button
              onClick={handleShareLink}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{linkCopied ? 'Link Copied!' : 'Copy Direct Link'}</span>
            </button>

            {/* Print Shipping Label Button */}
            <button
              onClick={() => onOpenLabel(shipment)}
              className="bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 text-xs font-black px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition transform active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Print Shipping Label</span>
            </button>
          </div>
        </div>

        {/* Current Status Highlight Box */}
        <div className={`mt-5 p-4 sm:p-5 rounded-xl text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg ${
          isHeld
            ? 'bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border border-amber-500/50'
            : 'bg-gradient-to-r from-slate-900 to-[#232F3E]'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full animate-pulse ${
                shipment.status === 'DELIVERED' ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
                Current Package Status
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-1">
              {isHeld && `Your Order is on Hold at ${statusSteps[currentStepIdx]?.label} Stage - Please Contact Seller`}
              {!isHeld && shipment.status === 'OUT_FOR_DELIVERY' && 'Out for Delivery Today'}
              {!isHeld && shipment.status === 'DELIVERED' && 'Delivered'}
              {!isHeld && shipment.status === 'IN_TRANSIT' && 'In Transit to Destination Hub'}
              {!isHeld && shipment.status === 'DISPATCHED' && 'Dispatched from Fulfillment Center'}
              {!isHeld && shipment.status === 'ORDER_PLACED' && 'Package Prepared & Label Generated'}
            </h3>
            <p className="text-xs text-gray-300 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Estimated Delivery: <strong>{shipment.estimatedDelivery}</strong></span>
            </p>
          </div>

          {/* Payment Badge */}
          <div className="bg-white/10 backdrop-blur border border-white/20 px-4 py-2 rounded-lg text-right">
            <p className="text-[11px] text-gray-300 uppercase tracking-wider font-semibold">Payment Status</p>
            <p className="text-sm font-bold text-amber-300 font-mono">
              {shipment.paymentType === 'COD' ? `COD (Collect ₹${shipment.totalAmount})` : 'Prepaid Online'}
            </p>
          </div>
        </div>

        {/* Step-by-Step Progress Timeline Bar */}
        <div className="mt-8 px-2">
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0 hidden sm:block" />
            <div
              className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 z-0 transition-all duration-500 hidden sm:block ${isHeld ? 'bg-amber-500' : 'bg-amber-500'}`}
              style={{ width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%` }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
              {statusSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                const isHoldStep = isHeld && isCurrent;

                return (
                  <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition border-2 ${
                        isHoldStep
                          ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-md ring-4 ring-amber-400/50 animate-pulse'
                          : isPassed
                          ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-md'
                          : 'bg-white border-gray-300 text-gray-400'
                      } ${isCurrent && !isHoldStep ? 'ring-4 ring-amber-400/30 scale-110' : ''}`}
                    >
                      {isHoldStep ? <AlertTriangle className="w-5 h-5 text-slate-950" /> : isPassed ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : idx + 1}
                    </div>

                    <div>
                      <p className={`text-xs font-bold ${isHoldStep ? 'text-amber-700 font-extrabold flex items-center justify-start sm:justify-center gap-1' : isPassed ? 'text-gray-900' : 'text-gray-400'}`}>
                        <span>{step.label}</span>
                        {isHoldStep && <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-black uppercase">HOLD ⚠️</span>}
                      </p>
                      <p className="text-[11px] text-gray-500 hidden sm:block">
                        {isHoldStep ? 'Package stopped on hold at this step' : step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Visual Route Map */}
      <RouteMap shipment={shipment} />

      {/* Delivery Agent Banner (Only if Out For Delivery) */}
      {shipment.status === 'OUT_FOR_DELIVERY' && shipment.deliveryAgent && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 font-bold text-lg shadow">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-500 text-black font-extrabold px-2 py-0.5 rounded">
                  Delivery Associate
                </span>
                <span className="text-xs text-gray-600 font-mono">Vehicle: {shipment.deliveryAgent.vehicleNo}</span>
              </div>
              <h4 className="text-base font-bold text-gray-900 mt-0.5">
                {shipment.deliveryAgent.name}
              </h4>
              <p className="text-xs text-gray-600">Your Amazon agent is nearby with your package.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href={`tel:${shipment.deliveryAgent.phone}`}
              className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow transition"
            >
              <Phone className="w-4 h-4" />
              <span>Call Agent ({shipment.deliveryAgent.phone})</span>
            </a>
          </div>
        </div>
      )}

      {/* Grid: Left column (Tracking Logs) | Right column (Package & Address details) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Cols: Tracking Checkpoint History */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-5 sm:p-6">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Clock className="w-5 h-5 text-amber-500" />
            <span>Tracking History & Hub Checkpoints</span>
          </h3>

          <div className="mt-6 space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gray-200">
            {shipment.checkpoints.map((cp, idx) => (
              <div key={cp.id} className="relative flex items-start gap-4 pl-8 group">
                
                <div className={`absolute left-0 top-0.5 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs transition ${
                  cp.isCompleted 
                    ? 'bg-amber-500 border-amber-600 text-slate-950 font-bold shadow' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {cp.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                <div className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-gray-200/80 flex-1 transition">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      {cp.location}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {cp.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 mt-1.5 leading-relaxed">
                    {cp.description}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Address & Item Details */}
        <div className="space-y-6">

          {/* Delivery Address Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Delivery Address</span>
            </h4>
            <div className="mt-3 text-xs text-gray-700 leading-relaxed">
              <p className="font-bold text-sm text-gray-900">{shipment.customer.name}</p>
              <p>{shipment.customer.addressLine1}</p>
              {shipment.customer.addressLine2 && <p>{shipment.customer.addressLine2}</p>}
              <p>{shipment.customer.city}, {shipment.customer.state} - <strong>{shipment.customer.pincode}</strong></p>
              {shipment.customer.landmark && (
                <p className="text-gray-500 mt-1">Landmark: {shipment.customer.landmark}</p>
              )}
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center gap-1.5 text-gray-600 font-mono">
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>{shipment.customer.phone}</span>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <Package className="w-4 h-4 text-amber-500" />
              <span>Item in Package ({shipment.items.length})</span>
            </h4>

            <div className="mt-3 space-y-3">
              {shipment.items.map(item => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-gray-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 leading-snug">
                      {item.name}
                    </p>
                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-200/60 text-xs">
                      <span className="text-[11px] text-gray-600">
                        Qty: <strong>{item.quantity}</strong> • SKU: <span className="font-mono text-gray-800">{item.sku}</span>
                      </span>
                      <span className="font-extrabold text-amber-700">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carrier Info */}
            <div className="mt-4 pt-3 border-t border-gray-100 bg-slate-50 p-3 rounded-lg text-xs space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>Carrier:</span>
                <strong className="text-gray-900">{shipment.carrierName}</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Routing Code:</span>
                <strong className="font-mono text-gray-900">{shipment.routingCode}</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Weight:</span>
                <strong className="text-gray-900">{shipment.weightKg} kg</strong>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
