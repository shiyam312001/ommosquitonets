-- WhatsApp device linking (QR scan) fields
ALTER TABLE whatsapp_config ADD COLUMN IF NOT EXISTS qr_code TEXT;
ALTER TABLE whatsapp_config ADD COLUMN IF NOT EXISTS linked_phone TEXT;
ALTER TABLE whatsapp_config ADD COLUMN IF NOT EXISTS connection_mode TEXT DEFAULT 'device';
