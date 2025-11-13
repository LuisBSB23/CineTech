package com.cinetech.dominio.modelo;

import jakarta.persistence.*;
import java.util.List;
import java.util.Objects;

/**
 * Entidade JPA que mapeia a tabela TB_SALA,
 * conforme o esquema do banco de dados [cite: 0].
 */
@Entity
@Table(name = "TB_SALA")
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome; // Ex: "Sala 3"

    private int capacidadeTotal;

    /**
     * Mapeamento do relacionamento: Uma Sala pode ter várias Sessões.
     */
    @OneToMany(mappedBy = "sala")
    private List<Sessao> sessoes;

    // Construtor padrão (JPA)
    public Sala() {
    }

    // Getters e Setters
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