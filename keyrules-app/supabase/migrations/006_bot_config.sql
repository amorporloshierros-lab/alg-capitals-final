CREATE TABLE IF NOT EXISTS bot_config (
    id INT PRIMARY KEY DEFAULT 1,
    is_active BOOLEAN DEFAULT false,
    telegram_bot_token TEXT,
    openai_api_key TEXT,
    openai_assistant_id TEXT,
    system_prompt TEXT DEFAULT 'Eres Lucas, un experto en trading...',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Check constraint para asegurar que solo haya 1 fila en la tabla
    CONSTRAINT single_row CHECK (id = 1)
);

-- Habilitar RLS
ALTER TABLE bot_config ENABLE ROW LEVEL SECURITY;

-- Políticas: Sólo admin puede leer y escribir
CREATE POLICY "Admins can view bot_config" ON bot_config
    FOR SELECT USING (get_my_role() = 'admin');

CREATE POLICY "Admins can update bot_config" ON bot_config
    FOR UPDATE USING (get_my_role() = 'admin');

CREATE POLICY "Admins can insert bot_config" ON bot_config
    FOR INSERT WITH CHECK (get_my_role() = 'admin');

-- Insertar fila por defecto si no existe
INSERT INTO bot_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
