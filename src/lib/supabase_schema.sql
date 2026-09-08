-- ============================================================
-- AMAZON LOGISTICS TRACKING & SHIPMENT SUPABASE DATABASE SCHEMA
-- Execute this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. Create Shipments Table
CREATE TABLE IF NOT EXISTS public.shipments (
    awb_number VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    order_date VARCHAR(64) NOT NULL,
    estimated_delivery VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ORDER_PLACED',
    payment_type VARCHAR(16) NOT NULL DEFAULT 'Prepaid',
    cod_amount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    weight_kg NUMERIC(6,2) DEFAULT 1.0,
    dimensions VARCHAR(32) DEFAULT '25 x 15 x 10 cm',
    carrier_name VARCHAR(64) DEFAULT 'Amazon Logistics (ATS)',
    routing_code VARCHAR(32) DEFAULT 'DEL-NORTH-HUB',
    zone VARCHAR(16) DEFAULT 'Zone B',
    customer_info JSONB NOT NULL,
    shipper_info JSONB NOT NULL,
    items JSONB NOT NULL,
    delivery_agent JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Checkpoints Table
CREATE TABLE IF NOT EXISTS public.checkpoints (
    id VARCHAR(64) PRIMARY KEY,
    awb_number VARCHAR(64) REFERENCES public.shipments(awb_number) ON DELETE CASCADE,
    timestamp VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Users / Profiles Table (Optional for Auth integration)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(32) DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) & Public Read Access
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow anonymous & authenticated users to read shipments (for customer tracking)
CREATE POLICY "Allow public select shipments" ON public.shipments FOR SELECT USING (true);

-- Allow public insert / update / delete for admin & demo operations
CREATE POLICY "Allow public insert shipments" ON public.shipments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update shipments" ON public.shipments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete shipments" ON public.shipments FOR DELETE USING (true);

CREATE POLICY "Allow public select checkpoints" ON public.checkpoints FOR SELECT USING (true);
CREATE POLICY "Allow public insert checkpoints" ON public.checkpoints FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update checkpoints" ON public.checkpoints FOR UPDATE USING (true);
CREATE POLICY "Allow public delete checkpoints" ON public.checkpoints FOR DELETE USING (true);

-- 5. Insert Sample Order for immediate testing
INSERT INTO public.shipments (
    awb_number, order_id, order_date, estimated_delivery, status, payment_type, 
    total_amount, weight_kg, dimensions, carrier_name, routingCode, zone,
    customer_info, shipper_info, items, delivery_agent
) VALUES (
    'AMZ-IND-88492041',
    'OD-2026-991823',
    'Sept 07, 2026',
    'Sept 09, 2026',
    'IN_TRANSIT',
    'Prepaid',
    2499.00,
    1.45,
    '30 x 20 x 12 cm',
    'Amazon Transportation Services',
    'BOM-WEST-01',
    'Zone A',
    '{"name": "Rahul Sharma", "phone": "+91 98765 43210", "email": "rahul.sharma@example.com", "addressLine1": "Flat 402, Sunshine Heights", "addressLine2": "Andheri East", "city": "Mumbai", "state": "Maharashtra", "pincode": "400069", "landmark": "Near Metro Station"}'::jsonb,
    '{"warehouseName": "Amazon FC BOM3 Hub", "address": "Bhiwandi Logistics Park", "city": "Thane", "state": "Maharashtra", "pincode": "421302", "hubCode": "FC-BOM-3", "gstin": "27AAAAA0000A1Z5"}'::jsonb,
    '[{"id": "itm-1", "name": "Echo Dot (5th Gen) Smart Speaker", "quantity": 1, "price": 2499, "sku": "AMZ-ECHO-5G", "image": "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400"}]'::jsonb,
    '{"name": "Suresh Kumar", "phone": "+91 99887 76655", "vehicleNo": "MH-02-DN-4491"}'::jsonb
) ON CONFLICT (awb_number) DO NOTHING;

INSERT INTO public.checkpoints (id, awb_number, timestamp, status, location, description, is_completed)
VALUES 
  ('cp-1', 'AMZ-IND-88492041', 'Sept 07, 10:00 AM', 'ORDER_PLACED', 'FC BOM3 Hub, Thane', 'Order packaged & manifest created by seller.', true),
  ('cp-2', 'AMZ-IND-88492041', 'Sept 07, 02:30 PM', 'DISPATCHED', 'Bhiwandi Sorting Hub', 'Scanned at outbound sorting terminal.', true),
  ('cp-3', 'AMZ-IND-88492041', 'Sept 07, 07:15 PM', 'IN_TRANSIT', 'Mumbai Central Air Hub', 'In transit via ATS Express Linehaul.', true)
ON CONFLICT (id) DO NOTHING;
