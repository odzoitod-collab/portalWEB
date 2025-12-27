-- Создание таблицы системных настроек
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавляем базовые настройки
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('support_username', 'your_support_username', 'Никнейм техподдержки в Telegram без @')
ON CONFLICT (setting_key) DO NOTHING;

-- Создание функции для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Создание триггера для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Добавляем RLS (Row Level Security) если нужно
-- ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Пример политики безопасности (настройте под свои нужды)
-- CREATE POLICY "Allow read access to system_settings" ON system_settings
--     FOR SELECT USING (true);

-- CREATE POLICY "Allow admin update access to system_settings" ON system_settings
--     FOR UPDATE USING (auth.role() = 'admin');