package com.cinetech.dominio.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "TB_FILME")
public class Filme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Lob
    private String sinopse;

    private int duracaoMinutos;

    /**
     * CORREÇÃO: @JsonIgnore evita recursão (Filme -> Sessao -> Filme...).
     */
    @OneToMany(mappedBy = "filme")
    @JsonIgnore
    private List<Sessao> sessoes;

    public Filme() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getSinopse() { return sinopse; }
    public void setSinopse(String sinopse) { this.sinopse = sinopse; }
    public int getDuracaoMinutos() { return duracaoMinutos; }
    public void setDuracaoMinutos(int duracaoMinutos) { this.duracaoMinutos = duracaoMinutos; }
    public List<Sessao> getSessoes() { return sessoes; }
    public void setSessoes(List<Sessao> sessoes) { this.sessoes = sessoes; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Filme filme = (Filme) o;
        return Objects.equals(id, filme.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}