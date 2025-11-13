package com.cinetech.api.dto;

import jakarta.validation.constraints.Min; // IMPORTAÇÃO ADICIONADA
import jakarta.validation.constraints.NotNull; // IMPORTAÇÃO ADICIONADA

/**
 * DTO (Data Transfer Object) para receber a solicitação
 * de adição de item (PUT /api/reservas/{id}/item).
 * Implementa o RF-004.
 */
public class AdicionarItemRequest {
    
    @NotNull(message = "O ID da sessão (sessaoId) não pode ser nulo.") // ANOTAÇÃO ADICIONADA
    private Long sessaoId;
    
    @Min(value = 1, message = "A quantidade deve ser pelo menos 1.") // ANOTAÇÃO ADICIONADA
    private int quantidade;

    // Getters e Setters
    public Long getSessaoId() {
        return sessaoId;
    }
    public void setSessaoId(Long sessaoId) {
        this.sessaoId = sessaoId;
    }
    public int getQuantidade() {
        return quantidade;
    }
    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }
}