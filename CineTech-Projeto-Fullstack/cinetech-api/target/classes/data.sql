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

-- 3. Cadastrar Filmes (Imagens corrigidas e novos filmes)

-- A Origem (ID 1)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'A Origem', 
    'Dom Cobb é um ladrão habilidoso, o melhor na perigosa arte da extração, roubando segredos valiosos do fundo do subconsciente durante o estado de sonho.', 
    148,
    'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
);

-- Duna: Parte Dois (ID 2)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Duna: Parte Dois', 
    'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família.', 
    166,
    'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg'
);

-- Interestelar (ID 3) - Imagem Atualizada
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Interestelar', 
    'Um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial.', 
    169,
    'https://images.squarespace-cdn.com/content/v1/58b866f417bffc4dc469acab/1600748704866-I46WK7H3IX9W985PBHXJ/critica+interestelar+Christopher+nolan'
);

-- Batman (ID 4) - Imagem Atualizada
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Batman', 
    'Bruce Wayne atua como o vigilante de Gotham City há dois anos e isso o leva às sombras da cidade.', 
    176,
    'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg'
);

-- Avatar: O Caminho da Água (ID 5) - Imagem Atualizada
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Avatar: O Caminho da Água', 
    'Jake Sully vive com sua nova família no planeta Pandora. Uma ameaça familiar retorna para acabar com o que foi iniciado anteriormente.', 
    192,
    'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg'
);

-- Oppenheimer (ID 6)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Oppenheimer', 
    'A história do físico americano J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.', 
    180,
    'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
);

-- Homem-Aranha: Através do Aranhaverso (ID 7)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Homem-Aranha: Através do Aranhaverso', 
    'Miles Morales é catapultado através do Multiverso, onde ele encontra uma equipe de Pessoas-Aranha encarregada de proteger a própria existência.', 
    140,
    'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg'
);

-- Matrix (ID 8) - Imagem Atualizada
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Matrix', 
    'Um hacker aprende com rebeldes misteriosos sobre a verdadeira natureza de sua realidade e seu papel na guerra contra seus controladores.', 
    136,
    'https://br.web.img2.acsta.net/medias/nmedia/18/91/08/82/20128877.JPG'
);

-- Vingadores: Ultimato (ID 9)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Vingadores: Ultimato', 
    'Após os eventos devastadores de Guerra Infinita, o universo está em ruínas. Com a ajuda dos aliados restantes, os Vingadores se reúnem.', 
    181,
    'https://image.tmdb.org/t/p/w500/q6725aR8Zs4IwGMXzZT8aC8lh41.jpg'
);

-- Top Gun: Maverick (ID 10)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Top Gun: Maverick', 
    'Depois de mais de 30 anos de serviço como um dos principais aviadores da Marinha, Pete "Maverick" Mitchell está de volta.', 
    131,
    'https://upload.wikimedia.org/wikipedia/pt/d/d2/Top_Gun_Maverick.jpg'
);

-- NOVO FILME 1 (ID 11)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'O Senhor dos Anéis: O Retorno do Rei', 
    'Aragorn é revelado como o herdeiro dos antigos reis enquanto Gandalf e os outros membros da sociedade quebrada lutam para salvar Gondor.', 
    201,
    'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg'
);

-- NOVO FILME 2 (ID 12)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Pulp Fiction: Tempo de Violência', 
    'As vidas de dois assassinos da máfia, um boxeador, um gângster e sua esposa, e um par de bandidos se entrelaçam em quatro histórias de violência e redenção.', 
    154,
    'https://play-lh.googleusercontent.com/waexhVm8O8o0BbP012ZQ4NsobPF6XVLhGyXm_fwYv4jRlwtRrtStUvOF3b6ZwooaOXFtqQ'
);

-- 4. Cadastrar Sessões (Ajustadas para refletir os assentos ocupados inseridos abaixo)

-- A Origem (ID 1): Capacidade 80, Ocupados 0 -> Disp 80
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 18:00:00', 35.50, 80, 1, 1);

-- A Origem (ID 2): Capacidade 80, Ocupados 2 (A1, A2) -> Disp 78
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 21:00:00', 50.00, 78, 1, 2); 

-- Duna (ID 3): Capacidade 80, Ocupados 4 (D4, D5, D6, D7) -> Disp 76
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 19:00:00', 35.50, 76, 2, 1);

