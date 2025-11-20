/**
 * Script SQL para popular o banco de dados H2/MySQL ao iniciar.
 * Atualizado com senha e perfil.
 */

-- 1. Cadastrar Usuários (Senha padrão '123456')
-- Admin
INSERT INTO TB_USUARIO (nome, email, senha, perfil) VALUES ('Admin CineTech', 'admin@cinetech.com', 'admin123', 'ADMIN');

-- Usuários Comuns
INSERT INTO TB_USUARIO (nome, email, senha, perfil) VALUES ('Ana Silva', 'ana@email.com', '123456', 'USER');
INSERT INTO TB_USUARIO (nome, email, senha, perfil) VALUES ('Carlos Souza', 'carlos@email.com', '123456', 'USER');

-- 2. Cadastrar Salas
INSERT INTO TB_SALA (nome, capacidade_total) VALUES ('Sala 1 - IMAX', 80);
INSERT INTO TB_SALA (nome, capacidade_total) VALUES ('Sala 2 - VIP', 80);
INSERT INTO TB_SALA (nome, capacidade_total) VALUES ('Sala 3 - Padrão', 80);

-- 3. Cadastrar Filmes
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'A Origem', 
    'Dom Cobb é um ladrão habilidoso, o melhor na perigosa arte da extração, roubando segredos valiosos do fundo do subconsciente durante o estado de sonho.', 
    148,
    'https://image.tmdb.org/t/p/w780/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
);

INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Duna: Parte Dois', 
    'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família.', 
    166,
    'https://image.tmdb.org/t/p/w780/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg'
);

INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Interestelar', 
    'Um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial.', 
    169,
    'https://images.justwatch.com/poster/312160153/s718/interestelar.jpg'
);

INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Batman', 
    'Bruce Wayne atua como o vigilante de Gotham City há dois anos e isso o leva às sombras da cidade.', 
    176,
    'https://br.web.img3.acsta.net/pictures/22/03/02/19/26/3666027.jpg'
);

INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Avatar: O Caminho da Água', 
    'Jake Sully vive com sua nova família no planeta Pandora. Uma ameaça familiar retorna para acabar com o que foi iniciado anteriormente.', 
    192,
    'https://upload.wikimedia.org/wikipedia/pt/5/54/Avatar_The_Way_of_Water_poster.jpg'
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
    'https://br.web.img2.acsta.net/medias/nmedia/18/91/08/82/20128877.JPG'
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
    'https://upload.wikimedia.org/wikipedia/pt/d/d2/Top_Gun_Maverick.jpg'
);

INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'O Senhor dos Anéis: O Retorno do Rei', 
    'Aragorn é revelado como o herdeiro dos antigos reis enquanto Gandalf e os outros membros da sociedade quebrada lutam para salvar Gondor.', 
    201,
    'https://image.tmdb.org/t/p/w780/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg'
);

INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Pulp Fiction: Tempo de Violência', 
    'As vidas de dois assassinos da máfia, um boxeador, um gângster e sua esposa, e um par de bandidos se entrelaçam em quatro histórias de violência e redenção.', 
    154,
    'https://image.tmdb.org/t/p/w780/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg'
);

-- 4. Cadastrar Sessões
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 18:00:00', 35.50, 80, 1, 1),
('2025-11-12 21:00:00', 50.00, 80, 1, 2),
('2025-11-12 19:00:00', 35.50, 80, 2, 1),
('2025-11-12 20:30:00', 28.00, 80, 2, 3),
('2025-11-12 20:00:00', 48.00, 80, 3, 2),
('2025-11-12 17:00:00', 40.00, 80, 4, 1),
('2025-11-12 16:00:00', 55.00, 80, 5, 1),
('2025-11-12 19:30:00', 45.00, 80, 6, 3),
('2025-11-12 14:00:00', 30.00, 80, 7, 2),
('2025-11-12 22:00:00', 25.00, 80, 8, 3),
('2025-11-12 18:30:00', 40.00, 80, 9, 1),
('2025-11-12 15:00:00', 35.00, 80, 10, 2),
('2025-11-12 16:30:00', 42.00, 80, 11, 1),
('2025-11-12 21:30:00', 30.00, 80, 12, 3);