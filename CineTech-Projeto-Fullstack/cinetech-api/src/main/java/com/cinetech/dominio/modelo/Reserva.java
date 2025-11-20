package com.cinetech.dominio.modelo;

import jakarta.persistence.*;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Entidade JPA que mapeia a tabela TB_RESERVA.
 */
@Entity
@Table(name = "TB_RESERVA")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataHoraCriacao;

    @Enumerated(EnumType.STRING)
    private StatusReserva status;

    private Double valorTotal;

    /**
     * MODIFICADO: Alterado de LAZY para EAGER.
     * Isso garante que os dados do Usuário estejam disponíveis quando o controlador
     * tentar enviar a resposta JSON da confirmação, evitando o erro 500.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<ItemReserva> itens = new ArrayList<>();
    
    // Construtor padrão
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
    public void setItens(@NonNull List<ItemReserva> itens) {
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