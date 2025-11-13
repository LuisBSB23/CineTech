/**
 * Script SQL para popular o banco de dados H2 em memória (RNF-003).
 * Baseado nos exemplos do 'Main.java' [cite: 6] e do 'Definição de Projeto' [cite: 0].
 */

-- 1. Cadastrar Usuários (antigos Clientes [cite: 15])
INSERT INTO TB_USUARIO (nome, email) VALUES ('Ana Silva', 'ana@email.com');
INSERT INTO TB_USUARIO (nome, email) VALUES ('Carlos Souza', 'carlos@email.com');

-- 2. Cadastrar Salas
INSERT INTO TB_SALA (nome, capacidade_total) VALUES ('Sala 1 - IMAX', 200);
INSERT INTO TB_SALA (nome, capacidade_total) VALUES ('Sala 2 - VIP', 50);
INSERT INTO TB_SALA (nome, capacidade_total) VALUES ('Sala 3 - Padrão', 100);

-- 3. Cadastrar Filmes
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos) VALUES (
    'A Origem', 
    'Dom Cobb é um ladrão capaz de extrair informações do subconsciente...', 
    148
);
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos) VALUES (
    'Duna: Parte Dois', 
    'Paul Atreides se une aos Fremen...', 
    166
);
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos) VALUES (
    'Interestelar', 
    'As reservas naturais da Terra estão chegando ao fim...', 
    169
);

-- 4. Cadastrar Sessões (antigos Produtos [cite: 8, 9])
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 18:00:00', 35.50, 200, 1, 1); -- A Origem
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 21:00:00', 50.00, 50, 1, 2); -- A Origem
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 19:00:00', 35.50, 150, 2, 1); -- Duna
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 20:30:00', 28.00, 100, 2, 3); -- Duna
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 20:00:00', 48.00, 45, 3, 2); -- Interestelar

-- Sessão com estoque baixo (para teste de falha RF-007 [cite: 2])
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 22:00:00', 28.00, 3, 3, 3); -- Interestelar