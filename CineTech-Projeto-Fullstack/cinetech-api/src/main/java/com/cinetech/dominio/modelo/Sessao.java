package com.cinetech.dominio.modelo;

import com.cinetech.excecao.AssentosEsgotadosExcecao;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "TB_SESSAO")
public class Sessao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @Column(nullable = false)
    private Double valorIngresso;

    @Column(nullable = false)
    private int assentosDisponiveis;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "filme_id", nullable = false)
    private Filme filme;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sala_id", nullable = false)
    private Sala sala;

    // NOVO: Relacionamento para permitir o Cascade Remove dos itens se a sessão for deletada
    @OneToMany(mappedBy = "sessao", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<ItemReserva> itens;
    
    public Sessao() {
    }

    public void diminuirAssentosDisponiveis(int quantidade) {
        if (this.assentosDisponiveis < quantidade) {
            throw new AssentosEsgotadosExcecao(
                "Assentos insuficientes para a sessão. Disponível: " + 
                this.assentosDisponiveis + ", Solicitado: " + quantidade
            );
        }
        this.assentosDisponiveis -= quantidade;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public Double getValorIngresso() { return valorIngresso; }
    public void setValorIngresso(Double valorIngresso) { this.valorIngresso = valorIngresso; }
    public int getAssentosDisponiveis() { return assentosDisponiveis; }
    public void setAssentosDisponiveis(int assentosDisponiveis) { this.assentosDisponiveis = assentosDisponiveis; }
    public Filme getFilme() { return filme; }
    public void setFilme(Filme filme) { this.filme = filme; }
    public Sala getSala() { return sala; }
    public void setSala(Sala sala) { this.sala = sala; }
    public List<ItemReserva> getItens() { return itens; }
    public void setItens(List<ItemReserva> itens) { this.itens = itens; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Sessao sessao = (Sessao) o;
        return Objects.equals(id, sessao.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}