export interface Filme {
  id: number;
  titulo: string;
  sinopse: string;
  duracaoMinutos: number;
  imagemUrl: string;
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
  // Backend pode retornar string "A1,A2" ou null
  assentos?: string; 
  // Frontend usa este array
  selectedSeats?: string[]; 
}

export interface Reserva {
  id: number;
  dataHoraCriacao: string;
  status: 'ABERTO' | 'CONFIRMADO' | 'CANCELADO';
  valorTotal: number;
  itens: ItemReserva[];
}