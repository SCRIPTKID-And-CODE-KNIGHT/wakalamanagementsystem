
-- Add new network types to the enum
ALTER TYPE public.network_type ADD VALUE IF NOT EXISTS 'Halo Pesa';
ALTER TYPE public.network_type ADD VALUE IF NOT EXISTS 'NMB BANK';
ALTER TYPE public.network_type ADD VALUE IF NOT EXISTS 'CRDB BANK';
