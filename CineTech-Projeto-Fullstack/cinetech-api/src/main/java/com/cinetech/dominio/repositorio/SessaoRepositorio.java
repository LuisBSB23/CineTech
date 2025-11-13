package com.cinetech.dominio.repositorio;

import com.cinetech.dominio.modelo.Sessao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Importação adicionada

/**
 * Interface de repositório para a entidade Sessao.
 * Utiliza o Spring Data JPA para acesso ao banco de dados.
 */
@Repository
public interface SessaoRepositorio extends JpaRepository<Sessao, Long> {

    /**
     * NOVO MÉTODO (Implementação da correção)
     * * Busca todas as sessões associadas a um ID de filme específico.
     * O Spring Data JPA cria a consulta automaticamente com base no nome do método.
     * Isso permite uma busca eficiente no banco de dados.
     *
     * @param filmeId O ID do filme (TB_FILME) para o qual buscar as sessões.
     * @return Uma lista de objetos Sessao associados ao filme.
     */
    List<Sessao> findByFilmeId(Long filmeId);
}