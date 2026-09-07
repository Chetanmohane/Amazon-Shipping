import React from 'react';
import { AmazonShippingLogo } from './AmazonShippingLogo';
import { Globe, ShieldCheck, Truck, Headphones, MapPin, ExternalLink, ChevronRight } from 'lucide-react';

interface FooterProps {
  onTrackClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onTrackClick }) => {
  return (
    <footer className="no-print bg-[#131921] text-slate-400 text-xs mt-16 border-t border-slate-800">
      
      {/* Back to top button */}
      <button 
        onClick={onTrackClick}
        className="w-full bg-[#232F3E] hover:bg-[#37475A] text-slate-200 font-bold py-3 text-xs tracking-wider transition text-center flex items-center justify-center gap-2 border-b border-slate-700 cursor-pointer"
      >
        <span>Back to Top & Track Package</span>
        <ChevronRight className="w-4 h-4 -rotate-90 text-amber-400" />
      </button>

      {/* Main Footer Links Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Branding & Overview */}
          <div className="space-y-4">
            <AmazonShippingLogo size="lg" variant="dark" />
            <p className="text-slate-400 leading-relaxed text-xs">
              Amazon Shipping provides fast, reliable, and technology-driven parcel logistics for businesses, sellers, and customers across India.
            </p>
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>India Network • 19,000+ Pincodes Covered</span>
            </div>
          </div>

          {/* Col 2: Logistics Services */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              Shipping Services
            </h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-amber-500" />
                <span>Express Air Cargo Linehaul</span>
              </li>
              <li className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-amber-500" />
                <span>Surface Bulk Transit</span>
              </li>
              <li className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-amber-500" />
                <span>OTP Verified Cash on Delivery</span>
              </li>
              <li className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-amber-500" />
                <span>Doorstep Reverse Pickups</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Business & Merchant Solutions */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              Solutions for Sellers
            </h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-amber-500" />
                <span>Amazon Seller Central (FBA/MFN)</span>
              </li>
              <li className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-amber-500" />
                <span>Shopify & D2C Store API</span>
              </li>
              <li className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-amber-500" />
                <span>1-Click Thermal Label Printing</span>
              </li>
              <li className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-amber-500" />
                <span>Enterprise SLA Cargo Slots</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Live Operations */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              Help & Customer Care
            </h4>
            <ul className="space-y-2.5 text-slate-400 font-medium">
              <li className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>24/7 Delivery Assistance Support</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Handshake OTP Security Guarantee</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Real-Time Sorting Hub Scans</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Middle Line Separator */}
        <div className="border-t border-slate-800 my-8" />

        {/* Bottom Bar: Copyright & Policies */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
          <div>
            <p className="font-semibold text-slate-400">
              © {new Date().getFullYear()} Amazon.com, Inc. or its affiliates. All rights reserved.
            </p>
            <p className="mt-0.5">
              Amazon, Amazon Shipping, Amazon Prime, and all related logos are trademarks of Amazon.com, Inc.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="hover:text-slate-300 cursor-pointer">Conditions of Use</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Notice</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Security</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Cookies & Internet Ads</span>
          </div>
        </div>

      </div>

    </footer>
  );
};
