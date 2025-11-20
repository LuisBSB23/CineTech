package com.cinetech.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * DTO atualizado para receber os assentos selecionados.
 */
public class AdicionarItemRequest {
    
    @NotNull(message = "O ID da sessão não pode ser nulo.")
    private Long sessaoId;
    
    @Min(value = 1, message = "A quantidade deve ser pelo menos 1.")
    private int quantidade;

    // NOVO: Lista de assentos escolhidos (ex: ["A1", "A2"])
    private List<String> assentos;

    // Getters e Setters
    public Long getSessaoId() { return sessaoId; }
    public void setSessaoId(Long sessaoId) { this.sessaoId = sessaoId; }
    
    public int getQuantidade() { return quantidade; }
    public void setQuantidade(int quantidade) { this.quantidade = quantidade; }
    
    public List<String> getAssentos() { return assentos; }
    public void setAssentos(List<String> assentos) { this.assentos = assentos; }
}