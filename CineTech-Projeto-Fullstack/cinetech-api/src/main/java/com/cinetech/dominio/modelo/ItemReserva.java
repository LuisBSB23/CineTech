package com.cinetech.dominio.modelo;

import jakarta.persistence.*;
import org.springframework.lang.NonNull; // IMPORTAÇÃO ADICIONADA

import java.util.Objects;

/**
 * Entidade JPA que mapeia a tabela TB_ITEM_RESERVA.
 * Esta classe é a refatoração da 'ItemPedido.java' original.
 * Ela representa a linha de um item dentro da reserva (o "produto" e a "quantidade").
 */
@Entity
@Table(name = "TB_ITEM_RESERVA")
public class ItemReserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int quantidade;

    /**
     * Relacionamento: Muitos Itens pertencem a uma Reserva.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id", nullable = false)
    private Reserva reserva;

    /**
     * Relacionamento: Muitos Itens referem-se a uma Sessão (o "produto" comprado).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sessao_id", nullable = false)
    private Sessao sessao;
    
    // Construtor padrão (JPA)
    public ItemReserva() {
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getQuantidade() { return quantidade; }
    public void setQuantidade(int quantidade) { this.quantidade = quantidade; }
    public Reserva getReserva() { return reserva; }
    public void setReserva(Reserva reserva) { this.reserva = reserva; }
    public Sessao getSessao() { return sessao; }
    public void setSessao(@NonNull Sessao sessao) { // ANOTAÇÃO ADICIONADA
        this.sessao = sessao;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ItemReserva that = (ItemReserva) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}