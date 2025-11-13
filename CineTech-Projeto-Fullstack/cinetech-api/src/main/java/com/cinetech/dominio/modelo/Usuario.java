package com.cinetech.dominio.modelo;

import jakarta.persistence.*;
import java.util.List;
import java.util.Objects;

/**
 * Entidade JPA que mapeia a tabela TB_USUARIO.
 * Esta classe é a refatoração da 'Cliente.java' [cite: 1] original
 * para persistência em banco de dados.
 */
@Entity
@Table(name = "TB_USUARIO")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    /**
     * Mapeamento do relacionamento: Um Usuário pode ter muitas Reservas.
     * 'mappedBy = "usuario"' indica que a entidade Reserva é a dona do relacionamento.
     */
    @OneToMany(mappedBy = "usuario")
    private List<Reserva> reservas;

    // Construtor padrão (necessário para JPA)
    public Usuario() {
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public List<Reserva> getReservas() { return reservas; }
    public void setReservas(List<Reserva> reservas) { this.reservas = reservas; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Usuario usuario = (Usuario) o;
        return Objects.equals(id, usuario.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}