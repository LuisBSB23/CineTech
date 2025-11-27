package com.cinetech.api.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class CriarSessaoRequest {

    @NotNull
    private LocalDateTime dataHora;

    @NotNull
    private Double valorIngresso;

    @NotNull
    private Long salaId;

    // Getters e Setters
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public Double getValorIngresso() { return valorIngresso; }
    public void setValorIngresso(Double valorIngresso) { this.valorIngresso = valorIngresso; }

    public Long getSalaId() { return salaId; }
    public void setSalaId(Long salaId) { this.salaId = salaId; }
}