package com.cinetech.servico;

import com.cinetech.dominio.modelo.*;
import com.cinetech.dominio.repositorio.ReservaRepositorio;
import com.cinetech.dominio.repositorio.SessaoRepositorio;
import com.cinetech.excecao.AssentosEsgotadosExcecao;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Classe de Teste Unitário para o ReservaServico.
 */
@ExtendWith(MockitoExtension.class)
class ReservaServicoTest {

    @Mock
    private ReservaRepositorio reservaRepositorio;

    @Mock
    private SessaoRepositorio sessaoRepositorio;

    @InjectMocks
    private ReservaServico reservaServico;

    // Variáveis de setup
    private Filme filme;
    private Sessao sessao;
    private Reserva reserva;
    private ItemReserva itemReserva;

    @BeforeEach
    void setUp() {
        filme = new Filme();
        filme.setId(1L);
        filme.setTitulo("Filme Teste");

        sessao = new Sessao();
        sessao.setId(1L);
        sessao.setFilme(filme);
        sessao.setDataHora(LocalDateTime.now());
        sessao.setValorIngresso(15.00);
    }

    /**
     * Teste para o Cenário de Sucesso (RF-008).
     */
    @Test
    @DisplayName("Deve Confirmar Reserva Quando Há Assentos Suficientes")
    void deveConfirmarReservaComSucesso_QuandoHaAssentosSuficientes() {
        // Preparação: Sessão com 10 assentos, pedido de 2
        sessao.setAssentosDisponiveis(10);
        reserva = new Reserva();
        reserva.setId(1L);
        reserva.setStatus(StatusReserva.ABERTO);
        itemReserva = new ItemReserva();
        itemReserva.setQuantidade(2);
        itemReserva.setSessao(sessao);
        reserva.setItens(List.of(itemReserva));

        when(reservaRepositorio.findById(1L)).thenReturn(Optional.of(reserva));

        // Execução
        reservaServico.confirmarReserva(1L);

        // Verificação (Assert)
        assertEquals(StatusReserva.CONFIRMADO, reserva.getStatus());
        assertEquals(8, sessao.getAssentosDisponiveis()); // Estoque baixou
        assertEquals(30.00, reserva.getValorTotal());
        verify(sessaoRepositorio, times(1)).save(sessao);
        verify(reservaRepositorio, times(1)).save(reserva);
    }

    /**
     * Teste para o Cenário de Falha (RF-007).
     */
    @Test
    @DisplayName("Deve Lançar Exceção Quando Não Há Assentos Suficientes")
    void deveLancarExcecaoEStatusCancelado_QuandoNaoHaAssentosSuficientes() {
        // Preparação: Sessão com 1 assento, pedido de 2
        sessao.setAssentosDisponiveis(1);
        reserva = new Reserva();
        reserva.setId(1L);
        reserva.setStatus(StatusReserva.ABERTO);
        itemReserva = new ItemReserva();
        itemReserva.setQuantidade(2); // Pede mais
        itemReserva.setSessao(sessao);
        reserva.setItens(List.of(itemReserva));

        when(reservaRepositorio.findById(1L)).thenReturn(Optional.of(reserva));
        
        // Execução e Verificação
        assertThrows(AssentosEsgotadosExcecao.class, () -> {
            reservaServico.confirmarReserva(1L);
        });

        // Verificação Pós-Falha
        assertEquals(StatusReserva.CANCELADO, reserva.getStatus());
        assertEquals(1, sessao.getAssentosDisponiveis()); // Estoque não mudou
        verify(sessaoRepositorio, never()).save(sessao); // Baixa de estoque nunca chamada
        verify(reservaRepositorio, times(1)).save(reserva); // Salva o status CANCELADO
    }
}