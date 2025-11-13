package com.cinetech.api;

import com.cinetech.api.dto.AdicionarItemRequest;
import com.cinetech.api.dto.CriarReservaRequest;
import com.cinetech.dominio.modelo.ItemReserva;
import com.cinetech.dominio.modelo.Reserva;
import com.cinetech.excecao.AssentosEsgotadosExcecao;
import com.cinetech.servico.ReservaServico;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid; // IMPORTAÇÃO ADICIONADA
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservas")
public class ReservaControlador {

    private final ReservaServico reservaServico;

    public ReservaControlador(ReservaServico reservaServico) {
        this.reservaServico = reservaServico;
    }

    /**
     * NOVO ENDPOINT
     * Endpoint: POST /api/reservas
     * Cria uma nova reserva (carrinho).
     */
    @PostMapping
    public ResponseEntity<?> criarNovaReserva(@Valid @RequestBody @NonNull CriarReservaRequest request) { // @Valid ADICIONADO
        try {
            Reserva novaReserva = reservaServico.criarReserva(request.getUsuarioId());
            return ResponseEntity.status(201).body(novaReserva);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * NOVO ENDPOINT
     * Endpoint: PUT /api/reservas/{id}/item
     * Adiciona/atualiza ingressos na reserva (RF-004).
     */
    @PutMapping("/{id}/item")
    public ResponseEntity<?> adicionarItem(@PathVariable @NonNull Long id, @Valid @RequestBody @NonNull AdicionarItemRequest request) { // @Valid ADICIONADO
        try {
            ItemReserva item = reservaServico.adicionarItemAReserva(
                id, 
                request.getSessaoId(), 
                request.getQuantidade()
            );
            return ResponseEntity.ok(item);
        } catch (EntityNotFoundException | IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * (Código existente)
     * Endpoint: POST /api/reservas/{id}/confirmar
     * Endpoint crítico (RF-005).
     */
    @PostMapping("/{id}/confirmar")
    public ResponseEntity<?> confirmarReserva(@PathVariable @NonNull Long id) {
        try {
            Reserva reservaConfirmada = reservaServico.confirmarReserva(id);
            // Cenário Sucesso (RF-008)
            return ResponseEntity.ok(reservaConfirmada); 
            
        } catch (AssentosEsgotadosExcecao e) {
            // Cenário Falha (RF-007)
            return ResponseEntity.badRequest().body(e.getMessage()); 
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno no servidor: " + e.getMessage());
        }
    }
}