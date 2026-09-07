import React, { useState } from 'react';
import { Package, ShieldCheck, MapPin, PlusCircle, LayoutDashboard, LogIn, LogOut, Database, ChevronDown, Sparkles, Layers, DollarSign, HelpCircle, X, Menu } from 'lucide-react';
import { Shipment, AuthUser } from '../types/shipping';
import { AmazonShippingLogo } from './AmazonShippingLogo';

interface HeaderProps {
  activeTab: 'customer' | 'admin';
  setActiveTab: (tab: 'customer' | 'admin') => void;
  shipments: Shipment[];
  onSelectSampleAWB: (awb: string) => void;
  onOpenCreateModal: () => void;
  authUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenSupabaseModal: () => void;
  hasSupabase: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  shipments,
  onSelectSampleAWB,
  onOpenCreateModal,
  authUser,
  onOpenAuthModal,
  onLogout,
  onOpenSupabaseModal,
  hasSupabase
}) => {
  const isAdminLoggedIn = authUser && authUser.role === 'admin';
  const [activeInfoModal, setActiveInfoModal] = useState<'services' | 'solutions' | 'pricing' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleTrackPackageClick = () => {
    setActiveTab('customer');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const input = document.getElementById('tracking-search-input');
      if (input) {
        input.focus();
      }
    }, 100);
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-800 shadow-sm border-b border-slate-200">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-4">
            <div onClick={handleTrackPackageClick} className="cursor-pointer">
              <AmazonShippingLogo size="md" variant="light" />
            </div>
            
            {/* Amazon Shipping Official Desktop Menu Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-700 ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrackPackageClick();
                }}
                className={`px-3 py-2 rounded-lg transition font-medium ${
                  activeTab === 'customer'
                    ? 'text-slate-950 bg-amber-50 border border-amber-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                Track Package
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveInfoModal('services');
                }}
                className={`px-3 py-2 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                  activeInfoModal === 'services'
                    ? 'bg-amber-100/80 text-amber-900 font-bold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <span>Services</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveInfoModal('solutions');
                }}
                className={`px-3 py-2 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                  activeInfoModal === 'solutions'
                    ? 'bg-amber-100/80 text-amber-900 font-bold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <span>Solutions</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </nav>
          </div>

          {/* Right Controls (Desktop) */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">

            {/* Supabase Status Pill - Admin Only */}
            {isAdminLoggedIn && (
              <button
                onClick={onOpenSupabaseModal}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
                title="Click to configure Supabase Database"
              >
                <span className={`w-2 h-2 rounded-full ${hasSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <Database className="w-3.5 h-3.5" />
                <span className="font-bold">{hasSupabase ? 'Supabase DB' : 'Local DB'}</span>
              </button>
            )}

            {/* Mode Switcher Buttons - Only when Admin is logged in */}
            {isAdminLoggedIn && (
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                <button
                  onClick={handleTrackPackageClick}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeTab === 'customer'
                      ? 'bg-[#FF9900] text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Customer Track</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeTab === 'admin'
                      ? 'bg-[#FF9900] text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
              </div>
            )}

            {/* Quick Create Button for Admin */}
            {isAdminLoggedIn && activeTab === 'admin' && (
              <button
                onClick={onOpenCreateModal}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow transition transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">New Order</span>
              </button>
            )}

            {/* Auth / Admin Login Button */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
                <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 rounded-full flex items-center justify-center font-extrabold text-xs shadow-sm">
                  A
                </div>
                <div className="hidden sm:block leading-tight text-left">
                  <p className="text-xs font-bold text-slate-900 max-w-[120px] truncate">{authUser.name}</p>
                  <p className="text-[10px] text-amber-600 font-mono uppercase font-bold">ADMIN</p>
                </div>
                <button
                  onClick={onLogout}
                  className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition"
                  title="Sign Out Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#FF9900] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm transition transform active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}

          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex items-center md:hidden gap-2">
            {!isAdminLoggedIn && (
              <button
                onClick={onOpenAuthModal}
                className="bg-[#FF9900] text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-sm"
              >
                Login
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-xl animate-fadeIn">
          <div className="space-y-1">
            <button
              onClick={handleTrackPackageClick}
              className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between ${
                activeTab === 'customer' ? 'bg-amber-100 text-amber-950' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" />
                <span>Track Package</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveInfoModal('services'); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Services</span>
            </button>

            <button
              onClick={() => { setActiveInfoModal('solutions'); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-blue-500" />
              <span>Solutions</span>
            </button>

            {isAdminLoggedIn ? (
              <>
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <button
                    onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between ${
                      activeTab === 'admin' ? 'bg-[#FF9900] text-slate-950' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Admin Panel Dashboard</span>
                    </div>
                  </button>

                  {activeTab === 'admin' && (
                    <button
                      onClick={() => { onOpenCreateModal(); setIsMobileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl font-extrabold text-xs bg-emerald-600 text-white flex items-center gap-2 shadow-sm"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Generate New Order / AWB</span>
                    </button>
                  )}

                  <button
                    onClick={() => { onOpenSupabaseModal(); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-800 flex items-center gap-2 border border-slate-200"
                  >
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span>{hasSupabase ? 'Supabase DB Connected' : 'Setup Supabase DB'}</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center px-1">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    <span>Logged in as: {authUser.name}</span>
                  </div>
                  <button
                    onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                    className="text-red-600 font-extrabold text-xs hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Info Modals for Menu Items */}
      {activeInfoModal && (
        <div 
          onClick={() => setActiveInfoModal(null)} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 w-full max-w-lg text-slate-900 space-y-5 animate-scaleUp"
          >
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/15 text-amber-600 rounded-2xl flex items-center justify-center font-extrabold shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {activeInfoModal === 'services' && 'Amazon Shipping Services'}
                    {activeInfoModal === 'solutions' && 'Seller & Enterprise Solutions'}
                  </h3>
                  <p className="text-xs text-slate-500">Official Amazon Logistics capabilities & offerings</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveInfoModal(null)} 
                className="text-gray-400 hover:text-gray-800 p-1.5 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="text-xs space-y-4 leading-relaxed text-slate-700">
              {activeInfoModal === 'services' && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/80">
                    <p className="font-extrabold text-amber-900 text-sm mb-1">⚡ Express Air Linehaul</p>
                    <p className="text-slate-600 text-xs">Guaranteed 24-48 hour express air delivery for high-priority shipments across 19,000+ pincodes in India.</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="font-extrabold text-slate-900 text-sm mb-1">🚚 Ground Surface Transit</p>
                    <p className="text-slate-600 text-xs">Cost-effective bulk transport for heavy or oversized merchandise with live automated hub barcode scanning.</p>
                  </div>

                  <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/80">
                    <p className="font-extrabold text-emerald-950 text-sm mb-1">🔒 Verified OTP Doorstep Delivery</p>
                    <p className="text-slate-600 text-xs">Collect payments on delivery with verified digital handshake OTP validation directly with the recipient.</p>
                  </div>
                </div>
              )}

              {activeInfoModal === 'solutions' && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200/80">
                    <p className="font-extrabold text-blue-950 text-sm mb-1">🌐 D2C Brands & Storefronts</p>
                    <p className="text-slate-600 text-xs">Plug-and-play REST API integration for Shopify, WooCommerce, and custom web applications.</p>
                  </div>

                  <div className="p-3.5 bg-purple-50/80 rounded-2xl border border-purple-200/80">
                    <p className="font-extrabold text-purple-950 text-sm mb-1">📦 Amazon Seller Central Merchants</p>
                    <p className="text-slate-600 text-xs">Seamless FBA & MFN shipping manifests with 1-click thermal label printing and automated tracking updates.</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="font-extrabold text-slate-900 text-sm mb-1">🏢 Enterprise Cargo Logistics</p>
                    <p className="text-slate-600 text-xs">Dedicated air cargo slots, priority sorting hubs, and customized SLA tracking for enterprise clients.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tab Switching Footer */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveInfoModal('services')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition ${
                    activeInfoModal === 'services'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={() => setActiveInfoModal('solutions')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition ${
                    activeInfoModal === 'solutions'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Solutions
                </button>
              </div>

              <button
                onClick={() => setActiveInfoModal(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
