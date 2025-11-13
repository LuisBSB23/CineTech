package com.cinetech.dominio.repositorio;

import com.cinetech.dominio.modelo.ItemReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Interface de repositório para a entidade ItemReserva.
 * (Refatoração do 'ItemPedido.java' [cite: 4] original).
 */
@Repository
public interface ItemReservaRepositorio extends JpaRepository<ItemReserva, Long> {
    
    /**
     * Método de consulta customizado para encontrar um item
     * em uma reserva específica, para uma sessão específica.
     * Usado para evitar duplicatas (lógica do 'adicionarItem' [cite: 7] original).
     */
    Optional<ItemReserva> findByReservaIdAndSessaoId(Long reservaId, Long sessaoId);
}