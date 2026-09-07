import React from 'react';
import { X, Printer, Download, CheckCircle, Truck, Package, QrCode } from 'lucide-react';
import { Shipment } from '../types/shipping';

interface ShippingLabelModalProps {
  shipment: Shipment | null;
  onClose: () => void;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({ shipment, onClose }) => {
  if (!shipment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-200 my-8">
        
        {/* Modal Header */}
        <div className="bg-[#131921] text-white px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold">Amazon Shipping Label Generator</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-[#FF9900] hover:bg-[#e68a00] text-black font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 shadow transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Shipping Label</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body / Label Viewer Container */}
        <div className="p-6 bg-gray-100 flex justify-center">
          
          {/* Authentic Printable Label (Targeted by CSS @media print) */}
          <div
            id="printable-label"
            className="w-full max-w-[460px] bg-white border-4 border-black p-5 text-black font-sans leading-tight shadow-2xl select-none"
          >
            {/* Top Row: Amazon Shipping Official Header */}
            <div className="flex justify-between items-center border-b-4 border-black pb-3">
              <div className="flex items-center gap-2">
                {/* Official Amazon Logo with Signature Smile */}
                <div className="relative">
                  <svg viewBox="0 0 110 32" className="h-8 w-auto" xmlns="http://www.w3.org/2000/svg">
                    <text x="2" y="20" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif" fill="#000000" letterSpacing="-0.5">
                      amazon
                    </text>
                    <path d="M 6,25 Q 35,35 60,25" fill="none" stroke="#FF9900" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M 57,20 L 65,24 L 59,30 Z" fill="#FF9900" />
                  </svg>
                </div>
                <div className="bg-black text-white px-2.5 py-0.5 font-black text-xs uppercase tracking-widest rounded-sm">
                  SHIPPING
                </div>
              </div>

              <div className="text-right leading-tight">
                <span className="bg-black text-white font-black text-[10px] uppercase px-2 py-0.5 inline-block tracking-wider">
                  ATS EXPRESS
                </span>
                <p className="text-[11px] font-black font-mono mt-1 text-black uppercase tracking-wider">
                  {shipment.carrierName || 'AMAZON ATS INDIA'}
                </p>
              </div>
            </div>

            {/* Sort Code & Hub Station Box */}
            <div className="grid grid-cols-4 border-b-4 border-black text-center divide-x-4 divide-black bg-slate-100">
              <div className="p-2.5 col-span-3 text-left">
                <p className="text-[8px] uppercase font-black text-slate-700 tracking-widest">SORT / HUB ROUTING CODE</p>
                <p className="text-3xl font-black font-mono tracking-widest text-black uppercase mt-0.5">
                  {shipment.routingCode || 'DEL4 / MAA1'}
                </p>
              </div>
              <div className="p-2 flex flex-col justify-center items-center bg-black text-white">
                <p className="text-[8px] uppercase font-black tracking-widest text-amber-400">ZONE</p>
                <p className="text-lg font-black font-mono text-amber-300">{shipment.zone || 'Z-IND'}</p>
              </div>
            </div>

            {/* Payment & COD Collecting Box */}
            <div className={`border-b-4 border-black p-3 flex justify-between items-center ${
              shipment.paymentType === 'COD' ? 'bg-amber-300 border-amber-500' : 'bg-white'
            }`}>
              <div>
                <p className="text-[8px] uppercase font-black text-slate-900 tracking-widest">PAYMENT TYPE</p>
                <p className="text-sm font-black font-mono uppercase text-black">
                  {shipment.paymentType === 'COD' ? 'CASH ON DELIVERY (COD)' : 'PREPAID - DO NOT COLLECT CASH'}
                </p>
              </div>
              {shipment.paymentType === 'COD' ? (
                <div className="bg-black text-amber-300 border-2 border-black px-3.5 py-1 text-lg font-black font-mono rounded shadow">
                  COLLECT ₹{shipment.codAmount || shipment.totalAmount}
                </div>
              ) : (
                <div className="bg-black text-white px-2.5 py-1 font-black text-[10px] uppercase font-mono tracking-wider">
                  ONLINE PAID
                </div>
              )}
            </div>

            {/* Barcode & AWB Number Block */}
            <div className="border-b-4 border-black py-4 px-2 text-center bg-white">
              <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest mb-1.5">
                TRACKING NUMBER (AWB)
              </p>
              
              {/* High Density Barcode SVG */}
              <div className="flex justify-center my-1.5 h-16">
                <svg className="w-full max-w-[370px] h-full" viewBox="0 0 300 65">
                  <rect x="5" y="5" width="4" height="55" fill="black" />
                  <rect x="12" y="5" width="2" height="55" fill="black" />
                  <rect x="18" y="5" width="6" height="55" fill="black" />
                  <rect x="28" y="5" width="2" height="55" fill="black" />
                  <rect x="34" y="5" width="8" height="55" fill="black" />
                  <rect x="46" y="5" width="4" height="55" fill="black" />
                  <rect x="54" y="5" width="2" height="55" fill="black" />
                  <rect x="60" y="5" width="6" height="55" fill="black" />
                  <rect x="70" y="5" width="4" height="55" fill="black" />
                  <rect x="78" y="5" width="8" height="55" fill="black" />
                  <rect x="90" y="5" width="2" height="55" fill="black" />
                  <rect x="96" y="5" width="6" height="55" fill="black" />
                  <rect x="106" y="5" width="4" height="55" fill="black" />
                  <rect x="114" y="5" width="8" height="55" fill="black" />
                  <rect x="126" y="5" width="2" height="55" fill="black" />
                  <rect x="132" y="5" width="6" height="55" fill="black" />
                  <rect x="142" y="5" width="4" height="55" fill="black" />
                  <rect x="150" y="5" width="2" height="55" fill="black" />
                  <rect x="156" y="5" width="8" height="55" fill="black" />
                  <rect x="168" y="5" width="4" height="55" fill="black" />
                  <rect x="176" y="5" width="6" height="55" fill="black" />
                  <rect x="186" y="5" width="2" height="55" fill="black" />
                  <rect x="192" y="5" width="8" height="55" fill="black" />
                  <rect x="204" y="5" width="4" height="55" fill="black" />
                  <rect x="212" y="5" width="2" height="55" fill="black" />
                  <rect x="218" y="5" width="6" height="55" fill="black" />
                  <rect x="228" y="5" width="4" height="55" fill="black" />
                  <rect x="236" y="5" width="8" height="55" fill="black" />
                  <rect x="248" y="5" width="4" height="55" fill="black" />
                  <rect x="256" y="5" width="6" height="55" fill="black" />
                  <rect x="266" y="5" width="2" height="55" fill="black" />
                  <rect x="272" y="5" width="8" height="55" fill="black" />
                  <rect x="284" y="5" width="4" height="55" fill="black" />
                  <rect x="290" y="5" width="5" height="55" fill="black" />
                </svg>
              </div>

              <p className="text-2xl font-black font-mono tracking-[0.2em] text-black pt-1">{shipment.awbNumber}</p>
            </div>

            {/* Consignee Address (Deliver To) */}
            <div className="border-b-4 border-black p-3.5 space-y-1.5 bg-white">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
                  DELIVER TO
                </span>
                <span className="text-[11px] font-black font-mono text-black">
                  ORDER ID: {shipment.orderId}
                </span>
              </div>

              <p className="text-xl font-black uppercase text-black pt-1 leading-tight tracking-tight">{shipment.customer.name}</p>
              <p className="text-xs font-black text-black leading-snug">{shipment.customer.addressLine1}</p>
              {shipment.customer.addressLine2 && (
                <p className="text-xs font-extrabold text-slate-800">{shipment.customer.addressLine2}</p>
              )}
              <p className="text-xs font-black uppercase text-black">
                {shipment.customer.city}, {shipment.customer.state}
              </p>
              
              <div className="flex justify-between items-center pt-2">
                <div className="bg-black text-white px-3 py-1">
                  <p className="text-xl font-black font-mono tracking-widest text-amber-300 leading-none">
                    PIN: {shipment.customer.pincode}
                  </p>
                </div>
                <p className="text-xs font-mono font-black text-black bg-slate-100 border border-slate-300 px-2 py-1">
                  TEL: {shipment.customer.phone}
                </p>
              </div>
            </div>

            {/* QR Code & Package Manifest Details */}
            <div className="grid grid-cols-3 divide-x-4 divide-black bg-white">
              {/* Scan QR Code */}
              <div className="p-2.5 flex flex-col items-center justify-center bg-slate-50">
                <div className="w-20 h-20 bg-white border-2 border-black p-1 flex items-center justify-center shadow-inner">
                  <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="0" width="100" height="100" fill="white" />
                    
                    {/* Top Left Finder Pattern */}
                    <rect x="4" y="4" width="28" height="28" fill="black" />
                    <rect x="8" y="8" width="20" height="20" fill="white" />
                    <rect x="12" y="12" width="12" height="12" fill="black" />
                    
                    {/* Top Right Finder Pattern */}
                    <rect x="68" y="4" width="28" height="28" fill="black" />
                    <rect x="72" y="8" width="20" height="20" fill="white" />
                    <rect x="76" y="12" width="12" height="12" fill="black" />
                    
                    {/* Bottom Left Finder Pattern */}
                    <rect x="4" y="68" width="28" height="28" fill="black" />
                    <rect x="8" y="72" width="20" height="20" fill="white" />
                    <rect x="12" y="76" width="12" height="12" fill="black" />

                    {/* Alignment Pattern */}
                    <rect x="68" y="68" width="14" height="14" fill="black" />
                    <rect x="71" y="71" width="8" height="8" fill="white" />
                    <rect x="74" y="74" width="2" height="2" fill="black" />

                    {/* Data Matrix Modules */}
                    <g fill="black">
                      <rect x="36" y="6" width="4" height="4" />
                      <rect x="44" y="6" width="4" height="4" />
                      <rect x="52" y="6" width="4" height="4" />
                      <rect x="60" y="6" width="4" height="4" />

                      <rect x="36" y="14" width="8" height="4" />
                      <rect x="48" y="14" width="4" height="8" />
                      <rect x="56" y="14" width="8" height="4" />

                      <rect x="36" y="24" width="4" height="4" />
                      <rect x="44" y="24" width="8" height="4" />
                      <rect x="56" y="24" width="4" height="8" />

                      <rect x="6" y="36" width="4" height="4" />
                      <rect x="14" y="36" width="4" height="4" />
                      <rect x="22" y="36" width="4" height="4" />
                      <rect x="30" y="36" width="4" height="4" />
                      <rect x="38" y="36" width="8" height="4" />
                      <rect x="50" y="36" width="4" height="8" />
                      <rect x="58" y="36" width="6" height="4" />
                      <rect x="68" y="36" width="8" height="4" />
                      <rect x="80" y="36" width="4" height="8" />
                      <rect x="88" y="36" width="8" height="4" />

                      <rect x="6" y="44" width="8" height="4" />
                      <rect x="18" y="44" width="4" height="8" />
                      <rect x="26" y="44" width="8" height="4" />
                      <rect x="38" y="44" width="4" height="8" />
                      <rect x="46" y="48" width="8" height="8" />
                      <rect x="58" y="44" width="6" height="8" />
                      <rect x="72" y="44" width="4" height="8" />
                      <rect x="84" y="44" width="8" height="4" />

                      <rect x="6" y="56" width="4" height="4" />
                      <rect x="14" y="56" width="8" height="4" />
                      <rect x="26" y="56" width="4" height="8" />
                      <rect x="36" y="56" width="6" height="8" />
                      <rect x="46" y="60" width="8" height="4" />
                      <rect x="58" y="56" width="4" height="12" />
                      <rect x="68" y="54" width="12" height="4" />
                      <rect x="84" y="54" width="4" height="8" />
                      <rect x="92" y="54" width="4" height="16" />

                      <rect x="36" y="68" width="8" height="4" />
                      <rect x="48" y="68" width="4" height="8" />
                      <rect x="84" y="68" width="12" height="4" />

                      <rect x="36" y="76" width="12" height="4" />
                      <rect x="52" y="76" width="8" height="8" />
                      <rect x="86" y="76" width="8" height="8" />

                      <rect x="36" y="84" width="4" height="8" />
                      <rect x="44" y="88" width="12" height="4" />
                      <rect x="68" y="86" width="16" height="4" />
                      <rect x="86" y="86" width="10" height="8" />
                    </g>
                  </svg>
                </div>
                <span className="text-[8px] font-mono font-black text-black mt-1 tracking-wider">OFFICIAL ATS QR SCAN</span>
              </div>

              {/* Package Manifest Specifications */}
              <div className="p-2.5 col-span-2 text-xs space-y-1.5 bg-white">
                <div className="flex justify-between border-b border-slate-300 pb-1">
                  <span className="text-[10px] text-slate-800 font-black uppercase tracking-wider">WEIGHT:</span>
                  <span className="font-mono font-black text-black">{shipment.weightKg} KG</span>
                </div>
                <div className="flex justify-between border-b border-slate-300 pb-1">
                  <span className="text-[10px] text-slate-800 font-black uppercase tracking-wider">DIMENSIONS:</span>
                  <span className="font-mono font-black text-black">{shipment.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-slate-800 font-black uppercase tracking-wider">SHIP DATE:</span>
                  <span className="font-mono font-black text-black">{shipment.orderDate}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center no-print">
          <p className="text-xs text-gray-500">
            Tip: Press <strong>Ctrl+P</strong> or click the Print button to print this thermal label.
          </p>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold text-xs px-5 py-2 rounded-lg transition"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
};
