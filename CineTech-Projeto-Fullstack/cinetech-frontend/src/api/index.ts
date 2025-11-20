import axios from 'axios';
import type { Filme, Sessao, Reserva, ItemReserva } from '../types'; // Correção: 'import type'

const API_BASE_URL = 'http://localhost:8080/api';

// Instância do Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// --- MOCK DATA (Para fallback se o backend estiver offline) ---
const MOCK_FILMES = [
  { id: 1, titulo: "A Origem", sinopse: "Dom Cobb é um ladrão capaz de extrair informações...", duracaoMinutos: 148 },
  { id: 2, titulo: "Duna: Parte Dois", sinopse: "Paul Atreides se une aos Fremen...", duracaoMinutos: 166 },
  { id: 3, titulo: "Interestelar", sinopse: "As reservas naturais da Terra estão chegando ao fim...", duracaoMinutos: 169 },
];

const MOCK_SESSOES = [
  { id: 101, dataHora: "2025-11-12T18:00:00", valorIngresso: 35.50, assentosDisponiveis: 120, filme: MOCK_FILMES[0], sala: { id: 1, nome: "Sala IMAX" } },
  { id: 102, dataHora: "2025-11-12T21:00:00", valorIngresso: 45.00, assentosDisponiveis: 0, filme: MOCK_FILMES[0], sala: { id: 2, nome: "Sala VIP" } }
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