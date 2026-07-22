-- Añadir columna trading_stats a profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS trading_stats JSONB DEFAULT '{"total":0, "winRate":0, "pnlPct":0, "equity":[]}'::jsonb;

-- Crear tabla webhook_logs (opcional, para auditar qué manda el broker)
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
-- Solo admins pueden ver los logs
CREATE POLICY "Admins can view webhook_logs" ON webhook_logs
    FOR SELECT USING (get_my_role() = 'admin');
