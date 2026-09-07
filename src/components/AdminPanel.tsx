import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  FileText, 
  Trash2, 
  Eye, 
  RefreshCw, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Lock,
  Sparkles,
  ArrowRight,
  Sliders,
  X,
  Printer
} from 'lucide-react';
import { Shipment, StatusType, AuthUser } from '../types/shipping';

interface AdminPanelProps {
  shipments: Shipment[];
  onOpenCreateModal: () => void;
  onOpenLabelModal: (shipment: Shipment) => void;
  onViewCustomerTrack: (awb: string) => void;
  onUpdateStatus: (awb: string, newStatus: StatusType, customDesc?: string, customLocation?: string) => void;
  onDeleteShipment: (awb: string) => void;
  authUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onLoginDemoAdmin: () => void;
  hasSupabase: boolean;
  onOpenSupabaseModal: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  shipments,
  onOpenCreateModal,
  onOpenLabelModal,
  onViewCustomerTrack,
  onUpdateStatus,
  onDeleteShipment,
  authUser,
  onOpenAuthModal,
  onLoginDemoAdmin,
  hasSupabase,
  onOpenSupabaseModal
}) => {
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Custom status update modal state
  const [updatingAwb, setUpdatingAwb] = useState<string | null>(null);
  const [customStatus, setCustomStatus] = useState<StatusType>('IN_TRANSIT');
  const [isHoldChecked, setIsHoldChecked] = useState<boolean>(false);
  const [customDesc, setCustomDesc] = useState('');
  const [customLocation, setCustomLocation] = useState('');

  // 1. Check Admin Auth Guard
  const isAdmin = authUser && authUser.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-gray-200 space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">Admin Authentication Required</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto mt-2">
              Only authenticated Administrators can generate AWBs, create orders, and update tracking locations in the database.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={onOpenAuthModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-7 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 text-xs"
            >
              <span>Sign In to Admin Panel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered shipments
  const filteredShipments = shipments.filter(s => {
    const matchesQuery = 
      s.awbNumber.toLowerCase().includes(filterText.toLowerCase()) ||
      s.orderId.toLowerCase().includes(filterText.toLowerCase()) ||
      s.customer.name.toLowerCase().includes(filterText.toLowerCase()) ||
      s.customer.city.toLowerCase().includes(filterText.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  const handleOpenCustomUpdate = (s: Shipment) => {
    setUpdatingAwb(s.awbNumber);
    if (s.status === 'ON_HOLD') {
      setIsHoldChecked(true);
      const cpList = s.checkpoints || [];
      let lastStage: StatusType = 'ORDER_PLACED';
      for (let i = cpList.length - 1; i >= 0; i--) {
        if (cpList[i].status && cpList[i].status !== 'ON_HOLD') {
          lastStage = cpList[i].status;
          break;
        }
      }
      setCustomStatus(lastStage);
    } else {
      setIsHoldChecked(false);
      setCustomStatus(s.status);
    }
    setCustomDesc('');
    setCustomLocation('');
  };

  const handleSaveCustomUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (updatingAwb) {
      const finalStatus: StatusType = isHoldChecked ? 'ON_HOLD' : customStatus;
      const stageName = customStatus.replace(/_/g, ' ');
      const desc = isHoldChecked
        ? (customDesc || `Order placed on hold by Admin at ${stageName} stage. Please contact seller.`)
        : customDesc;

      onUpdateStatus(updatingAwb, finalStatus, desc, customLocation || undefined);
      setUpdatingAwb(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-[#232F3E] to-slate-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FF9900] text-black font-extrabold text-xs px-2.5 py-0.5 rounded uppercase tracking-wider">
              Admin Portal
            </span>
            <span className="text-xs text-amber-400 font-mono">Logged in as: {authUser.name}</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Amazon Order & AWB Generator Dashboard
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            Generate new AWBs, update live transit checkpoints, and sync directly with Supabase DB.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenSupabaseModal}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition ${
              hasSupabase
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-amber-500/20 border-amber-400/40 text-amber-300 hover:bg-amber-500/30'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{hasSupabase ? 'Supabase DB Connected' : 'Setup Supabase Cloud DB'}</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate New Order / AWB</span>
          </button>
        </div>
      </div>

      {/* Orders List Table Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        
        {/* Table Filters Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search AWB, Order ID, Customer..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-gray-600 whitespace-nowrap">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl text-xs bg-white font-bold text-gray-800 outline-none"
            >
              <option value="ALL">All Statuses ({shipments.length})</option>
              <option value="ORDER_PLACED">Order Placed</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>

        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">AWB & Order Details</th>
                <th className="py-3.5 px-4">Customer & City</th>
                <th className="py-3.5 px-4">Current Location & Status</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <p className="font-bold text-sm">No shipments found in database.</p>
                    <p className="text-xs text-gray-400 mt-1">Click "Generate New Order / AWB" to create your first order.</p>
                  </td>
                </tr>
              ) : (
                filteredShipments.map(s => {
                  const lastCp = s.checkpoints[s.checkpoints.length - 1];
                  const currentLoc = lastCp?.location || s.shipper.city;

                  return (
                    <tr key={s.awbNumber} className="hover:bg-slate-50 transition">
                      
                      {/* AWB & Order */}
                      <td className="py-4 px-4">
                        <div className="font-mono font-bold text-sm text-gray-900 flex items-center gap-1.5">
                          <span>{s.awbNumber}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-sans font-bold">
                            Generated
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Order ID: <span className="font-mono font-semibold text-gray-800">{s.orderId}</span>
                        </p>
                        <p className="text-[10px] text-gray-400">{s.orderDate}</p>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-gray-900">{s.customer.name}</p>
                        <p className="text-gray-500">{s.customer.city}, {s.customer.state}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{s.customer.phone}</p>
                      </td>

                      {/* Status & Location */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          s.status === 'ON_HOLD'
                            ? 'bg-amber-200 text-amber-950 border border-amber-400 animate-pulse'
                            : s.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'OUT_FOR_DELIVERY'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}>
                          <span className="w-2 h-2 rounded-full bg-current" />
                          {s.status === 'ON_HOLD' ? (
                            (() => {
                              const cpList = s.checkpoints || [];
                              for (let i = cpList.length - 1; i >= 0; i--) {
                                if (cpList[i].status && cpList[i].status !== 'ON_HOLD') {
                                  return `ON HOLD (${cpList[i].status.replace(/_/g, ' ')})`;
                                }
                              }
                              return 'ON HOLD (Order Placed)';
                            })()
                          ) : (
                            s.status.replace(/_/g, ' ')
                          )}
                        </span>
                        <p className="text-[11px] text-gray-600 font-medium mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          <span>{currentLoc}</span>
                        </p>
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-gray-900">₹{s.totalAmount.toLocaleString()}</p>
                        <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {s.paymentType}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* 1-Click Toggle Order Hold */}
                          <button
                            onClick={() => {
                              const targetStatus = s.status === 'ON_HOLD' ? 'IN_TRANSIT' : 'ON_HOLD';
                              const msg = targetStatus === 'ON_HOLD'
                                ? 'Shipment placed on hold by Admin request. Please contact your seller.'
                                : 'Order hold released by Admin. Shipment in transit to destination.';
                              onUpdateStatus(s.awbNumber, targetStatus, msg, currentLoc);
                            }}
                            className={`px-2.5 py-1 rounded-lg font-black text-[11px] border transition ${
                              s.status === 'ON_HOLD'
                                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow'
                                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                            }`}
                            title={s.status === 'ON_HOLD' ? 'Release Order Hold' : 'Put Order on Hold'}
                          >
                            {s.status === 'ON_HOLD' ? 'On Hold ⚠️' : 'Put Hold'}
                          </button>

                          {/* View in Customer Track */}
                          <button
                            onClick={() => onViewCustomerTrack(s.awbNumber)}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold p-2 rounded-lg transition"
                            title="View live Customer Track Page"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Print Shipping Label */}
                          <button
                            onClick={() => onOpenLabelModal(s)}
                            className="bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 font-extrabold text-xs px-2.5 py-1 rounded-lg transition flex items-center gap-1 shadow-sm"
                            title="Generate & Print Thermal Shipping Label"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print Label</span>
                          </button>

                          {/* Update Status / Checkpoint */}
                          <button
                            onClick={() => handleOpenCustomUpdate(s)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
                            title="Update Tracking Location & Status"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Update</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete AWB ${s.awbNumber}?`)) {
                                onDeleteShipment(s.awbNumber);
                              }
                            }}
                            className="text-gray-400 hover:text-red-600 p-2 rounded-lg transition"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Custom Update Status Modal */}
      {updatingAwb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-500" />
              <span>Update Location & Status for AWB: {updatingAwb}</span>
            </h3>

            <form onSubmit={handleSaveCustomUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Target Package Stage</label>
                <select
                  value={customStatus}
                  onChange={(e) => setCustomStatus(e.target.value as StatusType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-bold outline-none"
                >
                  <option value="ORDER_PLACED">1. ORDER PLACED (Package Prepared)</option>
                  <option value="DISPATCHED">2. DISPATCHED (Picked up by ATS)</option>
                  <option value="IN_TRANSIT">3. IN TRANSIT (Hub Transit)</option>
                  <option value="OUT_FOR_DELIVERY">4. OUT FOR DELIVERY (With Delivery Agent)</option>
                  <option value="DELIVERED">5. DELIVERED (Handed to Customer)</option>
                </select>
              </div>

              <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl space-y-1">
                <label className="flex items-center gap-2 cursor-pointer font-extrabold text-amber-950">
                  <input
                    type="checkbox"
                    checked={isHoldChecked}
                    onChange={(e) => setIsHoldChecked(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
                  />
                  <span>⚠️ Put Order ON HOLD at this stage</span>
                </label>
                <p className="text-[11px] text-amber-800 font-medium pl-6">
                  When checked, tracking stops at <strong>{customStatus.replace(/_/g, ' ')}</strong> with an On Hold warning for the customer.
                </p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hub Location Name</label>
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="e.g. Mumbai Air Sorting Hub, Gate 4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Detailed Log Description</label>
                <textarea
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Package arrived at regional air gateway and scanned by express handler."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUpdatingAwb(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 font-extrabold text-slate-950 rounded-lg shadow"
                >
                  Update Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
