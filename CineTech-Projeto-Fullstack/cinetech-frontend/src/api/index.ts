import axios from 'axios';
import type { Filme, Sessao, Reserva, ItemReserva } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const getFilmes = () => api.get<Filme[]>('/filmes').then(res => res.data);
export const getSessoes = (filmeId: number) => api.get<Sessao[]>(`/filmes/${filmeId}/sessoes`).then(res => res.data);
export const criarReserva = (usuarioId: number) => api.post<Reserva>('/reservas', { usuarioId }).then(res => res.data);

// Modificado para enviar 'assentos'
export const adicionarItem = (reservaId: number, sessaoId: number, quantidade: number, assentos: string[]) => 
  api.put<ItemReserva>(`/reservas/${reservaId}/item`, { sessaoId, quantidade, assentos }).then(res => res.data);

export const confirmarReserva = (reservaId: number) => api.post<Reserva>(`/reservas/${reservaId}/confirmar`).then(res => res.data);

// Novos métodos
export const getHistorico = (usuarioId: number) => api.get<Reserva[]>(`/reservas/usuario/${usuarioId}/historico`).then(res => res.data);
export const getAssentosOcupados = (sessaoId: number) => api.get<string[]>(`/reservas/sessao/${sessaoId}/ocupados`).then(res => res.data);