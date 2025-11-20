/**
 * Script SQL para popular o banco de dados H2/MySQL ao iniciar.
 */

-- 1. Cadastrar Usuários
INSERT INTO TB_USUARIO (nome, email) VALUES ('Ana Silva', 'ana@email.com');
INSERT INTO TB_USUARIO (nome, email) VALUES ('Carlos Souza', 'carlos@email.com');

-- 2. Cadastrar Salas
INSERT INTO TB_SALA (nome, capacidade_total) VALUES ('Sala 1 - IMAX', 200);
INSERT INTO TB_SALA (nome, capacidade_total) VALUES ('Sala 2 - VIP', 50);
INSERT INTO TB_SALA (nome, capacidade_total) VALUES ('Sala 3 - Padrão', 100);

-- 3. Cadastrar Filmes
-- A Origem
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'A Origem', 
    'Dom Cobb é um ladrão habilidoso, o melhor na perigosa arte da extração, roubando segredos valiosos do fundo do subconsciente durante o estado de sonho, quando a mente está mais vulnerável. Sua habilidade rara fez dele um jogador cobiçado neste novo mundo traiçoeiro de espionagem corporativa, mas também o transformou em um fugitivo internacional e custou-lhe tudo o que ele já amou. Agora, Cobb tem uma chance de redenção.', 
    148,
    'https://image.tmdb.org/t/p/w780/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
);

-- Duna: Parte Dois
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Duna: Parte Dois', 
    'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família. Enfrentando uma escolha entre o amor de sua vida e o destino do universo conhecido, ele se esforça para evitar um futuro terrível que só ele pode prever. A saga continua enquanto Paul deve enfrentar o Imperador e as casas nobres que o traíram.', 
    166,
    'https://image.tmdb.org/t/p/w780/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg'
);

-- Interestelar (URL Atualizada para w780)
INSERT INTO TB_FILME (titulo, sinopse, duracao_minutos, imagem_url) VALUES (
    'Interestelar', 
    'As reservas naturais da Terra estão chegando ao fim. Um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial, possibilitando a continuação da espécie. Cooper é chamado para liderar o grupo e aceita a missão sabendo que pode nunca mais ver os filhos. Ao lado da marca Brand, Jenkins e Doyle, ele seguirá em busca de uma nova casa para a humanidade.', 
    169,
    'https://www.themoviedb.org/movie/301959-interstellar-nolan-s-odyssey#'
);

-- 4. Cadastrar Sessões
-- A Origem (ID 1)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 18:00:00', 35.50, 200, 1, 1); 
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 21:00:00', 50.00, 50, 1, 2); 

-- Duna (ID 2)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 19:00:00', 35.50, 150, 2, 1); 
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 20:30:00', 28.00, 100, 2, 3); 

-- Interestelar (ID 3)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 20:00:00', 48.00, 45, 3, 2); 

-- Sessão com estoque baixo (Interestelar)
INSERT INTO TB_SESSAO (data_hora, valor_ingresso, assentos_disponiveis, filme_id, sala_id) VALUES
('2025-11-12 22:00:00', 28.00, 3, 3, 3);