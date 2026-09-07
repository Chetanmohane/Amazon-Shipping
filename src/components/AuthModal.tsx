import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { AuthUser } from '../types/shipping';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export const ADMIN_EMAIL = 'chetanmohane27@gmail.com';
export const ADMIN_PASSWORD = 'Admin123';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const inputEmail = email.trim().toLowerCase();
    const inputPass = password.trim();

    if (inputEmail === ADMIN_EMAIL.toLowerCase() && inputPass === ADMIN_PASSWORD) {
      const adminUser: AuthUser = {
        id: 'usr-admin-chetan',
        email: ADMIN_EMAIL,
        name: 'Admin Chetan Mohane',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(adminUser);
      onClose();
    } else {
      setError('Invalid email or password. Please enter correct Admin credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden relative max-h-[90vh] overflow-y-auto">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-[#FF9900] rounded-xl text-slate-950 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-lg font-extrabold text-white">Admin Portal Sign In</h3>
              <p className="text-xs text-amber-300 font-medium">
                Enter your admin email and password to sign in
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg leading-relaxed font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Admin Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-medium outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-medium outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition transform active:scale-98 text-sm"
            >
              <span>Sign In to Admin Panel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
