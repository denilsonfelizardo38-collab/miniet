-- Seed data para o MiniGest
-- Corre depois do migration.sql no Supabase SQL Editor

-- Admin e funcionário
INSERT INTO "users" ("id", "name", "email", "password", "role", "active")
VALUES
  (gen_random_uuid()::text, 'Administrador', 'admin@minigest.pt', '$2a$10$hjP0lZAACmzAU3dCD.hbXu4znOV9SiDeeRJZ5m3/oSatQhsqdHaUu', 'ADMIN', true),
  (gen_random_uuid()::text, 'Funcionário', 'funcionario@minigest.pt', '$2a$10$wt2xdQxl.jBo0fm.17qwXOj/YuBkZZJ78N51u0XeKjGH1UeyekOA.', 'STAFF', true)
ON CONFLICT ("email") DO NOTHING;

-- Categorias
INSERT INTO "categories" ("id", "name", "slug")
VALUES
  (gen_random_uuid()::text, 'Bebidas', 'bebidas'),
  (gen_random_uuid()::text, 'Comidas', 'comidas'),
  (gen_random_uuid()::text, 'Serviços', 'servicos')
ON CONFLICT ("slug") DO NOTHING;

-- Produtos (só insere se a tabela estiver vazia)
DO $$
DECLARE
  bebidas_id TEXT;
  comidas_id TEXT;
  servicos_id TEXT;
  product_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO product_count FROM "products";
  IF product_count > 0 THEN
    RETURN;
  END IF;

  SELECT "id" INTO bebidas_id FROM "categories" WHERE "slug" = 'bebidas';
  SELECT "id" INTO comidas_id FROM "categories" WHERE "slug" = 'comidas';
  SELECT "id" INTO servicos_id FROM "categories" WHERE "slug" = 'servicos';

  INSERT INTO "products" ("id", "name", "price", "costPrice", "stock", "minStock", "categoryId")
  VALUES
    (gen_random_uuid()::text, 'Café Expresso', 40, 10, 200, 50, bebidas_id),
    (gen_random_uuid()::text, 'Café Latte', 60, 15, 150, 30, bebidas_id),
    (gen_random_uuid()::text, 'Coca-Cola 33cl', 50, 25, 100, 20, bebidas_id),
    (gen_random_uuid()::text, 'Água 50cl', 40, 15, 200, 40, bebidas_id),
    (gen_random_uuid()::text, 'Sumo Natural', 80, 35, 50, 10, bebidas_id),
    (gen_random_uuid()::text, 'Torrada Mista', 120, 45, 30, 10, comidas_id),
    (gen_random_uuid()::text, 'Pastel de Nata', 50, 15, 40, 10, comidas_id),
    (gen_random_uuid()::text, 'Bola de Berlim', 100, 35, 20, 5, comidas_id),
    (gen_random_uuid()::text, 'Corte de Cabelo', 300, 0, 999, 0, servicos_id),
    (gen_random_uuid()::text, 'Manicure', 400, 80, 50, 10, servicos_id);
END $$;

-- Clientes
INSERT INTO "customers" ("id", "name", "phone", "points")
VALUES
  (gen_random_uuid()::text, 'Denilson Felizardo Victor', '+258879101185', 120),
  (gen_random_uuid()::text, 'Victor', '+258844101199', 45),
  (gen_random_uuid()::text, 'Modesta', '+258874101166', 200)
ON CONFLICT ("phone") DO NOTHING;
