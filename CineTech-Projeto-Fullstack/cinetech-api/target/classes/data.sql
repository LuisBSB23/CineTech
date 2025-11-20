/**
 * Script SQL para popular o banco de dados H2/MySQL ao iniciar.
 */

-- 1. Cadastrar Usuários
INSERT INTO TB_USUARIO (nome, email) VALUES ('Ana Silva', 'ana@email.com');
INSERT INTO TB_USUARIO (nome, email) VALUES ('Carlos Souza', 'carlos@email.com');

-- 2. Cadastrar Salas (ATUALIZADO: Todas com capacidade 80)
INSERT INTO TB_SALA (nome, capacidade_total) VALUES ('Sala 1 - IMAX', 80);
INSERT INTO TB_SALA (nome, capacidade_total) VALUES ('Sala 2 - VIP', 80);
INSERT INTO TB_SALA (nome, capacidade_total) VALUES ('Sala 3 - Padrão', 80);

-- 3. Cadastrar Filmes (Adicionados mais 7 filmes)
-- A Origem
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'A Origem', 
    'Dom Cobb é um ladrão habilidoso, o melhor na perigosa arte da extração, roubando segredos valiosos do fundo do subconsciente durante o estado de sonho.', 
    148,
    'https://image.tmdb.org/t/p/w780/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
);

-- Duna: Parte Dois
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Duna: Parte Dois', 
    'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família.', 
    166,
    'https://image.tmdb.org/t/p/w780/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg'
);

-- Interestelar
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Interestelar', 
    'Um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial.', 
    169,
    'https://image.tmdb.org/t/p/w780/gEU2QniL6E8AHtMY4kOD87CFEcc.jpg'
);

-- Novos Filmes
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Batman', 
    'Bruce Wayne atua como o vigilante de Gotham City há dois anos e isso o leva às sombras da cidade.', 
    176,
    'https://image.tmdb.org/t/p/w780/wd7b4Ni9IuMMt7NCXYDceKC3dB.jpg'
);

INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Avatar: O Caminho da Água', 
    'Jake Sully vive com sua nova família no planeta Pandora. Uma ameaça familiar retorna para acabar com o que foi iniciado anteriormente.', 
    192,
    'https://image.tmdb.org/t/p/w780/mbYQLLluS651W89jO7MOZcLSCuw.jpg'
);

INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Oppenheimer', 
    'A história do físico americano J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.', 
    180,
    'https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
);

INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Homem-Aranha: Através do Aranhaverso', 
    'Miles Morales é catapultado através do Multiverso, onde ele encontra uma equipe de Pessoas-Aranha encarregada de proteger a própria existência.', 
    140,
    'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg'
);

INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Matrix', 
    'Um hacker aprende com rebeldes misteriosos sobre a verdadeira natureza de sua realidade e seu papel na guerra contra seus controladores.', 
    136,
    'https://image.tmdb.org/t/p/w780/lZpWprJgY75k5iwW7Wl12U3FFg.jpg'
);

INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Vingadores: Ultimato', 
    'Após os eventos devastadores de Guerra Infinita, o universo está em ruínas. Com a ajuda dos aliados restantes, os Vingadores se reúnem.', 
    181,
    'https://image.tmdb.org/t/p/w780/q6725aR8Zs4IwGMXzZT8aC8lh41.jpg'
);

INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Top Gun: Maverick', 
    'Depois de mais de 30 anos de serviço como um dos principais aviadores da Marinha, Pete "Maverick" Mitchell está de volta.', 
    131,
    'https://image.tmdb.org/t/p/w780/i0z8g2VRZP3dhVvvSMilbOZMKqR.jpg'
);

-- 4. Cadastrar Sessões (Atualizado com mais horários e filmes)
-- A Origem (ID 1)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 18:00:00', 35.50, 80, 1, 1),
('2025-11-12 21:00:00', 50.00, 20, 1, 2); 

-- Duna (ID 2)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 19:00:00', 35.50, 60, 2, 1),
('2025-11-12 20:30:00', 28.00, 40, 2, 3); 

-- Interestelar (ID 3)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 20:00:00', 48.00, 10, 3, 2); 

-- Batman (ID 4)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 17:00:00', 40.00, 80, 4, 1);

-- Avatar (ID 5)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 16:00:00', 55.00, 75, 5, 1);

-- Oppenheimer (ID 6)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 19:30:00', 45.00, 5, 6, 3);

-- Homem Aranha (ID 7)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 14:00:00', 30.00, 80, 7, 2);

-- Matrix (ID 8)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 22:00:00', 25.00, 80, 8, 3);

-- Vingadores (ID 9)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 18:30:00', 40.00, 0, 9, 1); -- Sessão esgotada

-- Top Gun (ID 10)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 15:00:00', 35.00, 42, 10, 2);