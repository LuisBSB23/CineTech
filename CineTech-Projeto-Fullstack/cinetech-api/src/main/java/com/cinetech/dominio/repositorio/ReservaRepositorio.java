package com.cinetech.dominio.repositorio;

import com.cinetech.dominio.modelo.Reserva;
import com.cinetech.dominio.modelo.StatusReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // Importação necessária
import java.util.Optional;

/**
 * Interface de repositório para a entidade Reserva.
 */
@Repository
public interface ReservaRepositorio extends JpaRepository<Reserva, Long> {
    
    // Busca uma reserva específica de um utilizador com um certo status (ex: ABERTO)
    Optional<Reserva> findByUsuarioIdAndStatus(Long usuarioId, StatusReserva status);

    // NOVO: Busca todas as reservas de um usuário (para exclusão de conta)
    List<Reserva> findByUsuarioId(Long usuarioId);
}