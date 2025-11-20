package com.cinetech.api;

import com.cinetech.api.dto.AdicionarItemRequest;
import com.cinetech.api.dto.CriarReservaRequest;
import com.cinetech.dominio.modelo.ItemReserva;
import com.cinetech.dominio.modelo.Reserva;
import com.cinetech.excecao.AssentosEsgotadosExcecao;
import com.cinetech.servico.ReservaServico;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaControlador {

    private final ReservaServico reservaServico;

    public ReservaControlador(ReservaServico reservaServico) {
        this.reservaServico = reservaServico;
    }

    @PostMapping
    @SuppressWarnings("null")
    public ResponseEntity<?> criarNovaReserva(@Valid @RequestBody @NonNull CriarReservaRequest request) {
        try {
            Reserva novaReserva = reservaServico.criarReserva(request.getUsuarioId());
            return ResponseEntity.status(201).body(novaReserva);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/item")
    @SuppressWarnings("null")
    public ResponseEntity<?> adicionarItem(@PathVariable @NonNull Long id, @Valid @RequestBody @NonNull AdicionarItemRequest request) {
        try {
            ItemReserva item = reservaServico.adicionarItemAReserva(
                id, 
                request.getSessaoId(), 
                request.getQuantidade(),
                request.getAssentos() // Agora passamos a lista de assentos
            );
            return ResponseEntity.ok(item);
        } catch (EntityNotFoundException | IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/confirmar")
    @SuppressWarnings("null")
    public ResponseEntity<?> confirmarReserva(@PathVariable @NonNull Long id) {
        try {
            Reserva reservaConfirmada = reservaServico.confirmarReserva(id);
            return ResponseEntity.ok(reservaConfirmada); 
        } catch (AssentosEsgotadosExcecao e) {
            return ResponseEntity.badRequest().body(e.getMessage()); 
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno no servidor: " + e.getMessage());
        }
    }

    // ENDPOINT HISTÓRICO
    // CORREÇÃO: Adicionado @NonNull para garantir segurança de tipo ao chamar o serviço
    @GetMapping("/usuario/{usuarioId}/historico")
    public List<Reserva> getHistorico(@PathVariable @NonNull Long usuarioId) {
        return reservaServico.listarHistoricoUsuario(usuarioId);
    }

    // NOVO ENDPOINT: Recuperar Reserva Aberta (Carrinho)
    @GetMapping("/usuario/{usuarioId}/aberta")
    public ResponseEntity<?> getReservaAberta(@PathVariable @NonNull Long usuarioId) {
        return reservaServico.buscarReservaAberta(usuarioId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ENDPOINT ASSENTOS OCUPADOS
    // CORREÇÃO: Adicionado @NonNull para garantir segurança de tipo ao chamar o serviço
    @GetMapping("/sessao/{sessaoId}/ocupados")
    public List<String> getAssentosOcupados(@PathVariable @NonNull Long sessaoId) {
        return reservaServico.listarAssentosOcupados(sessaoId);
    }
}