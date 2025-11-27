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
    @Column(columnDefinition = "TEXT")
    private String sinopse;

    private int duracaoMinutos;
    
    @Column(length = 500)
    private String imagemUrl;

    @Column(nullable = false)
    private String generos;

    // MUDANÇA: Adicionado CascadeType.REMOVE para deletar sessões quando o filme for deletado
    @OneToMany(mappedBy = "filme", cascade = CascadeType.REMOVE)
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
    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
    
    public String getGeneros() { return generos; }
    public void setGeneros(String generos) { this.generos = generos; }
    
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