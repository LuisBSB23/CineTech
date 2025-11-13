package com.cinetech.dominio.modelo;

import jakarta.persistence.*;
import org.springframework.lang.NonNull; // IMPORTAÇÃO ADICIONADA

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

/**
 * Entidade JPA que mapeia a tabela TB_RESERVA.
 * Esta classe é a refatoração da 'Pedido.java' original.
 * Representa o "carrinho de compras" ou a reserva confirmada.
 */
@Entity
@Table(name = "TB_RESERVA")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataHoraCriacao;

    /**
     * Mapeia o Enum 'StatusReserva' para uma coluna String no banco.
     */
    @Enumerated(EnumType.STRING)
    private StatusReserva status;

    private Double valorTotal;

    /**
     * Relacionamento: Muitas Reservas pertencem a um Usuário.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    /**
     * Relacionamento: Uma Reserva tem muitos Itens de Reserva.
     * CascadeType.ALL: Se a Reserva for deletada, os Itens também serão.
     * mappedBy: Indica que a entidade ItemReserva gerencia o relacionamento.
     */
    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ItemReserva> itens;
    
    // Construtor padrão (JPA)
    public Reserva() {
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getDataHoraCriacao() { return dataHoraCriacao; }
    public void setDataHoraCriacao(LocalDateTime dataHoraCriacao) { this.dataHoraCriacao = dataHoraCriacao; }
    public StatusReserva getStatus() { return status; }
    public void setStatus(StatusReserva status) { this.status = status; }
    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public List<ItemReserva> getItens() { return itens; }
    public void setItens(@NonNull List<ItemReserva> itens) { // ANOTAÇÃO ADICIONADA
        this.itens = itens;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Reserva reserva = (Reserva) o;
        return Objects.equals(id, reserva.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}