-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  uid TEXT UNIQUE NOT NULL DEFAULT 'SFV-' || substr(md5(random()::text), 1, 8) || '-' || substr(md5(random()::text), 1, 8),
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- balances
CREATE TABLE balances (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  amount DECIMAL(20,8) DEFAULT 0,
  UNIQUE(user_id, token)
);

-- transactions
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type TEXT CHECK (type IN ('deposit', 'withdraw', 'transfer')),
  token TEXT,
  amount DECIMAL(20,8),
  status TEXT DEFAULT 'pending',
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- withdrawals
CREATE TABLE withdrawals (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  token TEXT,
  amount DECIMAL(20,8),
  to_address TEXT,
  status TEXT DEFAULT 'pending',
  tx_hash TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- deposit_addresses
CREATE TABLE deposit_addresses (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  token TEXT,
  address TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- admins
CREATE TABLE admins (
  user_id UUID PRIMARY KEY REFERENCES profiles(id)
);

-- Indexes
CREATE INDEX idx_balances_user ON balances(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
CREATE INDEX idx_profiles_uid ON profiles(uid);

-- RLS: Enable
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = uid);
$$ LANGUAGE SQL SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "users_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "admins_select_all" ON profiles FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "admins_update_all" ON profiles FOR UPDATE USING (is_admin(auth.uid()));

-- Balances policies (only service-role or edge functions can INSERT/UPDATE)
CREATE POLICY "users_select_balances" ON balances FOR SELECT USING (user_id = (SELECT id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "admins_select_balances" ON balances FOR SELECT USING (is_admin(auth.uid()));

-- Transactions policies (read-only for users)
CREATE POLICY "users_select_transactions" ON transactions FOR SELECT USING (user_id = (SELECT id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "admins_select_transactions" ON transactions FOR SELECT USING (is_admin(auth.uid()));

-- Withdrawals policies
CREATE POLICY "users_select_withdrawals" ON withdrawals FOR SELECT USING (user_id = (SELECT id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "users_insert_withdrawals" ON withdrawals FOR INSERT WITH CHECK (user_id = (SELECT id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "admins_select_withdrawals" ON withdrawals FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "admins_update_withdrawals" ON withdrawals FOR UPDATE USING (is_admin(auth.uid()));

-- Deposit addresses policies
CREATE POLICY "users_select_deposits" ON deposit_addresses FOR SELECT USING (user_id = (SELECT id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "admins_select_deposits" ON deposit_addresses FOR SELECT USING (is_admin(auth.uid()));

-- Admins policies (only admins can view admin list, no one can self-promote)
CREATE POLICY "admins_view_admins" ON admins FOR SELECT USING (is_admin(auth.uid()));