-- Duna (ID 4): Disp 40
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 20:30:00', 28.00, 40, 2, 3); 

-- Interestelar (ID 5): Capacidade 80, Ocupados 3 (F1, F2, F3) -> Disp 77
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 20:00:00', 48.00, 77, 3, 2); 

-- Batman (ID 6): Disp 80
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 17:00:00', 40.00, 80, 4, 1);

-- Avatar (ID 7): Disp 75
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 16:00:00', 55.00, 75, 5, 1);

-- Oppenheimer (ID 8): Disp 5
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 19:30:00', 45.00, 5, 6, 3);

-- Homem Aranha (ID 9): Disp 80
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 14:00:00', 30.00, 80, 7, 2);

-- Matrix (ID 10): Disp 80
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 22:00:00', 25.00, 80, 8, 3);

-- Vingadores (ID 11): Sessão Esgotada (0 Disp)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 18:30:00', 40.00, 0, 9, 1);

-- Top Gun (ID 12): Disp 75 (Ocupados G8, G9, G10, H8, H9)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 15:00:00', 35.00, 75, 10, 2);

-- Senhor dos Anéis (ID 13): Disp 80
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 16:30:00', 42.00, 80, 11, 1);

-- Pulp Fiction (ID 14): Disp 78 (Ocupados C3, C4)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 21:30:00', 30.00, 78, 12, 3);


-- 5. Criar Reservas Confirmadas (Para gerar histórico e ocupação)

-- Reserva 1: Ana Silva (Usuario 1) - A Origem (Sessao 2)
INSERT INTO TB_RESERVA (data_hora_criacao, status, valor_total, usuario_id) VALUES
(NOW(), 'CONFIRMADO', 100.00, 1);

-- Reserva 2: Carlos Souza (Usuario 2) - Duna (Sessao 3)
INSERT INTO TB_RESERVA (data_hora_criacao, status, valor_total, usuario_id) VALUES
(NOW(), 'CONFIRMADO', 142.00, 2);

-- Reserva 3: Ana Silva (Usuario 1) - Interestelar (Sessao 5)
INSERT INTO TB_RESERVA (data_hora_criacao, status, valor_total, usuario_id) VALUES
(NOW(), 'CONFIRMADO', 144.00, 1);

-- Reserva 4: Carlos Souza (Usuario 2) - Pulp Fiction (Sessao 14)
INSERT INTO TB_RESERVA (data_hora_criacao, status, valor_total, usuario_id) VALUES
(NOW(), 'CONFIRMADO', 60.00, 2);

-- Reserva 5: Ana Silva (Usuario 1) - Top Gun (Sessao 12)
INSERT INTO TB_RESERVA (data_hora_criacao, status, valor_total, usuario_id) VALUES
(NOW(), 'CONFIRMADO', 175.00, 1);


-- 6. Itens de Reserva (Assentos Ocupados vinculados às reservas e sessões)

-- Item da Reserva 1 (A Origem - Sessao 2) - 2 Assentos
INSERT INTO TB_ITEM_RESERVA (quantidade, assentos, reserva_id, sessao_id) VALUES
(2, 'A1,A2', 1, 2);

-- Item da Reserva 2 (Duna - Sessao 3) - 4 Assentos
INSERT INTO TB_ITEM_RESERVA (quantidade, assentos, reserva_id, sessao_id) VALUES
(4, 'D4,D5,D6,D7', 2, 3);

-- Item da Reserva 3 (Interestelar - Sessao 5) - 3 Assentos
INSERT INTO TB_ITEM_RESERVA (quantidade, assentos, reserva_id, sessao_id) VALUES
(3, 'F1,F2,F3', 3, 5);

-- Item da Reserva 4 (Pulp Fiction - Sessao 14) - 2 Assentos
INSERT INTO TB_ITEM_RESERVA (quantidade, assentos, reserva_id, sessao_id) VALUES
(2, 'C3,C4', 4, 14);

-- Item da Reserva 5 (Top Gun - Sessao 12) - 5 Assentos
INSERT INTO TB_ITEM_RESERVA (quantidade, assentos, reserva_id, sessao_id) VALUES
(5, 'G8,G9,G10,H8,H9', 5, 12);