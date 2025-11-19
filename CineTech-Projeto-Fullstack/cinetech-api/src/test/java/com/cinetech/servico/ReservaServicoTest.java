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

@ExtendWith(MockitoExtension.class)
// CORREÇÃO: Suprime avisos de nulidade em toda a classe de teste.
// Testes usam Mocks e objetos parciais, então esses avisos são falsos positivos aqui.
@SuppressWarnings("null")
class ReservaServicoTest {

    @Mock
    private ReservaRepositorio reservaRepositorio;

    @Mock
    private SessaoRepositorio sessaoRepositorio;

    @InjectMocks
    private ReservaServico reservaServico;

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

    @Test
    @DisplayName("Deve Confirmar Reserva Quando Há Assentos Suficientes")
    void deveConfirmarReservaComSucesso_QuandoHaAssentosSuficientes() {
        sessao.setAssentosDisponiveis(10);
        reserva = new Reserva();
        reserva.setId(1L);
        reserva.setStatus(StatusReserva.ABERTO);
        itemReserva = new ItemReserva();
        itemReserva.setQuantidade(2);
        itemReserva.setSessao(sessao);
        reserva.setItens(List.of(itemReserva));

        when(reservaRepositorio.findById(1L)).thenReturn(Optional.of(reserva));

        reservaServico.confirmarReserva(1L);

        assertEquals(StatusReserva.CONFIRMADO, reserva.getStatus());
        assertEquals(8, sessao.getAssentosDisponiveis()); 
        assertEquals(30.00, reserva.getValorTotal());
        verify(sessaoRepositorio, times(1)).save(sessao);
        verify(reservaRepositorio, times(1)).save(reserva);
    }

    @Test
    @DisplayName("Deve Lançar Exceção Quando Não Há Assentos Suficientes")
    void deveLancarExcecaoEStatusCancelado_QuandoNaoHaAssentosSuficientes() {
        sessao.setAssentosDisponiveis(1);
        reserva = new Reserva();
        reserva.setId(1L);
        reserva.setStatus(StatusReserva.ABERTO);
        itemReserva = new ItemReserva();
        itemReserva.setQuantidade(2); 
        itemReserva.setSessao(sessao);
        reserva.setItens(List.of(itemReserva));

        when(reservaRepositorio.findById(1L)).thenReturn(Optional.of(reserva));
        
        assertThrows(AssentosEsgotadosExcecao.class, () -> {
            reservaServico.confirmarReserva(1L);
        });

        assertEquals(StatusReserva.CANCELADO, reserva.getStatus());
        assertEquals(1, sessao.getAssentosDisponiveis()); 
        verify(sessaoRepositorio, never()).save(sessao); 
        verify(reservaRepositorio, times(1)).save(reserva); 
    }
}