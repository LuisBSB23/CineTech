package com.cinetech.dominio.repositorio;

import com.cinetech.dominio.modelo.Reserva;
import com.cinetech.dominio.modelo.StatusReserva; // Importação Adicionada
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional; // Importação Adicionada

/**
 * Interface de repositório para a entidade Reserva.
 */
@Repository
public interface ReservaRepositorio extends JpaRepository<Reserva, Long> {
    
    // NOVO: Busca uma reserva específica de um utilizador com um certo status (ex: ABERTO)
    Optional<Reserva> findByUsuarioIdAndStatus(Long usuarioId, StatusReserva status);
}