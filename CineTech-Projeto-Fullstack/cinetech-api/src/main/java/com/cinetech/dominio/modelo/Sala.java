package com.cinetech.dominio.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "TB_SALA")
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private int capacidadeTotal;

    /**
     * CORREÇÃO: @JsonIgnore evita recursão (Sala -> Sessao -> Sala...).
     */
    @OneToMany(mappedBy = "sala")
    @JsonIgnore
    private List<Sessao> sessoes;

    public Sala() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public int getCapacidadeTotal() { return capacidadeTotal; }
    public void setCapacidadeTotal(int capacidadeTotal) { this.capacidadeTotal = capacidadeTotal; }
    public List<Sessao> getSessoes() { return sessoes; }
    public void setSessoes(List<Sessao> sessoes) { this.sessoes = sessoes; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Sala sala = (Sala) o;
        return Objects.equals(id, sala.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}