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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    // NOVO MÈTODO: Busca reserva aberta para o contexto do frontend
    public Optional<Reserva> buscarReservaAberta(Long usuarioId) {
        return reservaRepositorio.findByUsuarioIdAndStatus(usuarioId, StatusReserva.ABERTO);
    }

    @Transactional
    public Reserva criarReserva(@NonNull Long usuarioId) {
        // MODIFICAÇÃO: Verifica se já existe uma reserva aberta para este utilizador.
        // Se existir, retorna ela em vez de criar uma nova. Isso garante a persistência do carrinho.
        Optional<Reserva> reservaExistente = reservaRepositorio.findByUsuarioIdAndStatus(usuarioId, StatusReserva.ABERTO);
        if (reservaExistente.isPresent()) {
            return reservaExistente.get();
        }

        Usuario usuario = usuarioRepositorio.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        Reserva novaReserva = new Reserva();
        novaReserva.setUsuario(usuario);
        novaReserva.setStatus(StatusReserva.ABERTO);
        novaReserva.setDataHoraCriacao(LocalDateTime.now());

        return reservaRepositorio.save(novaReserva);
    }

    /**
     * Adiciona item e salva os assentos escolhidos.
     */
    @Transactional
    @SuppressWarnings("null")
    public ItemReserva adicionarItemAReserva(@NonNull Long reservaId, @NonNull Long sessaoId, int quantidade, List<String> assentos) {
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
        
        // Converte lista de assentos ["A1", "B2"] para String "A1,B2"
        String assentosStr = (assentos != null && !assentos.isEmpty()) ? String.join(",", assentos) : "";

        if (itemExistenteOpt.isPresent()) {
            itemParaSalvar = itemExistenteOpt.get();
            itemParaSalvar.setQuantidade(itemParaSalvar.getQuantidade() + quantidade);
            // Atualiza assentos
            if (!assentosStr.isEmpty()) {
                itemParaSalvar.setAssentos(assentosStr);
            }
        } else {
            itemParaSalvar = new ItemReserva();
            itemParaSalvar.setReserva(reserva);
            itemParaSalvar.setSessao(sessao);
            itemParaSalvar.setQuantidade(quantidade);
            itemParaSalvar.setAssentos(assentosStr);
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
                throw new AssentosEsgotadosExcecao("Falha: Assentos esgotados para o filme '" + sessao.getFilme().getTitulo() + "'");
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

    /**
     * NOVO: Retorna o Histórico de Compras (Reservas Confirmadas do Usuário)
     * CORREÇÃO: Adicionado @NonNull para evitar aviso de Null Type Safety
     */
    public List<Reserva> listarHistoricoUsuario(@NonNull Long usuarioId) {
        Usuario usuario = usuarioRepositorio.findById(usuarioId)
            .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        
        return usuario.getReservas().stream()
                .filter(r -> r.getStatus() == StatusReserva.CONFIRMADO)
                .collect(Collectors.toList());
    }

    /**
     * NOVO: Retorna lista de todos os assentos ocupados em uma sessão.
     * CORREÇÃO: Adicionado @NonNull para evitar aviso de Null Type Safety
     */
    public List<String> listarAssentosOcupados(@NonNull Long sessaoId) {
        List<ItemReserva> itensConfirmados = itemReservaRepositorio.findBySessaoIdAndReservaStatus(sessaoId, StatusReserva.CONFIRMADO);
        
        List<String> todosAssentos = new ArrayList<>();
        for (ItemReserva item : itensConfirmados) {
            if (item.getAssentos() != null && !item.getAssentos().isEmpty()) {
                String[] assentos = item.getAssentos().split(",");
                todosAssentos.addAll(Arrays.asList(assentos));
            }
        }
        return todosAssentos;
    }
}