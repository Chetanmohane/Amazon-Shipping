import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TrackingSearch } from './components/TrackingSearch';
import { TrackingDetails } from './components/TrackingDetails';
import { AdminPanel } from './components/AdminPanel';
import { ShippingLabelModal } from './components/ShippingLabelModal';
import { CreateShipmentModal } from './components/CreateShipmentModal';
import { AuthModal } from './components/AuthModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { LandingFeatures } from './components/LandingFeatures';
import { Footer } from './components/Footer';
import { Shipment, StatusType, AuthUser } from './types/shipping';
import { 
  fetchAllShipments, 
  saveNewShipment, 
  updateShipmentStatusInDb, 
  deleteShipmentFromDb 
} from './services/shipmentService';
import { getSupabaseCredentials } from './lib/supabase';

export function App() {
  // Initialize activeTab to 'admin' if admin is already logged in
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>(() => {
    const saved = localStorage.getItem('amazon_portal_auth_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u && u.role === 'admin') return 'admin';
      } catch (e) {}
    }
    return 'customer';
  });
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [searchedAwb, setSearchedAwb] = useState<string>('');

  // Modals state
  const [labelModalShipment, setLabelModalShipment] = useState<Shipment | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  // Auth User state (Persisted in localStorage)
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('amazon_portal_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Supabase connection state indicator
  const [hasSupabase, setHasSupabase] = useState<boolean>(() => {
    return getSupabaseCredentials().hasCredentials;
  });

  // Load shipments from DB on mount
  const loadData = async () => {
    setLoading(true);
    const loaded = await fetchAllShipments();
    setShipments(loaded);
    setLoading(false);

    // Check URL search query param ?awb=...
    const urlParams = new URLSearchParams(window.location.search);
    const awbFromUrl = urlParams.get('awb');

    if (awbFromUrl) {
      setSearchQuery(awbFromUrl);
      executeStrictSearch(awbFromUrl, loaded);
    } else {
      setSelectedShipment(null);
      setNotFound(false);
    }
  };

  useEffect(() => {
    loadData();

    // Auto-poll Global Cloud DB every 6 seconds for live multi-device sync
    const interval = setInterval(() => {
      loadData();
    }, 6000);

    const handleFocus = () => {
      loadData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Save Auth User to localStorage & switch tabs
  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUser(user);
    localStorage.setItem('amazon_portal_auth_user', JSON.stringify(user));
    if (user.role === 'admin') {
      setActiveTab('admin');
    }
    loadData();
  };

  const handleLogout = () => {
    setAuthUser(null);
    localStorage.removeItem('amazon_portal_auth_user');
    setActiveTab('customer');
  };

  // Quick Demo Admin Login
  const handleQuickDemoAdmin = () => {
    const adminUser: AuthUser = {
      id: 'usr-admin-chetan',
      email: 'chetanmohane27@gmail.com',
      name: 'Admin Chetan Mohane',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    handleLoginSuccess(adminUser);
  };

  // Search logic: Match AWB Number or Order ID in database with string normalization
  const executeStrictSearch = (query: string, currentShipments: Shipment[] = shipments) => {
    const raw = query.trim();
    setSearchedAwb(raw);

    if (!raw) {
      setSelectedShipment(null);
      setNotFound(false);
      return;
    }

    const uppercaseQuery = raw.toUpperCase();
    const cleanAlphanumeric = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    const found = currentShipments.find(s => {
      const awbUpper = s.awbNumber.toUpperCase();
      const orderUpper = s.orderId.toUpperCase();
      const awbAlpha = s.awbNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const orderAlpha = s.orderId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

      return (
        awbUpper === uppercaseQuery ||
        orderUpper === uppercaseQuery ||
        (cleanAlphanumeric.length >= 3 && awbAlpha === cleanAlphanumeric) ||
        (cleanAlphanumeric.length >= 3 && orderAlpha === cleanAlphanumeric) ||
        (cleanAlphanumeric.length >= 3 && awbAlpha.includes(cleanAlphanumeric)) ||
        (cleanAlphanumeric.length >= 3 && orderAlpha.includes(cleanAlphanumeric)) ||
        (uppercaseQuery.length >= 3 && awbUpper.includes(uppercaseQuery)) ||
        (uppercaseQuery.length >= 3 && orderUpper.includes(uppercaseQuery))
      );
    });

    if (found) {
      setSelectedShipment(found);
      setNotFound(false);
    } else {
      setSelectedShipment(null);
      setNotFound(true);
    }
  };

  const handleSearch = (query: string) => {
    executeStrictSearch(query);
  };

  // Handle Select Sample AWB
  const handleSelectSampleAWB = (awb: string) => {
    setSearchQuery(awb);
    executeStrictSearch(awb);
    setActiveTab('customer');
  };

  // Create Shipment Handler from Admin
  const handleSaveNewShipment = async (newShipment: Shipment) => {
    const updated = await saveNewShipment(newShipment);
    setShipments(updated);
    setSelectedShipment(newShipment);
    setSearchQuery(newShipment.awbNumber);
    setNotFound(false);
    setActiveTab('customer');
  };

  // Live Transit Movement Simulator
  const handleSimulateNextStep = async (awb: string) => {
    const s = shipments.find(item => item.awbNumber === awb);
    if (!s) return;

    let nextStatus: StatusType = s.status;
    let desc = "";
    let location = "";

    if (s.status === 'ORDER_PLACED') {
      nextStatus = 'DISPATCHED';
      desc = "Package scanned and dispatched from Fulfillment Hub.";
      location = "Primary Sorting Hub";
    } else if (s.status === 'DISPATCHED') {
      nextStatus = 'IN_TRANSIT';
      desc = "Package in transit via Express Air Linehaul.";
      location = "Regional Air Cargo Center";
    } else if (s.status === 'IN_TRANSIT') {
      nextStatus = 'OUT_FOR_DELIVERY';
      desc = "Package assigned to delivery associate Ramesh Verma. Out for final delivery!";
      location = "Local Delivery Station";
    } else if (s.status === 'OUT_FOR_DELIVERY') {
      nextStatus = 'DELIVERED';
      desc = "Handed to customer successfully. Handshake OTP verified!";
      location = s.customer.addressLine1;
    }

    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const newCp = {
      id: `CP-SIM-${Date.now()}`,
      timestamp,
      status: nextStatus,
      location,
      description: desc,
      isCompleted: true
    };

    const updated = await updateShipmentStatusInDb(awb, nextStatus, newCp);
    setShipments(updated);

    const updatedShipment = updated.find(item => item.awbNumber === awb);
    if (updatedShipment) {
      setSelectedShipment(updatedShipment);
    }
  };

  // Update Status & Checkpoints from Admin
  const handleUpdateStatus = async (
    awb: string, 
    newStatus: StatusType, 
    customDesc?: string, 
    customLocation?: string
  ) => {
    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    
    let desc = customDesc;
    if (!desc) {
      switch (newStatus) {
        case 'DISPATCHED': desc = "Package dispatched from fulfillment hub."; break;
        case 'IN_TRANSIT': desc = "In transit to destination facility."; break;
        case 'OUT_FOR_DELIVERY': desc = "Out for delivery with delivery agent."; break;
        case 'DELIVERED': desc = "Handed over to customer successfully."; break;
        case 'ON_HOLD': desc = "Shipment placed on hold by Amazon Logistics / Seller request. Please contact your seller."; break;
        default: desc = "Order status updated by Admin.";
      }
    }

    const location = customLocation || (newStatus === 'DELIVERED' ? 'Customer Address' : 'Hub Facility');

    const newCheckpoint = {
      id: `CP-${Date.now()}`,
      timestamp,
      status: newStatus,
      location,
      description: desc,
      isCompleted: true
    };

    const updated = await updateShipmentStatusInDb(awb, newStatus, newCheckpoint);
    setShipments(updated);

    const updatedShipment = updated.find(item => item.awbNumber === awb);
    if (updatedShipment) {
      setSelectedShipment(updatedShipment);
    }
  };

  // Delete Shipment
  const handleDeleteShipment = async (awb: string) => {
    const updated = await deleteShipmentFromDb(awb);
    setShipments(updated);
    if (selectedShipment?.awbNumber === awb) {
      setSelectedShipment(null);
    }
  };

  const handleSupabaseConfigSaved = () => {
    setHasSupabase(getSupabaseCredentials().hasCredentials);
    loadData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EAEDED] text-gray-900">
      
      {/* Navbar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shipments={shipments}
        onSelectSampleAWB={handleSelectSampleAWB}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        authUser={authUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        hasSupabase={hasSupabase}
      />

      {/* Main Body View Switching */}
      <main className="flex-1">
        {activeTab === 'customer' ? (
          <div>
            <TrackingSearch
              onSearch={handleSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              shipments={shipments}
              notFound={notFound}
              searchedAwb={searchedAwb}
            />

            {loading ? (
              <div className="text-center py-16 text-gray-500 font-bold text-sm">
                Loading shipments from Database...
              </div>
            ) : selectedShipment ? (
              <TrackingDetails
                shipment={selectedShipment}
                onOpenLabel={(s) => setLabelModalShipment(s)}
                onSimulateNextStep={handleSimulateNextStep}
              />
            ) : (
              !notFound && <LandingFeatures />
            )}
          </div>
        ) : (
          <AdminPanel
            shipments={shipments}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onOpenLabelModal={(s) => setLabelModalShipment(s)}
            onViewCustomerTrack={(awb) => handleSelectSampleAWB(awb)}
            onUpdateStatus={handleUpdateStatus}
            onDeleteShipment={handleDeleteShipment}
            authUser={authUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onLoginDemoAdmin={handleQuickDemoAdmin}
            hasSupabase={hasSupabase}
            onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
            onRefreshData={loadData}
          />
        )}
      </main>

      {/* Modals */}
      <ShippingLabelModal
        shipment={labelModalShipment}
        onClose={() => setLabelModalShipment(null)}
      />

      <CreateShipmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveNewShipment}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigSaved={handleSupabaseConfigSaved}
      />

      {/* Footer */}
      <Footer onTrackClick={() => {
        setActiveTab('customer');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          const input = document.getElementById('tracking-search-input');
          if (input) input.focus();
        }, 100);
      }} />

    </div>
  );
}

export default App;
