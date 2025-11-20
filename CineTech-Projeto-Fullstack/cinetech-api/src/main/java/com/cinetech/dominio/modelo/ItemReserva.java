package com.cinetech.dominio.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.lang.NonNull;

import java.util.Objects;

@Entity
@Table(name = "TB_ITEM_RESERVA")
public class ItemReserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int quantidade;

    // NOVO CAMPO: Armazena os assentos como texto (ex: "A1,A2,B5")
    @Column(name = "assentos")
    private String assentos;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id", nullable = false)
    @JsonIgnore
    private Reserva reserva;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sessao_id", nullable = false)
    private Sessao sessao;
    
    public ItemReserva() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getQuantidade() { return quantidade; }
    public void setQuantidade(int quantidade) { this.quantidade = quantidade; }
    
    // Getters e Setters para Assentos
    public String getAssentos() { return assentos; }
    public void setAssentos(String assentos) { this.assentos = assentos; }

    public Reserva getReserva() { return reserva; }
    public void setReserva(Reserva reserva) { this.reserva = reserva; }
    
    @NonNull
    @SuppressWarnings("null")
    public Sessao getSessao() { return sessao; }
    
    public void setSessao(@NonNull Sessao sessao) {
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