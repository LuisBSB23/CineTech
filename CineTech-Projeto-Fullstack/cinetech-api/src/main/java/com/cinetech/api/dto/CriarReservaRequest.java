package com.cinetech.api.dto;

import jakarta.validation.constraints.NotNull; // IMPORTAÇÃO ADICIONADA

/**
 * DTO (Data Transfer Object) para receber a solicitação
 * de criação de uma nova reserva (POST /api/reservas).
 */
public class CriarReservaRequest {
    
    @NotNull(message = "O ID do usuário (usuarioId) não pode ser nulo.") // ANOTAÇÃO ADICIONADA
    private Long usuarioId;

    // Getters e Setters
    public Long getUsuarioId() {
        return usuarioId;
    }
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}