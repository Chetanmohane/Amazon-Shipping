import React, { useState } from 'react';
import { X, Database, Check, Copy, Key, Server, FileCode, ExternalLink, ShieldCheck } from 'lucide-react';
import { getSupabaseCredentials, saveSupabaseCredentials, testSupabaseConnection } from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const current = getSupabaseCredentials();
  const [url, setUrl] = useState(current.url);
  const [anonKey, setAnonKey] = useState(current.anonKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const sqlSchemaText = `-- Supabase Table Schema & Security Policies
CREATE TABLE IF NOT EXISTS public.shipments (
    awb_number VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    order_date VARCHAR(64) NOT NULL,
    estimated_delivery VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ORDER_PLACED',
    payment_type VARCHAR(16) NOT NULL DEFAULT 'Prepaid',
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    weight_kg NUMERIC(6,2) DEFAULT 1.0,
    dimensions VARCHAR(32) DEFAULT '25 x 15 x 10 cm',
    carrier_name VARCHAR(64) DEFAULT 'Amazon Logistics (ATS)',
    routing_code VARCHAR(32) DEFAULT 'HUB-01',
    zone VARCHAR(32) DEFAULT 'Zone A',
    customer_info JSONB NOT NULL,
    shipper_info JSONB NOT NULL,
    items JSONB NOT NULL,
    delivery_agent JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.checkpoints (
    id VARCHAR(64) PRIMARY KEY,
    awb_number VARCHAR(64) REFERENCES public.shipments(awb_number) ON DELETE CASCADE,
    timestamp VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT true
);

ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkpoints ENABLE ROW LEVEL SECURITY;

-- Allow Public Access (SELECT, INSERT, UPDATE, DELETE) for tracking portal
CREATE POLICY "Allow public all shipments" ON public.shipments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all checkpoints" ON public.checkpoints FOR ALL USING (true) WITH CHECK (true);`;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    const ok = await testSupabaseConnection(url.trim(), anonKey.trim());
    setTesting(false);

    if (ok) {
      setTestResult({
        success: true,
        message: 'Successfully connected to your Supabase project! "shipments" table is ready.'
      });
    } else {
      setTestResult({
        success: false,
        message: 'Could not connect or "shipments" table was not found. Please ensure you executed the SQL script in Supabase.'
      });
    }
  };

  const handleSave = () => {
    saveSupabaseCredentials(url.trim(), anonKey.trim());
    onConfigSaved();
    onClose();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-[#131921] to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                Supabase Database Setup
                {current.hasCredentials && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    Configured
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-300">
                Connect your real Supabase Database or run in local cache mode
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          
          {/* Status Alert Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            current.hasCredentials
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <Server className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-bold">
                {current.hasCredentials
                  ? 'Supabase Database credentials active'
                  : 'Currently running in LocalStorage Cache Mode'}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed opacity-90">
                {current.hasCredentials
                  ? 'Orders generated by Admin are being saved and synced live with your Supabase cloud tables!'
                  : 'No Supabase keys detected. The application is saving orders locally in your browser. Enter your Supabase project URL and anon key below to connect live cloud database.'}
              </p>
            </div>
          </div>

          {/* Form Credentials */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-emerald-600" />
              <span>Project Credentials</span>
            </h4>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Supabase Project URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzxyz.supabase.co"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Supabase Anon Key</label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing || !url || !anonKey}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2 rounded-lg transition disabled:opacity-50"
              >
                {testing ? 'Testing Connection...' : 'Test Connection'}
              </button>
            </div>

            {testResult && (
              <div className={`p-3 rounded-lg border text-xs font-semibold ${
                testResult.success
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-red-100 border-red-300 text-red-900'
              }`}>
                {testResult.message}
              </div>
            )}
          </div>

          {/* SQL Schema Script Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-blue-600" />
                <span>1-Click Copy Supabase SQL Schema</span>
              </h4>
              <button
                type="button"
                onClick={handleCopySql}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
              </button>
            </div>

            <p className="text-gray-500 text-[11px]">
              Copy and run this SQL query inside your Supabase project's SQL Editor to set up `shipments` & `checkpoints` tables instantly.
            </p>

            <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[10px] max-h-40 overflow-y-auto border border-slate-800 leading-relaxed">
              {sqlSchemaText}
            </pre>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              saveSupabaseCredentials('', '');
              setUrl('');
              setAnonKey('');
              onConfigSaved();
              onClose();
            }}
            className="text-red-600 hover:underline font-bold text-xs"
          >
            Clear Credentials (Use Local Storage)
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg shadow transition"
            >
              Save Database Config
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
