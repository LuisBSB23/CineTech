/**
 * Script SQL para popular o banco de dados H2/MySQL ao iniciar.
 */

-- 1. Cadastrar Usuários
INSERT INTO TB_USUARIO (nome, email) VALUES ('Ana Silva', 'ana@email.com');
INSERT INTO TB_USUARIO (nome, email) VALUES ('Carlos Souza', 'carlos@email.com');

-- 2. Cadastrar Salas (Todas com capacidade 80)
INSERT INTO TB_SALA (nome, capacidade_total) VALUES ('Sala 1 - IMAX', 80);
INSERT INTO TB_SALA (nome, capacidade_total) VALUES ('Sala 2 - VIP', 80);
INSERT INTO TB_SALA (nome, capacidade_total) VALUES ('Sala 3 - Padrão', 80);

-- 3. Cadastrar Filmes (12 Filmes cobrindo Ação, Sci-Fi, Drama e Aventura)

-- ID 1: A Origem (Sci-Fi / Ação)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'A Origem', 
    'Dom Cobb é um ladrão habilidoso, o melhor na perigosa arte da extração, roubando segredos valiosos do fundo do subconsciente durante o estado de sonho.', 
    148,
    'https://image.tmdb.org/t/p/w780/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
);

-- ID 2: Duna: Parte Dois (Sci-Fi / Aventura)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Duna: Parte Dois', 
    'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família.', 
    166,
    'https://image.tmdb.org/t/p/w780/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg'
);

-- ID 3: Interestelar (Sci-Fi / Drama)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Interestelar', 
    'Um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial.', 
    169,
    'https://images.justwatch.com/poster/312160153/s718/interestelar.jpg'
);

-- ID 4: Batman (Ação / Drama)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Batman', 
    'Bruce Wayne atua como o vigilante de Gotham City há dois anos e isso o leva às sombras da cidade.', 
    176,
    'https://br.web.img3.acsta.net/pictures/22/03/02/19/26/3666027.jpg'
);

-- ID 5: Avatar: O Caminho da Água (Sci-Fi / Aventura)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Avatar: O Caminho da Água', 
    'Jake Sully vive com sua nova família no planeta Pandora. Uma ameaça familiar retorna para acabar com o que foi iniciado anteriormente.', 
    192,
    'https://upload.wikimedia.org/wikipedia/pt/5/54/Avatar_The_Way_of_Water_poster.jpg'
);

-- ID 6: Oppenheimer (Drama / Histórico)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Oppenheimer', 
    'A história do físico americano J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.', 
    180,
    'https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
);

-- ID 7: Homem-Aranha: Através do Aranhaverso (Ação / Aventura / Animação)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Homem-Aranha: Através do Aranhaverso', 
    'Miles Morales é catapultado através do Multiverso, onde ele encontra uma equipe de Pessoas-Aranha encarregada de proteger a própria existência.', 
    140,
    'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg'
);

-- ID 8: Matrix (Sci-Fi / Ação)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Matrix', 
    'Um hacker aprende com rebeldes misteriosos sobre a verdadeira natureza de sua realidade e seu papel na guerra contra seus controladores.', 
    136,
    'https://br.web.img2.acsta.net/medias/nmedia/18/91/08/82/20128877.JPG'
);

-- ID 9: Vingadores: Ultimato (Ação / Aventura)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Vingadores: Ultimato', 
    'Após os eventos devastadores de Guerra Infinita, o universo está em ruínas. Com a ajuda dos aliados restantes, os Vingadores se reúnem.', 
    181,
    'https://image.tmdb.org/t/p/w780/q6725aR8Zs4IwGMXzZT8aC8lh41.jpg'
);

-- ID 10: Top Gun: Maverick (Ação / Drama)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Top Gun: Maverick', 
    'Depois de mais de 30 anos de serviço como um dos principais aviadores da Marinha, Pete "Maverick" Mitchell está de volta.', 
    131,
    'https://upload.wikimedia.org/wikipedia/pt/d/d2/Top_Gun_Maverick.jpg'
);

-- ID 11: O Senhor dos Anéis: O Retorno do Rei (Aventura / Fantasia)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'O Senhor dos Anéis: O Retorno do Rei', 
    'Aragorn é revelado como o herdeiro dos antigos reis enquanto Gandalf e os outros membros da sociedade quebrada lutam para salvar Gondor.', 
    201,
    'https://image.tmdb.org/t/p/w780/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg'
);

-- ID 12: Pulp Fiction: Tempo de Violência (Drama / Crime)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Pulp Fiction: Tempo de Violência', 
    'As vidas de dois assassinos da máfia, um boxeador, um gângster e sua esposa, e um par de bandidos se entrelaçam em quatro histórias de violência e redenção.', 
    154,
    'https://image.tmdb.org/t/p/w780/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg'
);

-- 4. Cadastrar Sessões (Todas com 80 assentos disponíveis)

-- A Origem (ID 1)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 18:00:00', 35.50, 80, 1, 1),
('2025-11-12 21:00:00', 50.00, 80, 1, 2); 

-- Duna (ID 2)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 19:00:00', 35.50, 80, 2, 1),
('2025-11-12 20:30:00', 28.00, 80, 2, 3); 

-- Interestelar (ID 3)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 20:00:00', 48.00, 80, 3, 2); 

-- Batman (ID 4)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 17:00:00', 40.00, 80, 4, 1);

-- Avatar (ID 5)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 16:00:00', 55.00, 80, 5, 1);

-- Oppenheimer (ID 6)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 19:30:00', 45.00, 80, 6, 3);

-- Homem Aranha (ID 7)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 14:00:00', 30.00, 80, 7, 2);

-- Matrix (ID 8)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 22:00:00', 25.00, 80, 8, 3);

-- Vingadores (ID 9)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 18:30:00', 40.00, 80, 9, 1);

-- Top Gun (ID 10)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 15:00:00', 35.00, 80, 10, 2);

-- Senhor dos Anéis (ID 11)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 16:30:00', 42.00, 80, 11, 1);

-- Pulp Fiction (ID 12)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 21:30:00', 30.00, 80, 12, 3);
