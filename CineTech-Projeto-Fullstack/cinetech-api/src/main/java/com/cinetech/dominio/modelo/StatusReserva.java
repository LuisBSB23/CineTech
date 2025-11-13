package com.cinetech.dominio.modelo;

/**
 * Enum que representa os estados possíveis de uma Reserva,
 * conforme definido no esquema do banco de dados (TB_RESERVA) [cite: 0].
 */
public enum StatusReserva {
    /**
     * A reserva foi criada ("carrinho"), mas ainda não foi confirmada.
     */
    ABERTO,
    
    /**
     * A reserva foi validada, o estoque foi baixado (RF-008) [cite: 2].
     */
    CONFIRMADO,
    
    /**
     * A reserva falhou na validação de estoque (RF-007) [cite: 2].
     */
    CANCELADO
}