import React, { useState } from 'react';
import { X, PlusCircle, Package, User, MapPin, DollarSign, Truck } from 'lucide-react';
import { Shipment, StatusType } from '../types/shipping';

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newShipment: Shipment) => void;
}

export const CreateShipmentModal: React.FC<CreateShipmentModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');

  const [productName, setProductName] = useState('Amazon Echo Show 8 Smart Display');
  const [productPrice, setProductPrice] = useState(8999);
  const [weightKg, setWeightKg] = useState(1.4);
  const [paymentType, setPaymentType] = useState<'Prepaid' | 'COD'>('Prepaid');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !phone || !addressLine1 || !city || !pincode) {
      alert("Please fill all mandatory customer details.");
      return;
    }

    const randomAwb = `AMZ-IN-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const randomOrderId = `408-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newShipment: Shipment = {
      awbNumber: randomAwb,
      orderId: randomOrderId,
      orderDate: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      estimatedDelivery: 'In 2-3 Days',
      status: 'ORDER_PLACED',
      paymentType,
      codAmount: paymentType === 'COD' ? Number(productPrice) : 0,
      totalAmount: Number(productPrice),
      weightKg: Number(weightKg),
      dimensions: '22 x 16 x 10 cm',
      carrierName: 'Amazon Transportation Services (ATS)',
      routingCode: `${city.substring(0, 3).toUpperCase()}/DEL-01`,
      zone: 'WEST-Z1',
      customer: {
        name: customerName,
        phone,
        email: email || `${customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        addressLine1,
        city,
        state,
        pincode
      },
      shipper: {
        warehouseName: 'Amazon FC BOM5 Main Hub',
        address: 'Bhiwandi Logistic Park C3',
        city: 'Thane',
        state: 'Maharashtra',
        pincode: '421302',
        hubCode: 'BOM5-FC',
        gstin: '27AAACA0583G1Z3'
      },
      items: [
        {
          id: `ITEM-${Date.now()}`,
          name: productName,
          quantity: 1,
          price: Number(productPrice),
          image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=400&q=80',
          sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}`
        }
      ],
      checkpoints: [
        {
          id: `CP-${Date.now()}-1`,
          timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          status: 'ORDER_PLACED',
          location: 'Amazon Logistics Facility',
          description: 'Shipment created and AWB label generated.',
          isCompleted: true
        }
      ],
      createdAt: new Date().toISOString()
    };

    onSave(newShipment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-200 my-8">
        
        {/* Header */}
        <div className="bg-[#131921] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#FF9900]" />
            <h3 className="text-base font-bold">Create New Amazon Order & Generate AWB</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Customer Info Section */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 mb-3">
              <User className="w-4 h-4" />
              <span>1. Customer & Shipping Address</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Flat No, Building, Street Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Pune"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="411001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Product & Package Details */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 mb-3">
              <Package className="w-4 h-4" />
              <span>2. Product & Package Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Total Price (₹)</label>
                <input
                  type="number"
                  required
                  value={productPrice}
                  onChange={(e) => setProductPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Package Weight (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Payment Method</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentType === 'Prepaid'}
                      onChange={() => setPaymentType('Prepaid')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>Prepaid (Online Paid)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentType === 'COD'}
                      onChange={() => setPaymentType('COD')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#FF9900] hover:bg-[#e68a00] text-black font-bold text-xs rounded-lg shadow-md transition flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Generate AWB & Save Order</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
