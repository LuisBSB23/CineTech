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
export const adicionarItem = (reservaId: number, sessaoId: number, quantidade: number) => 
  api.put<ItemReserva>(`/reservas/${reservaId}/item`, { sessaoId, quantidade }).then(res => res.data);
export const confirmarReserva = (reservaId: number) => api.post<Reserva>(`/reservas/${reservaId}/confirmar`).then(res => res.data);