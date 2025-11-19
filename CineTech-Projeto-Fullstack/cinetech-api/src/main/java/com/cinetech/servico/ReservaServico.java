package com.cinetech.servico;

import com.cinetech.dominio.modelo.*;
import com.cinetech.dominio.repositorio.ItemReservaRepositorio;
import com.cinetech.dominio.repositorio.ReservaRepositorio;
import com.cinetech.dominio.repositorio.SessaoRepositorio;
import com.cinetech.dominio.repositorio.UsuarioRepositorio;
import com.cinetech.excecao.AssentosEsgotadosExcecao;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservaServico {

    private final ReservaRepositorio reservaRepositorio;
    private final SessaoRepositorio sessaoRepositorio;
    private final UsuarioRepositorio usuarioRepositorio;
    private final ItemReservaRepositorio itemReservaRepositorio;

    public ReservaServico(ReservaRepositorio reservaRepositorio,
                          SessaoRepositorio sessaoRepositorio,
                          UsuarioRepositorio usuarioRepositorio,
                          ItemReservaRepositorio itemReservaRepositorio) {
        this.reservaRepositorio = reservaRepositorio;
        this.sessaoRepositorio = sessaoRepositorio;
        this.usuarioRepositorio = usuarioRepositorio;
        this.itemReservaRepositorio = itemReservaRepositorio;
    }

    @Transactional
    public Reserva criarReserva(@NonNull Long usuarioId) {
        Usuario usuario = usuarioRepositorio.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        Reserva novaReserva = new Reserva();
        novaReserva.setUsuario(usuario);
        novaReserva.setStatus(StatusReserva.ABERTO);
        novaReserva.setDataHoraCriacao(LocalDateTime.now());

        return reservaRepositorio.save(novaReserva);
    }

    @Transactional
    @SuppressWarnings("null") // CORREÇÃO: Suprime alertas de nulidade na lógica de Optional/Entidades
    public ItemReserva adicionarItemAReserva(@NonNull Long reservaId, @NonNull Long sessaoId, int quantidade) {
        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero");
        }

        Reserva reserva = reservaRepositorio.findById(reservaId)
                .orElseThrow(() -> new EntityNotFoundException("Reserva não encontrada"));
        Sessao sessao = sessaoRepositorio.findById(sessaoId)
                .orElseThrow(() -> new EntityNotFoundException("Sessão não encontrada"));

        if (reserva.getStatus() != StatusReserva.ABERTO) {
            throw new IllegalStateException("Não é possível adicionar itens a uma reserva que não esteja ABERTA.");
        }
        
        Optional<ItemReserva> itemExistenteOpt = itemReservaRepositorio.findByReservaIdAndSessaoId(reservaId, sessaoId);
        
        ItemReserva itemParaSalvar;
        if (itemExistenteOpt.isPresent()) {
            itemParaSalvar = itemExistenteOpt.get();
            itemParaSalvar.setQuantidade(itemParaSalvar.getQuantidade() + quantidade);
        } else {
            itemParaSalvar = new ItemReserva();
            itemParaSalvar.setReserva(reserva);
            itemParaSalvar.setSessao(sessao);
            itemParaSalvar.setQuantidade(quantidade);
        }

        return itemReservaRepositorio.save(itemParaSalvar);
    }

    @Transactional(noRollbackFor = AssentosEsgotadosExcecao.class)
    public Reserva confirmarReserva(@NonNull Long reservaId) {
        
        Reserva reserva = reservaRepositorio.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));
        
        List<ItemReserva> itens = reserva.getItens();
        
        for (ItemReserva item : itens) {
            Sessao sessao = item.getSessao();
            
            if (sessao.getAssentosDisponiveis() < item.getQuantidade()) {
                reserva.setStatus(StatusReserva.CANCELADO);
                reservaRepositorio.save(reserva);
                
                throw new AssentosEsgotadosExcecao(
                    "Falha: Assentos esgotados para o filme '" + sessao.getFilme().getTitulo() + "'"
                );
            }
        }
        
        double valorTotalCalculado = 0.0;
        for (ItemReserva item : itens) {
            Sessao sessao = item.getSessao();
            sessao.diminuirAssentosDisponiveis(item.getQuantidade());
            sessaoRepositorio.save(sessao);
            
            valorTotalCalculado += sessao.getValorIngresso() * item.getQuantidade();
        }
        
        reserva.setStatus(StatusReserva.CONFIRMADO);
        reserva.setValorTotal(valorTotalCalculado);
        return reservaRepositorio.save(reserva);
    }
}