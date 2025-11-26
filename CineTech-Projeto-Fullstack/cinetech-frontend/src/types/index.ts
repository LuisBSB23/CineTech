export interface Filme {
  id: number;
  titulo: string;
  sinopse: string;
  duracaoMinutos: number;
  imagemUrl: string;
  generos: string; // Novo campo
}

export interface Sala {
  id: number;
  nome: string;
  capacidadeTotal: number;
}

export interface Sessao {
  id: number;
  dataHora: string;
  valorIngresso: number;
  assentosDisponiveis: number;
  filme: Filme;
  sala: Sala;
}

export interface ItemReserva {
  id: number;
  quantidade: number;
  sessao: Sessao;
  assentos?: string; 
  selectedSeats?: string[]; 
}

export interface Reserva {
  id: number;
  dataHoraCriacao: string;
  status: 'ABERTO' | 'CONFIRMADO' | 'CANCELADO';
  valorTotal: number;
  itens: ItemReserva[];
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: 'USER' | 'ADMIN';
  senha?: string; 
}

export interface Cartao {
  id: number;
  tipo: 'CREDITO' | 'DEBITO';
  numero: string;
  nomeTitular: string;
  validade: string;
  cvv: string;
}