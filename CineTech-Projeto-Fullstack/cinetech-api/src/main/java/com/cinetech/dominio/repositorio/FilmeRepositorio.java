package com.cinetech.dominio.repositorio;

import com.cinetech.dominio.modelo.Filme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface de repositório para a entidade Filme.
 * O Spring Data JPA criará a implementação em tempo de execução.
 */
@Repository
public interface FilmeRepositorio extends JpaRepository<Filme, Long> {
    // Métodos de consulta customizados podem ser adicionados aqui.
}