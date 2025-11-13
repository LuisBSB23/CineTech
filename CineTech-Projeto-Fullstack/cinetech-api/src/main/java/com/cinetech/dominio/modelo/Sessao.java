package com.cinetech.dominio.modelo;

import com.cinetech.excecao.AssentosEsgotadosExcecao;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Entidade JPA que mapeia a tabela TB_SESSAO.
 * Esta é a classe central que refatora a 'Produto.java' [cite: 8, 9] original.
 * O campo 'assentosDisponiveis' é o "estoque" do sistema.
 */
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

    /**
     * O "estoque" do backend original [cite: 9].
     * Este campo é crítico para a lógica de negócio (RF-003, RF-006) [cite: 2].
     */
    @Column(nullable = false)
    private int assentosDisponiveis;

    /**
     * Relacionamento: Muitas Sessões pertencem a um Filme.
     * 'JoinColumn' define a chave estrangeira.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "filme_id", nullable = false)
    private Filme filme;

    /**
     * Relacionamento: Muitas Sessões ocorrem em uma Sala.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sala_id", nullable = false)
    private Sala sala;
    
    // Construtor padrão (JPA)
    public Sessao() {
    }

    /**
     * Lógica de negócio (similar ao 'diminuirEstoque' [cite: 9] original)
     * @param quantidade A quantidade de assentos a diminuir.
     */
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