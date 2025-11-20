import axios from 'axios';
import type { Filme, Sessao, Reserva, ItemReserva } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

// Instância do Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// --- MOCK DATA (Para fallback se o backend estiver offline) ---
const MOCK_FILMES: Filme[] = [
  { 
    id: 1, 
    titulo: "A Origem", 
    sinopse: "Dom Cobb é um ladrão habilidoso, o melhor na perigosa arte da extração, roubando segredos valiosos do fundo do subconsciente durante o estado de sonho, quando a mente está mais vulnerável. Sua habilidade rara fez dele um jogador cobiçado neste novo mundo traiçoeiro de espionagem corporativa, mas também o transformou em um fugitivo internacional e custou-lhe tudo o que ele já amou. Agora, Cobb tem uma chance de redenção.", 
    duracaoMinutos: 148,
    imagemUrl: "https://image.tmdb.org/t/p/w780/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
  },
  { 
    id: 2, 
    titulo: "Duna: Parte Dois", 
    sinopse: "Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família. Enfrentando uma escolha entre o amor de sua vida e o destino do universo conhecido, ele se esforça para evitar um futuro terrível que só ele pode prever. A saga continua enquanto Paul deve enfrentar o Imperador e as casas nobres que o traíram.", 
    duracaoMinutos: 166,
    imagemUrl: "https://image.tmdb.org/t/p/w780/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg"
  },
  { 
    id: 3, 
    titulo: "Interestelar", 
    sinopse: "As reservas naturais da Terra estão chegando ao fim. Um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial, possibilitando a continuação da espécie. Cooper é chamado para liderar o grupo e aceita a missão sabendo que pode nunca mais ver os filhos. Ao lado da marca Brand, Jenkins e Doyle, ele seguirá em busca de uma nova casa para a humanidade.", 
    duracaoMinutos: 169,
    imagemUrl: "https://www.themoviedb.org/movie/301959-interstellar-nolan-s-odyssey#"
  },
];

const MOCK_SESSOES = [
  { id: 101, dataHora: "2025-11-12T18:00:00", valorIngresso: 35.50, assentosDisponiveis: 120, filme: MOCK_FILMES[0], sala: { id: 1, nome: "Sala IMAX", capacidadeTotal: 200 } },
  { id: 102, dataHora: "2025-11-12T21:00:00", valorIngresso: 45.00, assentosDisponiveis: 0, filme: MOCK_FILMES[0], sala: { id: 2, nome: "Sala VIP", capacidadeTotal: 50 } }
];

// Interceptor para tratar erros e usar Mock se necessário
api.interceptors.response.use(
  response => response,
  error => {
    console.warn("API Error (usando Mock se possível):", error.message);
    
    // Simulação de Rotas para Demo Visual
    if (error.config.url === '/filmes' && error.config.method === 'get') {
      return { data: MOCK_FILMES };
    }
    if (error.config.url?.includes('/sessoes') && error.config.method === 'get') {
      return { data: MOCK_SESSOES.map(s => ({...s, filme: MOCK_FILMES[0]})) };
    }
    if (error.config.url === '/reservas' && error.config.method === 'post') {
      return { data: { id: Date.now(), status: 'ABERTO', valorTotal: 0, itens: [] } };
    }
    if (error.config.url?.includes('/item') && error.config.method === 'put') {
      const { quantidade } = JSON.parse(error.config.data);
      return { data: { id: Date.now(), quantidade, sessao: MOCK_SESSOES[0] } };
    }
    if (error.config.url?.includes('/confirmar')) {
      return { data: { status: 'CONFIRMADO' } };
    }

    return Promise.reject(error);
  }
);

export const getFilmes = () => api.get<Filme[]>('/filmes').then(res => res.data);
export const getSessoes = (filmeId: number) => api.get<Sessao[]>(`/filmes/${filmeId}/sessoes`).then(res => res.data);
export const criarReserva = (usuarioId: number) => api.post<Reserva>('/reservas', { usuarioId }).then(res => res.data);
export const adicionarItem = (reservaId: number, sessaoId: number, quantidade: number) => 
  api.put<ItemReserva>(`/reservas/${reservaId}/item`, { sessaoId, quantidade }).then(res => res.data);
export const confirmarReserva = (reservaId: number) => api.post<Reserva>(`/reservas/${reservaId}/confirmar`).then(res => res.data);