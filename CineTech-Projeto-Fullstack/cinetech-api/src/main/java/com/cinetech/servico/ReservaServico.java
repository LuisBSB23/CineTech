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
import java.util.Objects;
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

    public Optional<Reserva> buscarReservaAberta(Long usuarioId) {
        return reservaRepositorio.findByUsuarioIdAndStatus(usuarioId, StatusReserva.ABERTO);
    }

    @Transactional
    public Reserva criarReserva(@NonNull Long usuarioId) {
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
        
        String novosAssentosStr = (assentos != null && !assentos.isEmpty()) ? String.join(",", assentos) : "";

        if (itemExistenteOpt.isPresent()) {
            itemParaSalvar = itemExistenteOpt.get();
            itemParaSalvar.setQuantidade(itemParaSalvar.getQuantidade() + quantidade);
            
            if (!novosAssentosStr.isEmpty()) {
                String assentosAntigos = itemParaSalvar.getAssentos();
                if (assentosAntigos != null && !assentosAntigos.isEmpty()) {
                    // Evita duplicar assentos se já existirem na string
                    List<String> listaAntiga = new ArrayList<>(Arrays.asList(assentosAntigos.split(",")));
                    List<String> listaNova = Arrays.asList(novosAssentosStr.split(","));
                    
                    for(String s : listaNova) {
                        if(!listaAntiga.contains(s)) {
                            listaAntiga.add(s);
                        }
                    }
                    itemParaSalvar.setAssentos(String.join(",", listaAntiga));
                } else {
                    itemParaSalvar.setAssentos(novosAssentosStr);
                }
            }
        } else {
            itemParaSalvar = new ItemReserva();
            itemParaSalvar.setReserva(reserva);
            itemParaSalvar.setSessao(sessao);
            itemParaSalvar.setQuantidade(quantidade);
            itemParaSalvar.setAssentos(novosAssentosStr);
        }

        return itemReservaRepositorio.save(itemParaSalvar);
    }

    @Transactional
    public ItemReserva atualizarItemReserva(@NonNull Long itemId, int novaQuantidade, List<String> novosAssentos) {
        ItemReserva item = itemReservaRepositorio.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item não encontrado"));

        if (item.getReserva().getStatus() != StatusReserva.ABERTO) {
            throw new IllegalStateException("Só é possível modificar itens de reservas abertas.");
        }

        if (novaQuantidade <= 0) {
            itemReservaRepositorio.delete(item);
            return null;
        }

        item.setQuantidade(novaQuantidade);
        item.setAssentos((novosAssentos != null && !novosAssentos.isEmpty()) ? String.join(",", novosAssentos) : "");
        
        return itemReservaRepositorio.save(item);
    }

    @Transactional
    public void removerItem(@NonNull Long itemId) {
        ItemReserva item = itemReservaRepositorio.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item não encontrado"));
        
        if (item.getReserva().getStatus() != StatusReserva.ABERTO) {
            throw new IllegalStateException("Só é possível remover itens de reservas abertas.");
        }
        itemReservaRepositorio.delete(item);
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

            if (item.getAssentos() != null && !item.getAssentos().isEmpty()) {
                List<String> assentosSolicitados = Arrays.asList(item.getAssentos().split(","));
                List<String> assentosOcupadosNoBanco = listarAssentosOcupados(Objects.requireNonNull(sessao.getId()));
                
                for (String assento : assentosSolicitados) {
                    if (assentosOcupadosNoBanco.contains(assento)) {
                        reserva.setStatus(StatusReserva.CANCELADO);
                        reservaRepositorio.save(reserva);
                        throw new AssentosEsgotadosExcecao("Infelizmente o assento " + assento + " acabou de ser comprado por outro usuário. O pedido foi cancelado.");
                    }
                }
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

    // ATUALIZADO: Permite cancelar CONFIRMADO (devolvendo assentos) e ABERTO
    @Transactional
    public void cancelarReserva(@NonNull Long reservaId) {
        Reserva reserva = reservaRepositorio.findById(reservaId)
                .orElseThrow(() -> new EntityNotFoundException("Reserva não encontrada"));
        
        if (reserva.getStatus() == StatusReserva.ABERTO) {
            // Se for apenas carrinho, marca como cancelado (ou deleta se preferir limpar o banco)
            reserva.setStatus(StatusReserva.CANCELADO);
            reservaRepositorio.save(reserva);
        } else if (reserva.getStatus() == StatusReserva.CONFIRMADO) {
            // Se for confirmada, precisamos DEVOLVER os assentos ao estoque
            for (ItemReserva item : reserva.getItens()) {
                Sessao sessao = item.getSessao();
                // Devolve a quantidade
                sessao.setAssentosDisponiveis(sessao.getAssentosDisponiveis() + item.getQuantidade());
                sessaoRepositorio.save(sessao);
            }
            reserva.setStatus(StatusReserva.CANCELADO);
            reservaRepositorio.save(reserva);
        } else {
             throw new IllegalStateException("Reserva já está cancelada.");
        }
    }

    // CORRIGIDO: Lógica para evitar erro 500 na exclusão de conta
    @Transactional
    public void gerenciarExclusaoUsuario(@NonNull Long usuarioId) {
        Usuario usuario = usuarioRepositorio.findById(usuarioId)
            .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        List<Reserva> reservas = usuario.getReservas();
        
        // Usar uma lista separada para evitar ConcurrentModificationException
        List<Reserva> reservasParaProcessar = new ArrayList<>(reservas);

        for (Reserva r : reservasParaProcessar) {
            if (r.getStatus() == StatusReserva.ABERTO) {
                r.setStatus(StatusReserva.CANCELADO);
                reservaRepositorio.save(r);
            } else if (r.getStatus() == StatusReserva.CONFIRMADO) {
                // Restaurar assentos antes de deletar
                for (ItemReserva item : r.getItens()) {
                    Sessao sessao = item.getSessao();
                    sessao.setAssentosDisponiveis(sessao.getAssentosDisponiveis() + item.getQuantidade());
                    sessaoRepositorio.save(sessao);
                }
                // Deleta a reserva (CascadeType.REMOVE cuidará dos itens)
                reservaRepositorio.delete(r);
            }
        }
        
        // CRÍTICO: Limpar a lista do objeto usuário em memória para o Hibernate não tentar salvar referências deletadas
        usuario.getReservas().clear();
        usuarioRepositorio.save(usuario);
    }

    public List<Reserva> listarHistoricoUsuario(@NonNull Long usuarioId) {
        Usuario usuario = usuarioRepositorio.findById(usuarioId)
            .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        
        return usuario.getReservas().stream()
                .filter(r -> r.getStatus() == StatusReserva.CONFIRMADO)
                .collect(Collectors.toList());
    }

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