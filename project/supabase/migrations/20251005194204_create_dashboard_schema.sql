/*
  # Create Dashboard Application Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `password` (text)
      - `created_at` (timestamp)
    
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `invoices`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `amount` (integer, amount in cents)
      - `status` (text, 'pending' or 'paid')
      - `date` (date)
      - `created_at` (timestamp)
    
    - `revenue`
      - `month` (text, primary key)
      - `revenue` (integer, revenue in cents)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
    - Public read access for customers and invoices (for demo purposes)

  3. Important Notes
    - All monetary amounts stored as integers in cents
    - Includes sample data for demonstration
    - RLS policies ensure data security
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'paid')),
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create revenue table
CREATE TABLE IF NOT EXISTS revenue (
  month text PRIMARY KEY,
  revenue integer NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Customers policies (allow authenticated users to manage)
CREATE POLICY "Authenticated users can read customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete customers"
  ON customers FOR DELETE
  TO authenticated
  USING (true);

-- Invoices policies (allow authenticated users to manage)
CREATE POLICY "Authenticated users can read invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update invoices"
  ON invoices FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete invoices"
  ON invoices FOR DELETE
  TO authenticated
  USING (true);

-- Revenue policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can read revenue"
  ON revenue FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO users (id, name, email, password) VALUES
  ('410544b2-4001-4271-9855-fec4b6a6442a', 'User', 'user@nextmail.com', '$2b$10$K7L.BqXKK5YJKVvY4Z5/6OXJjY6qKZCOqVrjKq4DpXOXXLHO.NKMG')
ON CONFLICT (email) DO NOTHING;

INSERT INTO customers (id, name, email, image_url) VALUES
  ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 'Evil Rabbit', 'evil@rabbit.com', '/customers/evil-rabbit.png'),
  ('3958dc9e-712f-4377-85e9-fec4b6a6442a', 'Delba de Oliveira', 'delba@oliveira.com', '/customers/delba-de-oliveira.png'),
  ('3958dc9e-742f-4377-85e9-fec4b6a6442a', 'Lee Robinson', 'lee@robinson.com', '/customers/lee-robinson.png'),
  ('76d65c26-f784-44a2-ac19-586678f7c2f2', 'Michael Novotny', 'michael@novotny.com', '/customers/michael-novotny.png'),
  ('CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 'Amy Burns', 'amy@burns.com', '/customers/amy-burns.png'),
  ('13D07535-C59E-4157-A011-F8D2EF4E0CBB', 'Balazs Orban', 'balazs@orban.com', '/customers/balazs-orban.png')
ON CONFLICT (id) DO NOTHING;

INSERT INTO invoices (customer_id, amount, status, date) VALUES
  ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 15795, 'pending', '2024-12-06'),
  ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 20348, 'pending', '2024-11-14'),
  ('3958dc9e-712f-4377-85e9-fec4b6a6442a', 3040, 'paid', '2024-10-29'),
  ('3958dc9e-742f-4377-85e9-fec4b6a6442a', 44800, 'paid', '2024-09-10'),
  ('76d65c26-f784-44a2-ac19-586678f7c2f2', 34577, 'pending', '2024-08-05'),
  ('CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 54246, 'pending', '2024-07-21'),
  ('13D07535-C59E-4157-A011-F8D2EF4E0CBB', 666, 'pending', '2024-06-18'),
  ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 32545, 'paid', '2024-06-03'),
  ('3958dc9e-712f-4377-85e9-fec4b6a6442a', 1250, 'paid', '2024-05-05'),
  ('3958dc9e-742f-4377-85e9-fec4b6a6442a', 8546, 'paid', '2024-04-22'),
  ('76d65c26-f784-44a2-ac19-586678f7c2f2', 500, 'paid', '2024-03-15'),
  ('CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 8945, 'paid', '2024-02-10'),
  ('13D07535-C59E-4157-A011-F8D2EF4E0CBB', 1000, 'paid', '2024-01-05')
ON CONFLICT DO NOTHING;

INSERT INTO revenue (month, revenue) VALUES
  ('Jan', 2000),
  ('Feb', 1800),
  ('Mar', 2200),
  ('Apr', 2500),
  ('May', 2300),
  ('Jun', 3200),
  ('Jul', 3500),
  ('Aug', 3700),
  ('Sep', 2500),
  ('Oct', 2800),
  ('Nov', 3000),
  ('Dec', 4800)
ON CONFLICT (month) DO NOTHING;
